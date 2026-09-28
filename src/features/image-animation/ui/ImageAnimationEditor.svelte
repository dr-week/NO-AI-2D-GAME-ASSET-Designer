<script lang="ts">
  import { onDestroy } from 'svelte'
  import ImageCanvas from './ImageCanvas.svelte'
  import ImageLayerPanel from './ImageLayerPanel.svelte'
  import { createColorMask, disposeColorMaskWorker } from '../model/imageMasks'
  import { loadImageFile } from '../io/imageFiles'
  import type { Layer, Motion, Point } from '../model/types'
  import { animationTemplates, createTemplateMotion } from '../../animation/themeEngine'
  import { createImageProject, loadProjectImage, readImageProject, type ImageProject } from '../io/projectFile'
  import { readProjectLocally, saveProjectLocally } from '../io/projectStore'
  import { exportAnimatedSvg } from '../io/svgExport'
  import { canAddLayer, createImageLayer, createTextLayer as makeTextLayer } from '../model/layers'
  import { downloadBlob } from '../../../platform/download'

  let imageUrl = $state('')
  let imageWidth = $state(0)
  let imageHeight = $state(0)
  let fileName = $state('')
  let error = $state('')
  let draft = $state<Point[]>([])
  let draftMaskUrl = $state('')
  let layerName = $state('New layer')
  let layers = $state<Layer[]>([])
  let selectedId = $state('')
  let backgroundMotion = $state<Motion>('still')
  let maskMode = $state<'polygon' | 'color'>('polygon')
  let colorTolerance = $state(32)
  let maskBusy = $state(false)
  let sourceImage: HTMLImageElement | null = null
  let imageLoadVersion = 0
  let maskRequestVersion = 0
  let projectStatus = $state('')
  let projectError = $state('')
  let hasLocalProject = $state(false)
  let selectedTemplateId = $state('breathe')
  let restoreChecked = false

  const selectedLayer = $derived(layers.find((layer) => layer.id === selectedId))
  const selectedTemplate = $derived(Object.values(animationTemplates).find((template) => template.id === selectedTemplateId) ?? animationTemplates.breathe)

  async function loadImage(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    maskRequestVersion++
    disposeColorMaskWorker()
    maskBusy = false
    projectStatus = ''
    const request = ++imageLoadVersion
    try {
      const loaded = await loadImageFile(file)
      if (request !== imageLoadVersion) { URL.revokeObjectURL(loaded.url); return }
      if (imageUrl) URL.revokeObjectURL(imageUrl)
      imageUrl = loaded.url
      sourceImage = loaded.image
      imageWidth = loaded.image.naturalWidth
      imageHeight = loaded.image.naturalHeight
      fileName = file.name
      layers = []
      draft = []
      draftMaskUrl = ''
      selectedId = ''
      backgroundMotion = 'still'
      error = ''
    } catch (cause) {
      if (request === imageLoadVersion) error = cause instanceof Error ? cause.message : 'Could not load image.'
    } finally { input.value = '' }
  }

  async function addPoint(point: Point) {
    if (maskMode === 'color') {
      if (!sourceImage || maskBusy) return
      const request = ++maskRequestVersion
      maskBusy = true
      projectStatus = 'Creating color mask…'
      try {
        const maskUrl = await createColorMask(sourceImage, point, colorTolerance)
        if (request !== maskRequestVersion) return
        draftMaskUrl = maskUrl
        draft = []
        projectStatus = 'Color mask ready. Create a layer to keep it.'
        error = ''
      } catch (cause) {
        if (request === maskRequestVersion) {
          projectStatus = ''
          error = cause instanceof Error ? cause.message : 'Could not create color mask.'
        }
      } finally {
        if (request === maskRequestVersion) maskBusy = false
      }
      return
    }
    if (draft.length >= 200) { error = 'A polygon mask can contain up to 200 points.'; return }
    draft = [...draft, point]
    error = ''
  }

  function createLayer() {
    if (draft.length < 3 && !draftMaskUrl) return
    if (!canAddLayer(layers)) { error = 'An image can contain up to 32 layers.'; return }
    const id = crypto.randomUUID()
    layers = [...layers, createImageLayer(id, layerName, draft, draftMaskUrl)]
    selectedId = id
    layerName = 'New layer'
    draft = []
    draftMaskUrl = ''
  }

  function createTextLayer(text: string, fill: string, fontSize: number) {
    if (!imageUrl) return
    if (!canAddLayer(layers)) { error = 'An image can contain up to 32 layers.'; return }
    const id = crypto.randomUUID()
    const layer = makeTextLayer(id, text, fill, fontSize, imageWidth, imageHeight)
    if (!layer) return
    layers = [...layers, layer]
    selectedId = id
    error = ''
  }

  function randomAnimation() {
    const templates = Object.values(animationTemplates)
    const randomVariant = () => createTemplateMotion(templates[Math.floor(Math.random() * templates.length)], crypto.getRandomValues(new Uint32Array(1))[0])
    backgroundMotion = randomVariant().motion
    layers = layers.map((layer) => { const variant = randomVariant(); return { ...layer, motion: variant.motion, duration: variant.duration } })
  }

  function updateLayer(id: string, changes: Partial<Pick<Layer, 'name' | 'motion' | 'duration'>>) {
    layers = layers.map((layer) => layer.id === id ? { ...layer, ...changes } : layer)
  }

  function clearDraft() {
    maskRequestVersion++
    disposeColorMaskWorker()
    maskBusy = false
    draft = []
    draftMaskUrl = ''
    if (projectStatus === 'Creating color mask…') projectStatus = ''
    error = ''
  }
  function removeSelectedLayer() { layers = layers.filter((layer) => layer.id !== selectedId); selectedId = '' }

  function sourceAsDataUrl(): string {
    if (!sourceImage || !imageUrl) throw new Error('Choose an image before saving a project.')
    const canvas = document.createElement('canvas')
    canvas.width = imageWidth
    canvas.height = imageHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not prepare project artwork.')
    context.drawImage(sourceImage, 0, 0)
    return canvas.toDataURL('image/png')
  }

  function downloadProject(project: ReturnType<typeof createImageProject>) {
    const blob = new Blob([JSON.stringify(project)], { type: 'application/json' })
    downloadBlob(blob, `${fileName.replace(/\.[^.]+$/, '') || '2dmaker-project'}.2dmaker.json`)
  }

  function saveProject() {
    try {
      const project = createImageProject(imageWidth, imageHeight, sourceAsDataUrl(), fileName, backgroundMotion, layers)
      downloadProject(project)
      try { saveProjectLocally(project); hasLocalProject = true; projectStatus = 'Project downloaded and saved in this browser.' }
      catch (cause) { projectStatus = cause instanceof Error ? cause.message : 'Project downloaded; browser save failed.' }
      projectError = ''
    } catch (cause) { projectError = cause instanceof Error ? cause.message : 'Could not save project.' }
  }

  async function installProject(project: ImageProject, status: string) {
    const restoredUrl = await loadProjectImage(project.imageDataUrl, project.width, project.height)
    const restoredImage = new Image()
    restoredImage.src = restoredUrl
    await restoredImage.decode()
    maskRequestVersion++
    disposeColorMaskWorker()
    maskBusy = false
    if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl)
    imageUrl = restoredUrl
    sourceImage = restoredImage
    imageWidth = project.width
    imageHeight = project.height
    fileName = project.fileName
    backgroundMotion = project.backgroundMotion
    layers = project.layers
    selectedId = ''
    draft = []
    draftMaskUrl = ''
    projectStatus = status
    projectError = ''
    error = ''
  }

  async function openProject(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    try {
      const project = await readImageProject(file)
      await installProject(project, `Opened ${file.name}.`)
    } catch (cause) { projectError = cause instanceof Error ? cause.message : 'Could not open project.' }
    finally { input.value = '' }
  }

  async function restoreLocalProject() {
    const project = readProjectLocally()
    if (!project) { hasLocalProject = false; projectStatus = 'No valid browser-saved project was found.'; return }
    try {
      await installProject(project, 'Restored project from this browser.')
    } catch (cause) { projectError = cause instanceof Error ? cause.message : 'Could not restore browser project.' }
  }

  function exportSvg() {
    try {
      exportAnimatedSvg(createImageProject(imageWidth, imageHeight, sourceAsDataUrl(), fileName, backgroundMotion, layers))
      projectStatus = 'Animated SVG exported.'
      projectError = ''
    } catch (cause) { projectError = cause instanceof Error ? cause.message : 'SVG export failed.' }
  }

  function applyTemplate() {
    if (!selectedLayer) return
    const variant = createTemplateMotion(selectedTemplate, crypto.getRandomValues(new Uint32Array(1))[0])
    updateLayer(selectedLayer.id, { motion: variant.motion, duration: variant.duration })
  }

  $effect(() => {
    if (restoreChecked) return
    restoreChecked = true
    const saved = readProjectLocally()
    if (!saved) return
    hasLocalProject = true
    projectStatus = 'A project saved in this browser is available to restore.'
  })

  onDestroy(() => {
    imageLoadVersion++
    maskRequestVersion++
    disposeColorMaskWorker()
    if (imageUrl) URL.revokeObjectURL(imageUrl)
  })
</script>

<section class="image-editor" aria-label="Animation workspace">
  <ImageLayerPanel
    {imageUrl} {fileName} width={imageWidth} height={imageHeight} {error} {draft} {draftMaskUrl} {layerName} {layers}
    {selectedLayer} {backgroundMotion} {maskMode} {colorTolerance} {projectStatus} {projectError} {selectedTemplateId} {hasLocalProject}
    onLoadImage={loadImage}
    onRandomAnimation={randomAnimation}
    onBackgroundMotionChange={(motion) => backgroundMotion = motion}
    onLayerNameChange={(name) => layerName = name}
    onMaskModeChange={(mode) => { maskMode = mode; clearDraft() }}
    onToleranceChange={(value) => { maskRequestVersion++; disposeColorMaskWorker(); maskBusy = false; if (projectStatus === 'Creating color mask…') projectStatus = ''; colorTolerance = value }}
    onClearDraft={clearDraft}
    onCreateLayer={createLayer}
    onCreateTextLayer={createTextLayer}
    onSelectLayer={(id) => selectedId = id}
    onUpdateLayer={updateLayer}
    onRemoveLayer={removeSelectedLayer}
    onSaveProject={saveProject}
    onOpenProject={openProject}
    onRestoreProject={restoreLocalProject}
    onExportSvg={exportSvg}
    onTemplateChange={(id) => selectedTemplateId = id}
    onApplyTemplate={applyTemplate}
  />
  <div class="image-stage" class:empty-stage={!imageUrl}>
    {#if imageUrl}
      <ImageCanvas imageUrl={imageUrl} width={imageWidth} height={imageHeight} {layers} {backgroundMotion} {draft} {draftMaskUrl} onAddPoint={addPoint} />
      <p class="stage-hint">Click around a ship, cloud, text, or other region to create a layer.</p>
    {:else}
      <div class="empty-prompt"><strong>Start from any image</strong><span>PNG · JPEG · WebP</span></div>
    {/if}
  </div>
</section>

<style lang="scss">
  .image-editor { display: grid; grid-template-columns: minmax(270px, 310px) minmax(0, 1fr); gap: 18px; max-width: 1640px; margin: 0 auto; padding: 20px 24px 28px; }
  .image-stage { display: grid; justify-items: center; align-content: center; gap: 10px; min-width: 0; min-height: min(78svh, 860px); padding: clamp(14px, 2vw, 26px); background-color: var(--surface-raised); background-image: conic-gradient(#e6e1d7 25%, transparent 0 50%, #e6e1d7 0 75%, transparent 0); background-size: 18px 18px; border: 1px solid var(--border); border-radius: 15px; box-shadow: var(--shadow); }
  .empty-stage { background: var(--surface); }
  .empty-prompt { display: grid; gap: 7px; justify-items: center; color: var(--muted); font-size: .8rem; }
  .empty-prompt strong { color: var(--text); font-size: .95rem; font-weight: 550; }
  .stage-hint { margin: 0; color: var(--muted); font-size: .72rem; }
  @media (max-width: 800px) { .image-editor { grid-template-columns: minmax(0, 1fr); gap: 12px; padding: 14px; } .image-stage { min-height: 50svh; } }
</style>

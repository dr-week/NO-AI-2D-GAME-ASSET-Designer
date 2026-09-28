<script lang="ts">
  import { onDestroy } from 'svelte'
  import ImageCanvas from './ImageCanvas.svelte'
  import ImageLayerPanel from './ImageLayerPanel.svelte'
  import { createColorMask } from '../model/imageMasks'
  import { loadImageFile } from '../io/imageFiles'
  import type { Layer, Motion, Point } from '../model/types'
  import { animationTemplates, createMotionVariant, type AnimationThemeId } from '../../animation/themeEngine'
  import { createImageProject, loadProjectImage, readImageProject } from '../io/projectFile'
  import { readProjectLocally, saveProjectLocally } from '../io/projectStore'
  import { exportAnimatedSvg } from '../io/svgExport'

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
  let sourceImage: HTMLImageElement | null = null
  let imageLoadVersion = 0
  let projectStatus = $state('')
  let projectError = $state('')
  let hasLocalProject = $state(false)
  let selectedTemplateId = $state('breathe')
  let themeId = $state<AnimationThemeId>('soft')
  let restoreChecked = false

  const selectedLayer = $derived(layers.find((layer) => layer.id === selectedId))
  const selectedTemplate = $derived(Object.values(animationTemplates).find((template) => template.id === selectedTemplateId) ?? animationTemplates.breathe)

  async function loadImage(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
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

  function addPoint(point: Point) {
    if (maskMode === 'color') {
      if (!sourceImage) return
      try {
        draftMaskUrl = createColorMask(sourceImage, point, colorTolerance)
        draft = []
        error = ''
      } catch (cause) { error = cause instanceof Error ? cause.message : 'Could not create color mask.' }
      return
    }
    if (draft.length >= 200) { error = 'A polygon mask can contain up to 200 points.'; return }
    draft = [...draft, point]
    error = ''
  }

  function createLayer() {
    if (draft.length < 3 && !draftMaskUrl) return
    if (layers.length >= 32) { error = 'An image can contain up to 32 layers.'; return }
    const id = crypto.randomUUID()
    layers = [...layers, { id, name: layerName.trim() || 'Untitled layer', points: draft, maskUrl: draftMaskUrl, motion: 'still', duration: 3, kind: 'image' }]
    selectedId = id
    layerName = 'New layer'
    draft = []
    draftMaskUrl = ''
  }

  function createTextLayer(text: string, fill: string, fontSize: number) {
    if (!imageUrl || !text.trim() || text.length > 500 || !/^#[\da-fA-F]{6}$/.test(fill) || !Number.isFinite(fontSize) || fontSize < 8 || fontSize > 400) return
    if (layers.length >= 32) { error = 'An image can contain up to 32 layers.'; return }
    const cleanText = text.trim()
    const id = crypto.randomUUID()
    layers = [...layers, { id, name: cleanText.slice(0, 40), points: [], maskUrl: '', motion: 'rise', duration: 0.35, kind: 'text', text: cleanText, x: imageWidth / 2, y: imageHeight / 2, fontSize, fill }]
    selectedId = id
    error = ''
  }

  function randomAnimation() {
    const templates = Object.values(animationTemplates)
    const randomVariant = () => createMotionVariant(templates[Math.floor(Math.random() * templates.length)], crypto.getRandomValues(new Uint32Array(1))[0], themeId)
    backgroundMotion = randomVariant().motion
    layers = layers.map((layer) => { const variant = randomVariant(); return { ...layer, motion: variant.motion, duration: variant.duration } })
  }

  function updateLayer(id: string, changes: Partial<Pick<Layer, 'name' | 'motion' | 'duration'>>) {
    layers = layers.map((layer) => layer.id === id ? { ...layer, ...changes } : layer)
  }

  function clearDraft() { draft = []; draftMaskUrl = ''; error = '' }
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
    const url = URL.createObjectURL(new Blob([JSON.stringify(project)], { type: 'application/json' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${fileName.replace(/\.[^.]+$/, '') || '2dmaker-project'}.2dmaker.json`
    anchor.click()
    URL.revokeObjectURL(url)
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

  async function openProject(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    try {
      const project = await readImageProject(file)
      const restoredUrl = await loadProjectImage(project.imageDataUrl, project.width, project.height)
      const restoredImage = new Image()
      restoredImage.src = restoredUrl
      await restoredImage.decode()
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
      projectError = ''
      projectStatus = `Opened ${file.name}.`
      error = ''
    } catch (cause) { projectError = cause instanceof Error ? cause.message : 'Could not open project.' }
    finally { input.value = '' }
  }

  async function restoreLocalProject() {
    const project = readProjectLocally()
    if (!project) { hasLocalProject = false; projectStatus = 'No valid browser-saved project was found.'; return }
    try {
      const restoredUrl = await loadProjectImage(project.imageDataUrl, project.width, project.height)
      const restoredImage = new Image()
      restoredImage.src = restoredUrl
      await restoredImage.decode()
      if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl)
      imageUrl = restoredUrl
      sourceImage = restoredImage
      imageWidth = project.width
      imageHeight = project.height
      fileName = project.fileName
      backgroundMotion = project.backgroundMotion
      layers = project.layers
      selectedId = ''
      projectStatus = 'Restored project from this browser.'
      projectError = ''
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
    const variant = createMotionVariant(selectedTemplate, crypto.getRandomValues(new Uint32Array(1))[0], themeId)
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
    if (imageUrl) URL.revokeObjectURL(imageUrl)
  })
</script>

<section class="image-editor" aria-label="Image animation workspace">
  <ImageLayerPanel
    {imageUrl} {fileName} width={imageWidth} height={imageHeight} {error} {draft} {draftMaskUrl} {layerName} {layers}
    {selectedLayer} {backgroundMotion} {maskMode} {colorTolerance} {projectStatus} {projectError} {selectedTemplateId} {hasLocalProject}
    onLoadImage={loadImage}
    onRandomAnimation={randomAnimation}
    onBackgroundMotionChange={(motion) => backgroundMotion = motion}
    onLayerNameChange={(name) => layerName = name}
    onMaskModeChange={(mode) => { maskMode = mode; clearDraft() }}
    onToleranceChange={(value) => colorTolerance = value}
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
  .image-editor { display: grid; grid-template-columns: 290px minmax(0, 1fr); gap: 20px; max-width: 1600px; margin: 0 auto; padding: 24px; }
  .image-stage { display: grid; justify-items: center; align-content: center; gap: 8px; min-width: 0; min-height: 70svh; padding: 20px; background-color: #fff; background-image: conic-gradient(#e9edf3 25%, transparent 0 50%, #e9edf3 0 75%, transparent 0); background-size: 20px 20px; border: 1px solid var(--border); border-radius: 8px; }
  .empty-stage { background: var(--surface); }
  .empty-prompt { display: grid; gap: 8px; justify-items: center; color: var(--muted); }
  .empty-prompt strong { color: var(--text); }
  .stage-hint { margin: 0; color: var(--muted); font-size: .8125rem; }
  @media (max-width: 800px) { .image-editor { grid-template-columns: minmax(0, 1fr); padding: 16px; } .image-stage { min-height: 45svh; } }
</style>

<script lang="ts">
  import './image-animation-panel.scss'
  import AnimationFeedback from './AnimationFeedback.svelte'
  import Icon from '../../../lib/Icon.svelte'
  import type { Layer, Motion, Point } from '../model/types'
  import LayerAuthoring from './LayerAuthoring.svelte'
  import LayerStack from './LayerStack.svelte'
  import MotionControls from './MotionControls.svelte'
  import ProjectActions from './ProjectActions.svelte'

  type Props = {
    imageUrl: string
    fileName: string
    width: number
    height: number
    error: string
    draft: Point[]
    draftMaskUrl: string
    layerName: string
    layers: Layer[]
    selectedLayer?: Layer
    backgroundMotion: Motion
    maskMode: 'polygon' | 'color'
    colorTolerance: number
    onLoadImage: (event: Event) => void
    onRandomAnimation: () => void
    onBackgroundMotionChange: (motion: Motion) => void
    onLayerNameChange: (name: string) => void
    onMaskModeChange: (mode: 'polygon' | 'color') => void
    onToleranceChange: (value: number) => void
    onClearDraft: () => void
    onCreateLayer: () => void
    onCreateTextLayer: (text: string, fill: string, fontSize: number) => void
    onSelectLayer: (id: string) => void
    onUpdateLayer: (id: string, changes: Partial<Pick<Layer, 'name' | 'motion' | 'duration'>>) => void
    onRemoveLayer: () => void
    projectStatus: string
    projectError: string
    onSaveProject: () => void
    onOpenProject: (event: Event) => void
    onRestoreProject: () => void
    hasLocalProject: boolean
    onExportSvg: () => void
    onTemplateChange: (id: string) => void
    onApplyTemplate: () => void
    selectedTemplateId: string
  }
  let {
    imageUrl, fileName, width, height, error, draft, draftMaskUrl, layerName, layers,
    selectedLayer, backgroundMotion, maskMode, colorTolerance, onLoadImage,
    onRandomAnimation, onBackgroundMotionChange, onLayerNameChange, onMaskModeChange,
    onToleranceChange, onClearDraft, onCreateLayer, onCreateTextLayer, onSelectLayer, onUpdateLayer, onRemoveLayer,
    projectStatus, projectError, onSaveProject, onOpenProject, onRestoreProject, hasLocalProject, onExportSvg, onTemplateChange,
    onApplyTemplate, selectedTemplateId,
  }: Props = $props()
</script>

<aside class="image-tools">
  <header class="panel-title">
    <span class="title-icon"><Icon name="image" size={21} /></span>
    <span><h1>Scene</h1><small>Animation</small></span>
    <span class="index-mark" aria-hidden="true">02</span>
  </header>
  <label class="file-picker">
    <Icon name="upload" size={17} /><span>{imageUrl ? 'Replace artwork' : 'Import artwork'}</span>
    <input type="file" accept="image/png,image/jpeg,image/webp" onchange={onLoadImage} />
  </label>
  {#if fileName}<p class="file-name">{fileName} · {width} × {height}</p>{/if}
  {#if error}<p class="error" role="alert">{error}</p>{/if}

  <ProjectActions {imageUrl} {projectStatus} {projectError} {hasLocalProject} {onSaveProject} {onOpenProject} {onRestoreProject} {onExportSvg} />

  {#if imageUrl}
    <AnimationFeedback imageName={fileName} {backgroundMotion} {layers} onRandomAnimation={onRandomAnimation} />
  {/if}

  <MotionControls enabled={Boolean(imageUrl)} {backgroundMotion} {selectedLayer} {selectedTemplateId} {onBackgroundMotionChange} {onTemplateChange} {onApplyTemplate} {onUpdateLayer} />
  <LayerAuthoring enabled={Boolean(imageUrl)} {draft} {draftMaskUrl} {layerName} {maskMode} {colorTolerance} {onLayerNameChange} {onMaskModeChange} {onToleranceChange} {onClearDraft} {onCreateLayer} {onCreateTextLayer} />
  <LayerStack {layers} {selectedLayer} {onSelectLayer} {onUpdateLayer} {onRemoveLayer} />
  <p class="limit-note">Cutouts move best on a clean background.</p>
</aside>

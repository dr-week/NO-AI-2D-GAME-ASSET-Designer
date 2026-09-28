<script lang="ts">
  import AnimationFeedback from './AnimationFeedback.svelte'
  import { animationTemplates, motionDefinitions } from '../../animation/themeEngine'
  import type { Layer, Motion, Point } from '../model/types'

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
  let textValue = $state('Your text')
  let textFill = $state('#283247')
  let textSize = $state(64)
</script>

<aside class="image-tools">
  <h1>Image animation</h1>
  <p>Import an image, separate regions into layers, and preview motion.</p>
  <label class="file-picker">
    <span>{imageUrl ? 'Replace image' : 'Choose image'}</span>
    <input type="file" accept="image/png,image/jpeg,image/webp" onchange={onLoadImage} />
  </label>
  {#if fileName}<p class="file-name">{fileName} · {width} × {height}</p>{/if}
  {#if error}<p class="error" role="alert">{error}</p>{/if}
  <section class="project-actions" aria-label="Project files">
    <button type="button" onclick={onSaveProject}>Save project JSON</button>
    <label class="project-open">Open project JSON<input type="file" accept="application/json,.json" onchange={onOpenProject} /></label>
    {#if hasLocalProject}<button type="button" onclick={onRestoreProject}>Restore browser-saved project</button>{/if}
    <button type="button" disabled={!imageUrl} onclick={onExportSvg}>Export SVG</button>
    <p aria-live="polite">{projectStatus}</p>
    {#if projectError}<p class="error" role="alert">{projectError}</p>{/if}
  </section>

  {#if imageUrl}
    <AnimationFeedback imageName={fileName} {backgroundMotion} {layers} onRandomAnimation={onRandomAnimation} />
    <label for="background-motion">Background motion</label>
    <select id="background-motion" value={backgroundMotion} onchange={(event) => onBackgroundMotionChange(event.currentTarget.value as Motion)}>
      {#each Object.keys(motionDefinitions) as motion}<option value={motion}>{motionDefinitions[motion as Motion].name}</option>{/each}
    </select>
    <section class="template-panel" aria-labelledby="template-title">
      <h2 id="template-title">Motion template</h2>
      <label for="motion-template">Template</label>
      <select id="motion-template" value={selectedTemplateId} onchange={(event) => onTemplateChange(event.currentTarget.value)}>
        {#each Object.values(animationTemplates) as template (template.id)}<option value={template.id}>{template.name}</option>{/each}
      </select>
      <p>{Object.values(animationTemplates).find((template) => template.id === selectedTemplateId)?.description}</p>
      <button type="button" disabled={!selectedLayer} onclick={onApplyTemplate}>Apply to selected layer</button>
    </section>
    <section class="layer-creator" aria-labelledby="new-layer-title">
      <h2 id="new-layer-title">Separate a region</h2>
      <p>Outline a region, or select a flat-color area.</p>
      <label for="layer-name">Layer name</label>
      <input id="layer-name" value={layerName} maxlength="60" oninput={(event) => onLayerNameChange(event.currentTarget.value)} />
      <label for="mask-mode">Selection method</label>
      <select id="mask-mode" value={maskMode} onchange={(event) => onMaskModeChange(event.currentTarget.value as 'polygon' | 'color')}>
        <option value="polygon">Polygon</option><option value="color">Color region</option>
      </select>
      {#if maskMode === 'color'}
        <label for="color-tolerance">Color tolerance: {colorTolerance}</label>
        <input id="color-tolerance" type="range" min="0" max="100" value={colorTolerance} oninput={(event) => onToleranceChange(Number(event.currentTarget.value))} />
      {/if}
      <div class="button-row">
        <button type="button" onclick={onClearDraft}>Clear selection</button>
        <button type="button" disabled={draft.length < 3 && !draftMaskUrl} onclick={onCreateLayer}>Create layer</button>
      </div>
    </section>
    <section class="text-creator" aria-labelledby="text-title">
      <h2 id="text-title">Add text</h2>
      <label for="text-content">Text</label>
      <textarea id="text-content" bind:value={textValue} maxlength="500" rows="2"></textarea>
      <label for="text-size">Size</label>
      <input id="text-size" type="number" min="8" max="400" bind:value={textSize} />
      <label for="text-fill">Color</label>
      <input id="text-fill" type="color" bind:value={textFill} />
      <button type="button" disabled={!textValue.trim()} onclick={() => onCreateTextLayer(textValue, textFill, textSize)}>Add text layer</button>
    </section>
  {/if}

  <section class="layer-list" aria-labelledby="layers-title">
    <h2 id="layers-title">Layers <span>{layers.length}</span></h2>
    {#each layers as layer (layer.id)}
      <button class:selected={layer.id === selectedLayer?.id} class="layer-row" type="button" onclick={() => onSelectLayer(layer.id)}>
        <span class="layer-dot" aria-hidden="true"></span>{layer.name}
      </button>
    {:else}
      <p class="empty">No separated layers yet.</p>
    {/each}
  </section>

  {#if selectedLayer}
    <section class="layer-settings" aria-labelledby="settings-title">
      <h2 id="settings-title">Selected layer</h2>
      <label for="selected-layer-name">Name</label>
      <input id="selected-layer-name" value={selectedLayer.name} maxlength="60" oninput={(event) => onUpdateLayer(selectedLayer.id, { name: event.currentTarget.value })} />
      <label for="motion-mode">Motion</label>
      <select id="motion-mode" value={selectedLayer.motion} onchange={(event) => onUpdateLayer(selectedLayer.id, { motion: event.currentTarget.value as Motion })}>
        {#each Object.keys(motionDefinitions) as motion}<option value={motion}>{motionDefinitions[motion as Motion].name}</option>{/each}
      </select>
      {#if motionDefinitions[selectedLayer.motion].transform?.repeat}
        <label for="motion-duration">Cycle: {selectedLayer.duration}s</label>
        <input id="motion-duration" type="range" min="0.5" max="10" step="0.5" value={selectedLayer.duration} oninput={(event) => onUpdateLayer(selectedLayer.id, { duration: Number(event.currentTarget.value) })} />
      {/if}
      <button class="remove" type="button" onclick={onRemoveLayer}>Remove layer</button>
    </section>
  {/if}
  <p class="limit-note">Moving a cutout cleanly needs a background without that object. Flat-color selection works best on simple art.</p>
</aside>

<style lang="scss">
  .image-tools { align-self: start; padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
    h1 { margin: 0; font-size: 1.125rem; }
    h2 { display: flex; justify-content: space-between; margin: 20px 0 8px; font-size: 0.875rem; }
    p { color: var(--muted); font-size: 0.8125rem; line-height: 1.45; }
    label { display: block; margin: 12px 0 6px; font-size: 0.8125rem; font-weight: 600; }
    input:not([type=file]), select { width: 100%; min-height: 38px; padding: 6px 8px; border: 1px solid var(--border); border-radius: 5px; background: white; color: var(--text); }
    input[type=range] { padding: 0; accent-color: var(--accent); }
  }
  .file-picker { position: relative; display: grid; place-items: center; min-height: 42px; overflow: hidden; border: 1px solid var(--accent); border-radius: 6px; color: var(--accent); font-size: .875rem; font-weight: 600; cursor: pointer;
    input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
    &:focus-within { outline: 3px solid var(--accent); outline-offset: 3px; }
  }
  .file-name { overflow-wrap: anywhere; }
  .project-actions { display: grid; gap: 7px; margin: 14px 0; padding: 10px 0; border-block: 1px solid var(--border); p { margin: 0; } }
  .project-open { position: relative; display: grid; place-items: center; min-height: 36px; border: 1px solid var(--border); border-radius: 5px; background: white; cursor: pointer; input { position: absolute; inset: 0; width: 100%; opacity: 0; cursor: pointer; } }
  .template-panel { padding: 4px 0 12px; border-bottom: 1px solid var(--border); p { margin: 6px 0; } button { width: 100%; } }
  .error { color: #a43d3d !important; }
  .layer-creator, .text-creator, .layer-list, .layer-settings { padding-top: 2px; border-top: 1px solid var(--border); }
  textarea { width: 100%; min-height: 54px; padding: 7px; border: 1px solid var(--border); border-radius: 5px; font: inherit; }
  .text-creator button { width: 100%; margin-top: 8px; }
  .button-row { display: flex; gap: 8px; margin-top: 10px; }
  button, select { font: inherit; }
  button { min-height: 36px; padding: 6px 10px; border: 1px solid var(--border); border-radius: 5px; background: white; color: var(--text); cursor: pointer; }
  button:disabled { opacity: .5; cursor: not-allowed; }
  .button-row button:last-child { border-color: var(--accent); color: var(--accent); }
  .layer-row { display: flex; align-items: center; gap: 8px; width: 100%; margin: 4px 0; text-align: left; overflow-wrap: anywhere; }
  .layer-row.selected { border-color: var(--accent); background: #f3f5ff; }
  .layer-dot { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; background: var(--accent); }
  .empty { margin: 8px 0; }
  .remove { width: 100%; margin-top: 10px; color: #a43d3d; }
  .limit-note { margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--border); }
</style>

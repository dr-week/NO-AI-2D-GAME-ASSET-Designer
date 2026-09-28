<script lang="ts">
  import AnimationFeedback from './AnimationFeedback.svelte'
  import { animationTemplates, defaultMotionDuration, motionDefinitions, type AnimationCategory } from '../../animation/themeEngine'
  import type { Layer, Motion, Point } from '../model/types'
  import Icon from '../../../lib/Icon.svelte'

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
  let selectedCategory = $state<AnimationCategory | 'All'>('All')
  let visibleTemplates = $derived(Object.values(animationTemplates).filter((template) => selectedCategory === 'All' || template.category === selectedCategory))

  function setSelectedMotion(motion: Motion) {
    if (!selectedLayer) return
    onUpdateLayer(selectedLayer.id, { motion, duration: defaultMotionDuration(motion) })
  }

  function changeCategory(category: AnimationCategory | 'All') {
    selectedCategory = category
    const firstMatch = Object.values(animationTemplates).find((template) => category === 'All' || template.category === category)
    if (firstMatch) onTemplateChange(firstMatch.id)
  }
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
  <details class="tool-drawer">
    <summary><Icon name="project" /><span>Project</span></summary>
    <div class="drawer-content project-actions" aria-label="Project files">
      <button type="button" onclick={onSaveProject}><Icon name="project" size={16} />Save JSON</button>
      <label class="project-open"><Icon name="upload" size={16} />Open JSON<input type="file" accept="application/json,.json" onchange={onOpenProject} /></label>
      {#if hasLocalProject}<button type="button" onclick={onRestoreProject}><Icon name="reset" size={16} />Restore local</button>{/if}
      <button type="button" disabled={!imageUrl} onclick={onExportSvg}><Icon name="export" size={16} />Export SVG</button>
      <p aria-live="polite">{projectStatus}</p>
      {#if projectError}<p class="error" role="alert">{projectError}</p>{/if}
    </div>
  </details>

  {#if imageUrl}
    <AnimationFeedback imageName={fileName} {backgroundMotion} {layers} onRandomAnimation={onRandomAnimation} />
    <details class="tool-drawer" open>
      <summary><Icon name="motion" /><span>Themes &amp; motion</span></summary>
      <div class="drawer-content">
        <label for="motion-category">Theme</label>
        <select id="motion-category" value={selectedCategory} onchange={(event) => changeCategory(event.currentTarget.value as AnimationCategory | 'All')}>
          <option value="All">All styles</option><option value="Calm">Calm</option><option value="Playful">Playful</option><option value="Entrance">Entrance</option><option value="Transition">Transition</option>
        </select>
        <label for="background-motion">Canvas</label>
        <select id="background-motion" value={backgroundMotion} onchange={(event) => onBackgroundMotionChange(event.currentTarget.value as Motion)}>
          {#each Object.keys(motionDefinitions) as motion}<option value={motion}>{motionDefinitions[motion as Motion].name}</option>{/each}
        </select>
        <label for="motion-template">Preset</label>
        <select id="motion-template" value={selectedTemplateId} onchange={(event) => onTemplateChange(event.currentTarget.value)}>
          {#each visibleTemplates as template (template.id)}<option value={template.id}>{template.name}</option>{/each}
        </select>
        <button class="action-button" type="button" disabled={!selectedLayer} onclick={onApplyTemplate}>Apply to layer</button>
      </div>
    </details>
    <details class="tool-drawer">
      <summary><Icon name="layers" /><span>New region</span></summary>
      <div class="drawer-content">
        <label for="layer-name">Name</label>
        <input id="layer-name" value={layerName} maxlength="60" oninput={(event) => onLayerNameChange(event.currentTarget.value)} />
        <label for="mask-mode">Select by</label>
        <select id="mask-mode" value={maskMode} onchange={(event) => onMaskModeChange(event.currentTarget.value as 'polygon' | 'color')}>
          <option value="polygon">Outline</option><option value="color">Flat color</option>
        </select>
        {#if maskMode === 'color'}
          <label for="color-tolerance">Tolerance · {colorTolerance}</label>
          <input id="color-tolerance" type="range" min="0" max="100" value={colorTolerance} oninput={(event) => onToleranceChange(Number(event.currentTarget.value))} />
        {/if}
        <div class="button-row">
          <button type="button" onclick={onClearDraft}>Clear</button>
          <button class="action-button" type="button" disabled={draft.length < 3 && !draftMaskUrl} onclick={onCreateLayer}><Icon name="add" size={16} />Create</button>
        </div>
      </div>
    </details>
    <details class="tool-drawer">
      <summary><Icon name="text" /><span>Text</span></summary>
      <div class="drawer-content text-creator">
        <label for="text-content">Copy</label>
        <textarea id="text-content" bind:value={textValue} maxlength="500" rows="2"></textarea>
        <div class="inline-fields">
          <span><label for="text-size">Size</label><input id="text-size" type="number" min="8" max="400" bind:value={textSize} /></span>
          <span><label for="text-fill">Color</label><input id="text-fill" type="color" bind:value={textFill} /></span>
        </div>
        <button class="action-button" type="button" disabled={!textValue.trim()} onclick={() => onCreateTextLayer(textValue, textFill, textSize)}><Icon name="add" size={16} />Add text</button>
      </div>
    </details>
  {/if}

  <section class="layer-list" aria-labelledby="layers-title">
    <h2 id="layers-title"><Icon name="layers" size={16} />Layers <span>{layers.length}</span></h2>
    {#each layers as layer (layer.id)}
      <button class:selected={layer.id === selectedLayer?.id} class="layer-row" type="button" onclick={() => onSelectLayer(layer.id)}>
        <Icon name={layer.kind === 'text' ? 'text' : 'image'} size={15} />{layer.name}
      </button>
    {:else}
      <p class="empty">No separated layers yet.</p>
    {/each}
  </section>

  {#if selectedLayer}
    <details class="tool-drawer" open>
      <summary><Icon name="shape" /><span>Selected layer</span></summary>
      <div class="drawer-content layer-settings">
      <label for="selected-layer-name">Name</label>
      <input id="selected-layer-name" value={selectedLayer.name} maxlength="60" oninput={(event) => onUpdateLayer(selectedLayer.id, { name: event.currentTarget.value })} />
      <label for="motion-mode">Layer motion</label>
      <select id="motion-mode" value={selectedLayer.motion} onchange={(event) => setSelectedMotion(event.currentTarget.value as Motion)}>
        {#each Object.keys(motionDefinitions) as motion}<option value={motion}>{motionDefinitions[motion as Motion].name}</option>{/each}
      </select>
      {#if motionDefinitions[selectedLayer.motion].transform?.repeat}
        <label for="motion-duration">Cycle: {selectedLayer.duration}s</label>
        <input id="motion-duration" type="range" min="0.5" max="10" step="0.5" value={selectedLayer.duration} oninput={(event) => onUpdateLayer(selectedLayer.id, { duration: Number(event.currentTarget.value) })} />
      {/if}
      <button class="remove" type="button" onclick={onRemoveLayer}><Icon name="remove" size={15} />Remove</button>
      </div>
    </details>
  {/if}
  <p class="limit-note">Cutouts move best on a clean background.</p>
</aside>

<style lang="scss">
  .image-tools {
    display: grid; align-content: start; gap: 4px; align-self: start; position: sticky; top: 14px;
    max-height: calc(100svh - 28px); overflow: auto; padding: 14px 16px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--shadow);
    h1 { margin: 0; font-size: 1rem; font-weight: 650; letter-spacing: -.02em; }
    h2 { display: flex; align-items: center; gap: 7px; margin: 0 0 8px; font-size: .82rem; }
    p { color: var(--muted); font-size: .75rem; line-height: 1.4; }
    label { display: block; margin: 10px 0 5px; font-size: .75rem; font-weight: 600; }
    input:not([type=file]), select, textarea { width: 100%; min-height: 36px; padding: 7px 9px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-raised); color: var(--text); }
    input[type=range] { padding: 0; accent-color: var(--accent); }
    input[type=color] { height: 36px; padding: 3px !important; }
    textarea { resize: vertical; }
    button, select { font: inherit; }
    button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 6px 9px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-raised); color: var(--text); font-size: .76rem; cursor: pointer; }
    button:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    button:disabled { opacity: .45; cursor: not-allowed; }
  }
  .panel-title { display: flex; align-items: center; gap: 10px; padding: 1px 0 9px; }
  .panel-title small { display: block; margin-top: 3px; color: var(--muted); font-size: .72rem; }
  .title-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; background: var(--accent-soft); color: var(--accent); }
  .index-mark { margin-left: auto; color: var(--muted); font: 600 .68rem/1 ui-monospace, monospace; }
  .file-picker { position: relative; display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 38px; overflow: hidden; border: 1px solid var(--accent); border-radius: 8px; background: var(--accent-soft); color: var(--accent); font-size: .78rem; font-weight: 650; cursor: pointer;
    input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
    &:focus-within { outline: 3px solid var(--accent); outline-offset: 3px; }
  }
  .file-name { margin: 4px 0 8px; overflow-wrap: anywhere; }
  .tool-drawer { border-top: 1px solid var(--border); }
  .tool-drawer > summary { display: flex; align-items: center; gap: 8px; min-height: 42px; color: var(--text); font-size: .8rem; font-weight: 600; cursor: pointer; list-style: none; }
  .tool-drawer > summary::-webkit-details-marker { display: none; }
  .tool-drawer > summary::after { content: '＋'; margin-left: auto; color: var(--muted); font-size: .72rem; }
  .tool-drawer[open] > summary::after { content: '−'; }
  .tool-drawer > summary :global(svg) { color: var(--moss); }
  .drawer-content { display: grid; gap: 2px; padding: 0 0 12px 25px; }
  .project-actions { margin: 0; }
  .project-actions p { margin: 4px 0; }
  .project-open { position: relative; display: flex !important; align-items: center; justify-content: center; gap: 7px; min-height: 36px; margin: 0 !important; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-raised); cursor: pointer;
    input { position: absolute; inset: 0; width: 100%; opacity: 0; cursor: pointer; }
  }
  .action-button { border-color: var(--accent) !important; background: var(--accent) !important; color: white !important; }
  .action-button:hover:not(:disabled) { background: #9f4939 !important; color: white !important; }
  .error { color: #a43d3d !important; }
  .inline-fields { display: grid; grid-template-columns: 1fr 54px; gap: 10px; align-items: end; }
  .inline-fields label { margin-top: 8px; }
  .inline-fields input[type=color] { width: 54px !important; }
  .layer-list { padding: 12px 0 4px; border-top: 1px solid var(--border); }
  .layer-list h2 { color: var(--text); }
  .layer-list h2 span { display: grid; place-items: center; width: 22px; height: 22px; margin-left: auto; border-radius: 50%; background: var(--canvas-paper); color: var(--muted); font-size: .7rem; }
  .layer-row { display: flex; align-items: center; gap: 8px; width: 100%; min-height: 36px !important; margin: 3px 0; text-align: left; overflow-wrap: anywhere; }
  .layer-row :global(svg) { flex: 0 0 auto; color: var(--moss); }
  .layer-row.selected { border-color: var(--accent) !important; background: var(--accent-soft) !important; }
  .empty { margin: 6px 0; }
  .layer-settings { padding-left: 0; }
  .remove { width: 100%; margin-top: 8px; color: #a43d3d !important; }
  .limit-note { margin: 8px 0 0; padding-top: 8px; border-top: 1px solid var(--border); font-size: .7rem !important; }
  :global(.image-tools > section) { padding: 9px 0; border-top: 1px solid var(--border); }
  @media (max-width: 800px) { .image-tools { position: static; max-height: none; } }
</style>

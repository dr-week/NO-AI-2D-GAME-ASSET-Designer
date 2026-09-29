<script lang="ts">
  import type { Point } from '../model/types'
  import Icon from '../../../lib/Icon.svelte'
  import ToolDrawer from './ToolDrawer.svelte'

  let { enabled, draft, draftMaskUrl, layerName, maskMode, colorTolerance, onLayerNameChange, onMaskModeChange, onToleranceChange, onClearDraft, onCreateLayer, onCreateTextLayer }: {
    enabled: boolean
    draft: Point[]
    draftMaskUrl: string
    layerName: string
    maskMode: 'polygon' | 'color'
    colorTolerance: number
    onLayerNameChange: (name: string) => void
    onMaskModeChange: (mode: 'polygon' | 'color') => void
    onToleranceChange: (value: number) => void
    onClearDraft: () => void
    onCreateLayer: () => void
    onCreateTextLayer: (text: string, fill: string, fontSize: number) => void
  } = $props()
  let textValue = $state('Your text')
  let textFill = $state('#283247')
  let textSize = $state(64)
</script>

{#if enabled}
  <ToolDrawer title="New region" icon="layers">
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
  </ToolDrawer>

  <ToolDrawer title="Text" icon="text">
    <div class="drawer-content text-creator">
      <label for="text-content">Copy</label>
      <textarea id="text-content" bind:value={textValue} maxlength="500" rows="2"></textarea>
      <div class="inline-fields">
        <span><label for="text-size">Size</label><input id="text-size" type="number" min="8" max="400" bind:value={textSize} /></span>
        <span><label for="text-fill">Color</label><input id="text-fill" type="color" bind:value={textFill} /></span>
      </div>
      <button class="action-button" type="button" disabled={!textValue.trim()} onclick={() => onCreateTextLayer(textValue, textFill, textSize)}><Icon name="add" size={16} />Add text</button>
    </div>
  </ToolDrawer>
{/if}

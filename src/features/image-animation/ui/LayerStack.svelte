<script lang="ts">
  import { motionDefinitions } from '../../animation/themeEngine'
  import { motionLayerChanges } from '../model/motion'
  import type { Layer, Motion } from '../model/types'
  import Icon from '../../../lib/Icon.svelte'
  import ToolDrawer from './ToolDrawer.svelte'

  let { layers, selectedLayer, onSelectLayer, onUpdateLayer, onRemoveLayer }: {
    layers: Layer[]
    selectedLayer?: Layer
    onSelectLayer: (id: string) => void
    onUpdateLayer: (id: string, changes: Partial<Pick<Layer, 'name' | 'motion' | 'duration'>>) => void
    onRemoveLayer: () => void
  } = $props()

  function setSelectedMotion(motion: Motion) {
    if (selectedLayer) onUpdateLayer(selectedLayer.id, motionLayerChanges(motion))
  }
</script>

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
  <ToolDrawer title="Selected layer" icon="shape" open>
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
  </ToolDrawer>
{/if}

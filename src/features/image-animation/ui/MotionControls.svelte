<script lang="ts">
  import { animationTemplates, motionDefinitions, type AnimationCategory } from '../../animation/themeEngine'
  import { motionLayerChanges } from '../model/motion'
  import type { Layer, Motion } from '../model/types'
  import Icon from '../../../lib/Icon.svelte'
  import ToolDrawer from './ToolDrawer.svelte'

  let { enabled, backgroundMotion, selectedLayer, selectedTemplateId, onBackgroundMotionChange, onTemplateChange, onApplyTemplate, onUpdateLayer }: {
    enabled: boolean
    backgroundMotion: Motion
    selectedLayer?: Layer
    selectedTemplateId: string
    onBackgroundMotionChange: (motion: Motion) => void
    onTemplateChange: (id: string) => void
    onApplyTemplate: () => void
    onUpdateLayer: (id: string, changes: Partial<Pick<Layer, 'name' | 'motion' | 'duration'>>) => void
  } = $props()
  let selectedCategory = $state<AnimationCategory | 'All'>('All')
  let visibleTemplates = $derived(Object.values(animationTemplates).filter((template) => selectedCategory === 'All' || template.category === selectedCategory))

  function setSelectedMotion(motion: Motion) {
    if (selectedLayer) onUpdateLayer(selectedLayer.id, motionLayerChanges(motion))
  }

  function changeCategory(category: AnimationCategory | 'All') {
    selectedCategory = category
    const firstMatch = Object.values(animationTemplates).find((template) => category === 'All' || template.category === category)
    if (firstMatch) onTemplateChange(firstMatch.id)
  }
</script>

{#if enabled}
  <ToolDrawer title="Themes & motion" icon="motion" open>
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
      <button class="action-button" type="button" disabled={!selectedLayer} onclick={onApplyTemplate}><Icon name="motion" size={16} />Apply to layer</button>
    </div>
  </ToolDrawer>
{/if}

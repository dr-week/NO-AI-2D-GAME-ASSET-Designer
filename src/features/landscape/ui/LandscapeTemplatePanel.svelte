<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '../../../lib/Icon.svelte'
  import { downloadBlob } from '../../../platform/download'
  import {
    createLandscapeTemplate,
    type LandscapeTemplate,
  } from '../model/templates'
  import {
    deleteLandscapeTemplate,
    exportLandscapeTemplates,
    importLandscapeTemplates,
    listLandscapeTemplates,
    saveLandscapeTemplate,
  } from '../io/templateStore'
  import type { LandscapeScene } from '../model/scene'
  import { landscapeThemes } from '../model/themes'

  let { scene, onApply }: { scene: LandscapeScene; onApply: (scene: LandscapeScene) => void } = $props()
  let templates = $state<LandscapeTemplate[]>([])
  let name = $state('')
  let busy = $state(false)
  let message = $state('')
  let failed = $state(false)
  let fileInput: HTMLInputElement

  onMount(() => { void refresh().catch(report) })

  async function refresh() {
    templates = await listLandscapeTemplates()
  }

  function report(error: unknown) {
    failed = true
    message = error instanceof Error ? error.message : 'Template action failed.'
  }

  async function save() {
    const title = name.trim()
    if (!title) {
      failed = true
      message = 'Enter a template name.'
      return
    }
    busy = true
    try {
      await saveLandscapeTemplate(createLandscapeTemplate(title, scene))
      await refresh()
      name = ''
      failed = false
      message = `Saved “${title}”.`
    } catch (error) {
      report(error)
    } finally {
      busy = false
    }
  }

  async function removeWithoutPrompt(template: LandscapeTemplate) {
    busy = true
    try {
      await deleteLandscapeTemplate(template.id)
      await refresh()
      failed = false
      message = `Deleted “${template.name}”.`
    } catch (error) {
      report(error)
    } finally {
      busy = false
    }
  }

  async function remove(template: LandscapeTemplate) {
    if (!window.confirm(`Delete “${template.name}” from this device?`)) return
    busy = true
    try {
      await deleteLandscapeTemplate(template.id)
      await refresh()
      failed = false
      message = `Deleted “${template.name}”.`
    } catch (error) {
      report(error)
    } finally {
      busy = false
    }
  }

  async function exportBackup() {
    busy = true
    try {
      const backup = await exportLandscapeTemplates()
      downloadBlob(new Blob([backup], { type: 'application/json' }), '2dmaker-landscape-templates.json')
      failed = false
      message = `Exported ${templates.length} template${templates.length === 1 ? '' : 's'}.`
    } catch (error) {
      report(error)
    } finally {
      busy = false
    }
  }

  async function importBackup(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    busy = true
    try {
      const count = await importLandscapeTemplates(await file.text())
      await refresh()
      failed = false
      message = `Imported ${count} template${count === 1 ? '' : 's'}.`
    } catch (error) {
      report(error)
    } finally {
      input.value = ''
      busy = false
    }
  }
</script>

<details class="template-library">
  <summary><Icon name="project" size={16} />Templates <span>{templates.length}</span></summary>
  <div class="library-content">
    <form class="save-form" onsubmit={(event) => { event.preventDefault(); void save() }}>
      <label for="landscape-template-name">Save current scene</label>
      <div class="form-row">
        <input id="landscape-template-name" bind:value={name} maxlength="80" placeholder="Name this scene" disabled={busy} />
        <button type="submit" aria-label="Save template" title="Save template" disabled={busy}><Icon name="add" size={16} /></button>
      </div>
    </form>

    <div class="backup-actions">
      <button type="button" onclick={() => void exportBackup()} disabled={busy}><Icon name="export" size={14} />Export</button>
      <button type="button" onclick={() => fileInput.click()} disabled={busy}><Icon name="upload" size={14} />Import</button>
      <input bind:this={fileInput} class="file-input" type="file" accept=".json,application/json" onchange={importBackup} />
    </div>

    {#if templates.length}
      <ul class="template-list" aria-label="Saved landscape templates">
        {#each templates as template (template.id)}
          <li>
            <div class="template-info"><strong>{template.name}</strong><small>{landscapeThemes[template.scene.theme ?? 'contemporary'].name} · {template.scene.preset} · {template.scene.palette} · #{template.scene.seed}</small></div>
            <button type="button" class="load-button" onclick={() => { onApply(template.scene); failed = false; message = `Loaded “${template.name}”.` }} disabled={busy}>Load</button>
            <button type="button" class="delete-button" aria-label={`Delete ${template.name}`} title={`Delete ${template.name}`} onclick={() => void removeWithoutPrompt(template)} disabled={busy}><Icon name="remove" size={15} /></button>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty-state">No saved scenes yet.</p>
    {/if}
    <p class:error-message={failed} class:success-message={!failed} class="status" role={failed ? 'alert' : 'status'} aria-live="polite">{message}</p>
  </div>
</details>

<style lang="scss">
  .template-library { border-top: 1px solid var(--border); margin-top: 8px; padding-top: 10px; }
  summary { display: flex; align-items: center; gap: 8px; color: var(--text); font-size: .76rem; font-weight: 650; cursor: pointer; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  summary span { margin-left: auto; color: var(--muted); font-size: .7rem; font-weight: 550; }
  .library-content { display: grid; gap: 9px; padding-top: 11px; }
  .save-form { display: grid; gap: 5px; }
  .save-form label { margin: 0; color: var(--muted); font-size: .7rem; font-weight: 600; }
  .form-row { display: grid; grid-template-columns: minmax(0, 1fr) 36px; gap: 6px; }
  input:not([type='file']) { min-width: 0; min-height: 34px; padding: 5px 8px; border: 1px solid var(--border); border-radius: 7px; background: var(--surface-raised); color: var(--text); font: inherit; font-size: .73rem; }
  button { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 32px; padding: 4px 8px; border: 1px solid var(--border); border-radius: 7px; background: var(--surface-raised); color: var(--text); font: inherit; font-size: .7rem; cursor: pointer; }
  button:disabled { opacity: .55; cursor: wait; }
  button:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .backup-actions { display: flex; gap: 6px; }
  .file-input { display: none; }
  .template-list { display: grid; gap: 5px; max-height: 220px; overflow: auto; margin: 0; padding: 0; list-style: none; }
  .template-list li { display: grid; grid-template-columns: minmax(0, 1fr) auto 30px; align-items: center; gap: 5px; padding: 6px; border: 1px solid var(--border); border-radius: 8px; }
  .template-info { display: grid; min-width: 0; gap: 2px; }
  .template-info strong { overflow: hidden; color: var(--text); font-size: .7rem; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
  .template-info small { color: var(--muted); font-size: .62rem; text-transform: capitalize; }
  .load-button { min-height: 28px; }
  .delete-button { min-height: 28px; padding: 3px; }
  .empty-state, .status { margin: 0; color: var(--muted); font-size: .67rem; }
  .error-message { color: var(--danger, #a73e38); }
  .success-message { color: var(--muted); }
</style>

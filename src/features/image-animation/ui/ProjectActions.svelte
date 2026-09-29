<script lang="ts">
  import Icon from '../../../lib/Icon.svelte'
  import ToolDrawer from './ToolDrawer.svelte'

  let { imageUrl, projectStatus, projectError, hasLocalProject, onSaveProject, onOpenProject, onRestoreProject, onExportSvg }: {
    imageUrl: string
    projectStatus: string
    projectError: string
    hasLocalProject: boolean
    onSaveProject: () => void
    onOpenProject: (event: Event) => void
    onRestoreProject: () => void
    onExportSvg: () => void
  } = $props()
</script>

<ToolDrawer title="Project" icon="project">
  <div class="drawer-content project-actions" aria-label="Project files">
    <button type="button" onclick={onSaveProject}><Icon name="project" size={16} />Save JSON</button>
    <label class="project-open"><Icon name="upload" size={16} />Open JSON<input type="file" accept="application/json,.json" onchange={onOpenProject} /></label>
    {#if hasLocalProject}<button type="button" onclick={onRestoreProject}><Icon name="reset" size={16} />Restore local</button>{/if}
    <button type="button" disabled={!imageUrl} onclick={onExportSvg}><Icon name="export" size={16} />Export SVG</button>
    <p aria-live="polite">{projectStatus}</p>
    {#if projectError}<p class="error" role="alert">{projectError}</p>{/if}
  </div>
</ToolDrawer>

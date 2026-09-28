<script lang="ts">
  import type { Snippet } from 'svelte'
  import Icon from '../../../lib/Icon.svelte'

  type DrawerIcon = 'project' | 'motion' | 'layers' | 'text' | 'shape'
  let { title, icon, open = false, children }: {
    title: string
    icon: DrawerIcon
    open?: boolean
    children: Snippet
  } = $props()
</script>

<details class="tool-drawer" {open}>
  <summary><Icon name={icon} /><span>{title}</span></summary>
  {@render children()}
</details>

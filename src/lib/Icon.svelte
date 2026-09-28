<script lang="ts">
  type Name = 'character' | 'pose' | 'shape' | 'bone' | 'eye' | 'reset' | 'export' | 'image' | 'upload' | 'project' | 'motion' | 'layers' | 'text' | 'add' | 'remove' | 'landscape' | 'menu' | 'sun' | 'play' | 'pause'
  let { name, size = 18 }: { name: Name; size?: number } = $props()
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  {#if name === 'character'}
    <circle cx="12" cy="5" r="2.5" /><path d="M12 8v7m-7-5h14M8 22l4-7 4 7m-8-7-2 7m10-7 2 7" />
  {:else if name === 'pose'}
    <circle cx="12" cy="4" r="2" /><path d="M12 6v8m0-6L5 10m7-2 7 2M12 14l-5 7m5-7 5 7" /><circle cx="5" cy="10" r="1.4" /><circle cx="19" cy="10" r="1.4" />
  {:else if name === 'shape'}
    <path d="M4 5h16M4 12h16M4 19h16" /><circle cx="9" cy="5" r="2" fill="var(--surface)" /><circle cx="15" cy="12" r="2" fill="var(--surface)" /><circle cx="11" cy="19" r="2" fill="var(--surface)" />
  {:else if name === 'bone'}
    <path d="M8 7a2.5 2.5 0 1 0-3.5 3.5l8 8A2.5 2.5 0 1 0 16 15l-8-8Z" /><path d="m9 8 6 6" />
  {:else if name === 'eye'}
    <path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" />
  {:else if name === 'reset'}
    <path d="M4 11a8 8 0 1 1 1.6 6M4 5v6h6" />
  {:else if name === 'export'}
    <path d="M12 15V3m-4 4 4-4 4 4M5 13v7h14v-7" />
  {:else if name === 'image'}
    <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" />
  {:else if name === 'upload'}
    <path d="M12 15V3m-4 4 4-4 4 4" /><path d="M4 14v6h16v-6" />
  {:else if name === 'project'}
    <path d="M3 6h7l2 2h9v11H3z" /><path d="M3 9h18" />
  {:else if name === 'motion'}
    <path d="M3 12h3l3-7 5 14 3-7h4" />
  {:else if name === 'layers'}
    <path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
  {:else if name === 'text'}
    <path d="M4 5h16M12 5v14m-4 0h8" />
  {:else if name === 'add'}
    <path d="M12 5v14M5 12h14" />
  {:else if name === 'remove'}
    <path d="M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
  {:else if name === 'landscape'}
    <path d="m3 19 6-8 4 5 3-4 5 7H3Z" /><circle cx="17" cy="7" r="2.5" />
  {:else if name === 'menu'}
    <path d="M4 6h16M4 12h16M4 18h16" />
  {:else if name === 'sun'}
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  {:else if name === 'play'}
    <path d="m8 5 11 7-11 7V5Z" />
  {:else if name === 'pause'}
    <path d="M8 5h3v14H8zM15 5h3v14h-3z" />
  {/if}
</svg>

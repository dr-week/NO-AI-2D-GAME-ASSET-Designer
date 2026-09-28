<script lang="ts">
  import Icon from '../../../lib/Icon.svelte'
  import { downloadBlob } from '../../../platform/download'
  import LandscapeTemplatePanel from './LandscapeTemplatePanel.svelte'
  import { landscapeMaterials, type LandscapeMaterial } from '../model/materials'
  import { generateLandscape, landscapePalettes, landscapePresets, type LandscapePalette, type LandscapePreset, type LandscapeScene } from '../model/scene'
  import { landscapeThemes, type LandscapeThemeId } from '../model/themes'
  import ArtworkFeedback from '../../artwork-feedback/ui/ArtworkFeedback.svelte'
  import { createSeededRandom, randomSeed } from '../../../lib/random'

  let scene = $state<LandscapeScene>({ preset: 'coast', palette: 'dusk', theme: 'contemporary', seed: 210, material: 'grain', materialLoop: false })
  let markup = $derived(generateLandscape(scene))

  function updateScene(changes: Partial<LandscapeScene>) {
    scene = { ...scene, ...changes }
  }

  function regenerate() {
    updateScene({ seed: (scene.seed + 1) >>> 0 })
  }

  function randomizeScene() {
    const seed = randomSeed()
    const random = createSeededRandom(seed)
    const choose = <T,>(values: T[]) => values[Math.floor(random() * values.length)]
    updateScene({
      preset: choose(Object.keys(landscapePresets) as LandscapePreset[]),
      palette: choose(Object.keys(landscapePalettes) as LandscapePalette[]),
      theme: choose(Object.keys(landscapeThemes) as LandscapeThemeId[]),
      material: choose(Object.keys(landscapeMaterials) as LandscapeMaterial[]),
      seed,
      materialLoop: false,
    })
  }

  function exportScene() {
    downloadBlob(new Blob([markup], { type: 'image/svg+xml' }), `landscape-${scene.preset}-${scene.theme ?? 'contemporary'}.svg`)
  }
</script>

<main class="landscape-workspace">
  <aside class="scene-tools">
    <header><span class="title-icon"><Icon name="landscape" size={21} /></span><h1>Landscape</h1></header>
    <label for="landscape-preset"><Icon name="landscape" size={15} />Scene</label>
    <select id="landscape-preset" value={scene.preset} onchange={(event) => updateScene({ preset: event.currentTarget.value as LandscapePreset })}>
      {#each Object.entries(landscapePresets) as [key, label]}<option value={key}>{label}</option>{/each}
    </select>
    <label for="landscape-theme"><Icon name="project" size={15} />Art style</label>
    <select id="landscape-theme" value={scene.theme ?? 'contemporary'} onchange={(event) => updateScene({ theme: event.currentTarget.value as LandscapeThemeId })}>
      {#each Object.values(landscapeThemes) as theme}<option value={theme.id}>{theme.name}</option>{/each}
    </select>
    <p class="theme-note">{landscapeThemes[scene.theme ?? 'contemporary'].region} · {landscapeThemes[scene.theme ?? 'contemporary'].description}</p>
    <label for="landscape-palette"><Icon name="sun" size={15} />Palette</label>
    <select id="landscape-palette" value={scene.palette} onchange={(event) => updateScene({ palette: event.currentTarget.value as LandscapePalette })}>
      {#each Object.entries(landscapePalettes) as [key, label]}<option value={key}>{label}</option>{/each}
    </select>
    <label for="landscape-material"><Icon name="landscape" size={15} />Material</label>
    <select id="landscape-material" value={scene.material ?? 'flat'} onchange={(event) => updateScene({ material: event.currentTarget.value as LandscapeMaterial })}>
      {#each Object.entries(landscapeMaterials) as [key, label]}<option value={key}>{label}</option>{/each}
    </select>
    {#if scene.material && scene.material !== 'flat'}
      <button class="animate-button" type="button" aria-pressed={scene.materialLoop ?? false} onclick={() => updateScene({ materialLoop: !scene.materialLoop })}><Icon name={scene.materialLoop ? 'pause' : 'play'} size={15} />{scene.materialLoop ? 'Pause material' : 'Animate material'}</button>
    {/if}
    <div class="tool-actions">
      <button type="button" title="Randomize scene and palette" onclick={randomizeScene}><Icon name="reset" size={16} />Random scene</button>
      <button type="button" title="Create a new variation" onclick={regenerate}><Icon name="reset" size={16} />Vary</button>
      <button class="primary" type="button" title="Export landscape as SVG" onclick={exportScene}><Icon name="export" size={16} />Export</button>
    </div>
    <LandscapeTemplatePanel {scene} onApply={(templateScene) => scene = templateScene} />
    <ArtworkFeedback kind="landscape" snapshot={scene} />
  </aside>
  <section class="scene-stage" aria-label="Landscape preview">
    <div class="scene-preview">{@html markup}</div>
    <span class="scene-caption"><Icon name="landscape" size={14} />{landscapePresets[scene.preset]}<span class="caption-divider"></span><Icon name="sun" size={14} />{landscapePalettes[scene.palette]}<span class="caption-divider"></span>{landscapeThemes[scene.theme ?? 'contemporary'].name}</span>
  </section>
</main>

<style lang="scss">
  .landscape-workspace { display: grid; grid-template-columns: minmax(230px, 280px) minmax(0, 1fr); gap: 18px; max-width: 1640px; margin: 0 auto; padding: 20px 24px 28px; }
  .scene-tools { display: grid; align-content: start; gap: 8px; align-self: start; position: sticky; top: 14px; padding: 16px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface); box-shadow: var(--shadow);
    header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    h1 { margin: 0; color: var(--text); font-size: .96rem; font-weight: 650; letter-spacing: -.02em; }
    .title-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); }
    label { display: flex; align-items: center; gap: 7px; margin-top: 7px; color: var(--muted); font-size: .73rem; font-weight: 600; }
    label :global(svg) { color: var(--moss); }
    .theme-note { margin: -3px 0 2px; color: var(--muted); font-size: .65rem; line-height: 1.4; }
    select { width: 100%; min-height: 38px; padding: 6px 9px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-raised); color: var(--text); }
    button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 6px 11px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-raised); font-size: .76rem; font-weight: 600; cursor: pointer; }
    button:hover { border-color: var(--accent); color: var(--accent); }
    .tool-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 6px; }
    .tool-actions .primary { grid-column: 1 / -1; }
    .animate-button { width: 100%; justify-content: center; background: var(--accent-soft); color: var(--accent); }
    .primary { background: var(--accent); color: white; border-color: var(--accent); }
  }
  .scene-stage { display: grid; place-items: center; align-content: center; gap: 12px; min-width: 0; min-height: min(78svh, 860px); padding: clamp(18px, 3vw, 40px); border: 1px solid var(--border); border-radius: 15px; background: radial-gradient(ellipse at center, #f5f1e9 0, #e9e5dc 78%); box-shadow: var(--shadow); }
  .scene-preview { width: min(100%, 1000px); overflow: hidden; border: 1px solid #292c2714; border-radius: 5px; box-shadow: 0 18px 44px #182c3d20;
    :global(svg) { display: block; width: 100%; height: auto; }
  }
  .scene-caption { display: inline-flex; align-items: center; gap: 7px; min-height: 28px; padding: 3px 10px; border: 1px solid var(--border); border-radius: 99px; background: var(--surface); color: var(--text); font-size: .7rem; font-weight: 550; }
  .scene-caption :global(svg) { color: var(--moss); }
  .caption-divider { width: 1px; height: 13px; margin: 0 2px; background: var(--border); }
  @media (max-width: 800px) { .landscape-workspace { grid-template-columns: minmax(0, 1fr); gap: 12px; padding: 14px; } .scene-tools { position: static; } .scene-stage { min-height: 50svh; } }
</style>

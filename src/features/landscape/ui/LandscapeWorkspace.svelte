<script lang="ts">
  import Icon from '../../../lib/Icon.svelte'
  import { downloadLandscapeSvg } from '../io/sceneExport'
  import LandscapeTemplatePanel from './LandscapeTemplatePanel.svelte'
  import { landscapeMaterials, type LandscapeMaterial } from '../model/materials'
  import { defaultComposition, generateLandscape, landscapeCompositions, landscapeCompositionsFor, landscapeEnvironments, landscapeLighting, landscapePalettes, landscapePresets, type LandscapeComposition, type LandscapeEnvironment, type LandscapeLighting, type LandscapePalette, type LandscapePreset, type LandscapeScene } from '../model/scene'
  import { landscapeThemeCategories, landscapeThemes, type LandscapeThemeId } from '../model/themes'
  import { suggestLandscapeTheme } from '../../laya/io/systemOneClient'
  import ArtworkFeedback from '../../artwork-feedback/ui/ArtworkFeedback.svelte'
  import { createSeededRandom, randomSeed } from '../../../lib/random'
  const canUseLocalModel = import.meta.env.DEV

  let scene = $state<LandscapeScene>({ preset: 'coast', composition: 'island', environment: 'temperate', lighting: 'golden-hour', palette: 'dusk', theme: 'contemporary', seed: 210, material: 'grain', materialLoop: false })
  let styleBrief = $state('')
  let styleSuggestion = $state<LandscapeThemeId | null>(null)
  let styleBusy = $state(false)
  let styleStatus = $state('')
  let markup = $derived(generateLandscape(scene))

  function updateScene(changes: Partial<LandscapeScene>) {
    const next = { ...scene, ...changes }
    const environment = next.environment ?? 'temperate'
    if (next.composition && !landscapeCompositionsFor(next.preset, environment).includes(next.composition)) {
      next.composition = defaultComposition(next.preset, environment)
    }
    scene = next
  }

  function regenerate() {
    updateScene({ seed: (scene.seed + 1) >>> 0 })
  }

  function randomizeScene() {
    const seed = randomSeed()
    const random = createSeededRandom(seed)
    const choose = <T,>(values: T[]) => values[Math.floor(random() * values.length)]
    const preset = choose(Object.keys(landscapePresets) as LandscapePreset[])
    const environment = choose(Object.keys(landscapeEnvironments) as LandscapeEnvironment[])
    updateScene({
      preset,
      composition: choose(landscapeCompositionsFor(preset, environment)),
      environment,
      lighting: choose(Object.keys(landscapeLighting) as LandscapeLighting[]),
      palette: choose(Object.keys(landscapePalettes) as LandscapePalette[]),
      theme: choose(Object.keys(landscapeThemes) as LandscapeThemeId[]),
      material: choose(Object.keys(landscapeMaterials) as LandscapeMaterial[]),
      seed,
      materialLoop: false,
    })
  }

  async function suggestStyle() {
    styleBusy = true
    styleSuggestion = null
    styleStatus = 'Waiting for optional local Laya…'
    const requestedBrief = styleBrief
    try {
      const suggestion = await suggestLandscapeTheme(requestedBrief)
      if (styleBrief !== requestedBrief) {
        styleStatus = 'Brief changed while Laya was deciding. Request a new suggestion.'
        return
      }
      styleSuggestion = suggestion
      styleStatus = 'Style suggestion ready. Review it before applying.'
    } catch (cause) {
      styleStatus = cause instanceof Error
        ? `${cause.message} Start scripts/start-laya-system-one.ps1.`
        : 'Local Laya could not decide; choose a style manually.'
    } finally {
      styleBusy = false
    }
  }

  function applyStyleSuggestion() {
    if (!styleSuggestion) return
    updateScene({ theme: styleSuggestion })
    styleStatus = `${landscapeThemes[styleSuggestion].name} applied. Review the scene preview.`
    styleSuggestion = null
  }

</script>

<main class="landscape-workspace">
  <aside class="scene-tools">
    <header><span class="title-icon"><Icon name="landscape" size={21} /></span><h1>Landscape</h1></header>
    <label for="landscape-preset"><Icon name="landscape" size={15} />Scene</label>
    <select id="landscape-preset" value={scene.preset} onchange={(event) => updateScene({ preset: event.currentTarget.value as LandscapePreset })}>
      {#each Object.entries(landscapePresets) as [key, label]}<option value={key}>{label}</option>{/each}
    </select>
    <label for="landscape-composition"><Icon name="project" size={15} />Composition</label>
    <select id="landscape-composition" value={scene.composition ?? defaultComposition(scene.preset, scene.environment ?? 'temperate')} onchange={(event) => updateScene({ composition: event.currentTarget.value as LandscapeComposition })}>
      {#each landscapeCompositionsFor(scene.preset, scene.environment ?? 'temperate') as key}<option value={key}>{landscapeCompositions[key]}</option>{/each}
    </select>
    <label for="landscape-environment"><Icon name="landscape" size={15} />Environment</label>
    <select id="landscape-environment" value={scene.environment ?? 'temperate'} onchange={(event) => updateScene({ environment: event.currentTarget.value as LandscapeEnvironment })}>
      {#each Object.entries(landscapeEnvironments) as [key, environment]}<option value={key}>{environment.label}</option>{/each}
    </select>
    <label for="landscape-lighting"><Icon name="sun" size={15} />Time of day</label>
    <select id="landscape-lighting" value={scene.lighting ?? 'golden-hour'} onchange={(event) => updateScene({ lighting: event.currentTarget.value as LandscapeLighting })}>
      {#each Object.entries(landscapeLighting) as [key, label]}<option value={key}>{label}</option>{/each}
    </select>
    <label for="landscape-theme"><Icon name="project" size={15} />Art style</label>
    <select id="landscape-theme" value={scene.theme ?? 'contemporary'} onchange={(event) => { updateScene({ theme: event.currentTarget.value as LandscapeThemeId }); styleSuggestion = null }}>
      {#each Object.entries(landscapeThemeCategories) as [category, label]}
        <optgroup label={label}>
          {#each Object.values(landscapeThemes).filter((theme) => theme.category === category) as theme}<option value={theme.id}>{theme.name}</option>{/each}
        </optgroup>
      {/each}
    </select>
    <p class="theme-note">{landscapeThemes[scene.theme ?? 'contemporary'].region} · {landscapeThemes[scene.theme ?? 'contemporary'].description}</p>
    <details class="style-match">
      <summary>Suggest style from brief</summary>
      <label for="landscape-style-brief">Design brief</label>
      <input id="landscape-style-brief" bind:value={styleBrief} maxlength="500" oninput={() => styleSuggestion = null} placeholder="Geometric folk-inspired hills" />
      {#if canUseLocalModel}<button type="button" disabled={styleBusy} onclick={suggestStyle}>{styleBusy ? 'Deciding…' : 'Suggest with Laya'}</button>{/if}
      {#if styleSuggestion}
        <div class="style-suggestion">
          <strong>{landscapeThemes[styleSuggestion].name}</strong>
          <span>{landscapeThemes[styleSuggestion].region} · {landscapeThemes[styleSuggestion].description}</span>
          <button type="button" onclick={applyStyleSuggestion}>Apply to preview</button>
        </div>
      {/if}
      <p role="status" aria-live="polite">{styleStatus}</p>
      <small>Manual style selection works offline. Local Laya suggestions are development-only.</small>
    </details>
    <label for="landscape-palette"><Icon name="sun" size={15} />Color mood</label>
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
      <button type="button" title="Randomize composition, environment, light, landform, style, and seed" onclick={randomizeScene}><Icon name="reset" size={16} />Random scene</button>
      <button type="button" title="Create a new variation" onclick={regenerate}><Icon name="reset" size={16} />Vary</button>
      <button class="primary" type="button" title="Export landscape as SVG" onclick={() => downloadLandscapeSvg(scene)}><Icon name="export" size={16} />Export</button>
    </div>
    <LandscapeTemplatePanel {scene} onApply={(templateScene) => scene = templateScene} />
    <ArtworkFeedback kind="landscape" snapshot={scene} />
  </aside>
  <section class="scene-stage" aria-label="Landscape preview">
    <div class="scene-preview">{@html markup}</div>
    <span class="scene-caption"><Icon name="landscape" size={14} />{landscapeEnvironments[scene.environment ?? 'temperate'].label}<span class="caption-divider"></span>{landscapePresets[scene.preset]}<span class="caption-divider"></span>{landscapeCompositions[scene.composition ?? defaultComposition(scene.preset, scene.environment ?? 'temperate')]}<span class="caption-divider"></span><Icon name="sun" size={14} />{landscapeLighting[scene.lighting ?? 'golden-hour']}<span class="caption-divider"></span>{landscapeThemes[scene.theme ?? 'contemporary'].name}</span>
  </section>
</main>

<style lang="scss">
  .landscape-workspace { display: grid; grid-template-columns: minmax(230px, 280px) minmax(0, 1fr); gap: 18px; max-width: 1640px; margin: 0 auto; padding: 20px 24px 28px; }
  .scene-tools { display: grid; align-content: start; gap: 8px; align-self: start; position: sticky; top: 14px; max-height: calc(100svh - 28px); overflow: auto; padding: 16px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface); box-shadow: var(--shadow);
    header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    h1 { margin: 0; color: var(--text); font-size: .96rem; font-weight: 650; letter-spacing: -.02em; }
    .title-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); }
    label { display: flex; align-items: center; gap: 7px; margin-top: 7px; color: var(--muted); font-size: .73rem; font-weight: 600; }
    label :global(svg) { color: var(--moss); }
    .theme-note { margin: -3px 0 2px; color: var(--muted); font-size: .65rem; line-height: 1.4; }
    .style-match { display: grid; gap: 7px; padding: 8px; border: 1px solid var(--border); border-radius: 8px; font-size: .72rem; }
    .style-match summary { min-height: 28px; padding: 5px 2px; cursor: pointer; color: var(--text); font-weight: 600; }
    .style-match label, .style-match small { margin: 0; font-size: .68rem; }
    .style-match input { min-width: 0; min-height: 36px; padding: 6px 8px; border: 1px solid var(--border); border-radius: 7px; background: var(--surface-raised); color: var(--text); font: inherit; }
    .style-match p { margin: 0; color: var(--muted); }
    .style-match small { color: var(--muted); }
    .style-suggestion { display: grid; gap: 5px; padding-top: 6px; border-top: 1px solid var(--border); }
    .style-match button:disabled { opacity: .6; cursor: wait; }
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

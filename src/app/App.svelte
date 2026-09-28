<script lang="ts">
  import CharacterCanvas from '../features/character/ui/CharacterCanvas.svelte'
  import Icon from '../lib/Icon.svelte'
  import CharacterCommandPanel from '../features/laya/ui/CharacterCommandPanel.svelte'
  import CharacterControls from '../features/character/ui/CharacterControls.svelte'
  import CharacterAnimationControls from '../features/character/ui/CharacterAnimationControls.svelte'
  import ImageAnimationEditor from '../features/image-animation/ui/ImageAnimationEditor.svelte'
  import LandscapeWorkspace from '../features/landscape/ui/LandscapeWorkspace.svelte'
  import type { Component } from 'svelte'
  import { defaultFrontFacingTPose, type CharacterPose, type JointId } from '../features/character/model/skeleton'
  import { clampProportion, defaultCharacterProportions, type CharacterProportions } from '../features/character/model/proportions'
  import { applyBoneLengthScales, defaultBoneLengthScales, type BoneLengthScales } from '../features/character/model/boneLengths'
  import type { LayaCommand } from '../features/laya/model/commands.ts'
  import { createRandomCharacter, createRandomPose } from '../features/character/model/randomCharacter'
  import { mirrorCharacterPose } from '../features/character/model/poses'
  import ArtworkFeedback from '../features/artwork-feedback/ui/ArtworkFeedback.svelte'
  import { randomSeed } from '../lib/random'

  let pose = $state<CharacterPose>({})
  let animationPlaying = $state(false)
  let boneScales = $state<BoneLengthScales>({ ...defaultBoneLengthScales })
  let skeleton = $derived(applyBoneLengthScales(defaultFrontFacingTPose, boneScales))
  let proportions = $state<CharacterProportions>({ ...defaultCharacterProportions })
  let showBones = $state(true)
  let showJoints = $state(true)
  let workspace = $state<'character' | 'landscape' | 'image' | 'threeD'>('character')
  let drawerOpen = $state(true)
  let ThreeDWorkspace = $state<Component | null>(null)
  let threeDError = $state(false)

  async function openThreeDWorkspace() {
    workspace = 'threeD'
    if (ThreeDWorkspace) return
    threeDError = false
    try {
      ThreeDWorkspace = (await import('../features/three-d/ui/ThreeDWorkspace.svelte')).default
    } catch {
      threeDError = true
    }
  }

  function resetTPose() {
    animationPlaying = false
    pose = {}
  }

  function resetBoneLengths() {
    boneScales = { ...defaultBoneLengthScales }
  }

  function resetProportions() {
    proportions = { ...defaultCharacterProportions }
  }

  function randomizeCharacter() {
    const generated = createRandomCharacter(defaultFrontFacingTPose, randomSeed())
    animationPlaying = false
    pose = generated.pose
    proportions = generated.proportions
    boneScales = generated.boneScales
  }

  function randomizePose() {
    animationPlaying = false
    pose = createRandomPose(defaultFrontFacingTPose, randomSeed())
  }

  function mirrorPose() {
    animationPlaying = false
    pose = mirrorCharacterPose(pose)
  }

  function applyLayaCommand(command: LayaCommand) {
    animationPlaying = false
    if (command.type === 'pose') pose = { ...pose, [command.joint]: command.degrees * Math.PI / 180 }
    else if (command.type === 'proportion') proportions = { ...proportions, [command.group]: command.scale }
    else if (command.type === 'length') boneScales = { ...boneScales, [command.group]: command.scale }
    else if (command.group === 'pose') resetTPose()
    else if (command.group === 'proportions') resetProportions()
    else resetBoneLengths()
  }
</script>

<div class="app-shell">
  <header class="app-header">
    <button class="drawer-toggle" type="button" aria-label={drawerOpen ? 'Collapse workspace drawer' : 'Expand workspace drawer'} aria-expanded={drawerOpen} aria-controls="workspace-navigation" onclick={() => drawerOpen = !drawerOpen}><Icon name="menu" size={19} /></button>
    <strong class="brand"><span class="brand-mark" aria-hidden="true"></span>2D Maker</strong>
  </header>
  <div class="workspace-layout" class:drawer-collapsed={!drawerOpen}>
    <nav id="workspace-navigation" class="side-drawer" aria-label="Software sections">
      <div class="drawer-group" aria-labelledby="create-label">
        <span id="create-label" class="drawer-label">CREATE</span>
        <button class:active={workspace === 'character'} type="button" aria-current={workspace === 'character' ? 'page' : undefined} title="Character" onclick={() => workspace = 'character'}><Icon name="character" /><span>Character</span></button>
        <button class:active={workspace === 'landscape'} type="button" aria-current={workspace === 'landscape' ? 'page' : undefined} title="Landscape" onclick={() => workspace = 'landscape'}><Icon name="landscape" /><span>Landscape</span></button>
        <button class:active={workspace === 'threeD'} type="button" aria-current={workspace === 'threeD' ? 'page' : undefined} title="3D artwork" onclick={openThreeDWorkspace}><Icon name="shape" /><span>3D artwork</span></button>
      </div>
      <div class="drawer-group" aria-labelledby="animate-label">
        <span id="animate-label" class="drawer-label">ANIMATE</span>
        <button class:active={workspace === 'image'} type="button" aria-current={workspace === 'image' ? 'page' : undefined} title="Animation" onclick={() => workspace = 'image'}><Icon name="motion" /><span>Animation</span></button>
      </div>
    </nav>
    <div class="workspace-content">
    {#if workspace === 'character'}
      <main>
      <aside>
        <CharacterControls
          {skeleton}
          {pose}
          {proportions}
          {boneScales}
          {showBones}
          {showJoints}
          onShowBonesChange={(value) => showBones = value}
          onShowJointsChange={(value) => showJoints = value}
          onPoseChange={(id, radians) => { animationPlaying = false; pose = { ...pose, [id]: radians } }}
          onProportionChange={(id, scale) => proportions = { ...proportions, [id]: clampProportion(scale) }}
          onBoneScaleChange={(id, scale) => boneScales = { ...boneScales, [id]: clampProportion(scale) }}
          onResetBoneLengths={resetBoneLengths}
          onResetProportions={resetProportions}
          onReset={resetTPose}
          onRandomize={randomizeCharacter}
          onRandomPose={randomizePose}
          onMirrorPose={mirrorPose}
        />
        <CharacterAnimationControls {pose} playing={animationPlaying} onPoseChange={(value) => pose = value} onPlayingChange={(value) => animationPlaying = value} />
        <ArtworkFeedback kind="character" snapshot={{ pose, proportions, boneScales }} />
        <CharacterCommandPanel onApply={applyLayaCommand} />
      </aside>
      <CharacterCanvas {skeleton} {pose} {proportions} {showBones} {showJoints} />
      </main>
    {:else if workspace === 'landscape'}
      <LandscapeWorkspace />
    {:else if workspace === 'threeD'}
      {#if ThreeDWorkspace}<ThreeDWorkspace />{:else if threeDError}<p role="alert">3D workspace could not be loaded. Reload the app and try again.</p>{:else}<p role="status">Loading 3D tools…</p>{/if}
    {:else}
      <section class="image-workspace"><ImageAnimationEditor /></section>
    {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .app-shell {
    min-height: 100svh;
    .app-header {
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 66px;
      padding: 0 clamp(16px, 3vw, 42px);
      background: var(--surface);
      border-bottom: 1px solid var(--border);

      .brand { display: inline-flex; align-items: center; gap: 10px; flex: 0 0 auto; font-size: .95rem; letter-spacing: -.025em; }
      .brand-mark { width: 10px; height: 24px; border-radius: 4px 1px 4px 1px; background: var(--accent); box-shadow: 5px 0 0 -2px var(--moss); }
      .drawer-toggle { display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 8px; background: transparent; cursor: pointer; }
      .drawer-toggle:hover { background: var(--paper); color: var(--accent); }
    }
    .workspace-content > main {
      display: grid;
      grid-template-columns: minmax(260px, 292px) minmax(0, 1fr);
      gap: clamp(16px, 2.2vw, 30px);
      align-items: start;
      max-width: 1540px;
      margin: 0 auto;
      padding: clamp(16px, 2.6vw, 34px);
    }

    aside { display: grid; gap: 10px; align-content: start; min-width: 0; max-height: calc(100svh - 94px); overflow: auto; position: sticky; top: 14px; padding-right: 3px; }
  }

  .workspace-layout { display: grid; grid-template-columns: 212px minmax(0, 1fr); min-height: calc(100svh - 66px); transition: grid-template-columns 160ms ease; }
  .workspace-layout.drawer-collapsed { grid-template-columns: 64px minmax(0, 1fr); }
  .side-drawer { display: flex; flex-direction: column; gap: 18px; padding: 18px 11px; border-right: 1px solid var(--border); background: var(--surface); }
  .drawer-group { display: grid; gap: 5px; }
  .drawer-label { padding: 4px 10px 7px; color: var(--muted); font-size: .62rem; font-weight: 700; letter-spacing: .12em; }
  .side-drawer button { display: flex; align-items: center; gap: 11px; min-height: 42px; padding: 0 11px; border: 0; border-radius: 9px; background: transparent; color: var(--muted); text-align: left; cursor: pointer; }
  .side-drawer button:hover { background: var(--paper); color: var(--text); }
  .side-drawer button.active { background: var(--accent-soft); color: var(--accent); font-weight: 650; }
  .side-drawer button span { white-space: nowrap; }
  .workspace-content { min-width: 0; }
  .drawer-collapsed .side-drawer { align-items: center; padding-right: 8px; padding-left: 8px; }
  .drawer-collapsed .side-drawer button { justify-content: center; width: 44px; padding: 0; }
  .drawer-collapsed .side-drawer button span, .drawer-collapsed .drawer-label { display: none; }
  .image-workspace { min-width: 0; }

  @media (max-width: 700px) {
    .app-shell {
      .app-header {
        flex-wrap: wrap;
        gap: 8px 14px;
        min-height: 0;
        padding: 10px 14px;
      }

      .workspace-content > main {
        grid-template-columns: minmax(0, 1fr);
        gap: 14px;
        padding: 14px;
      }
      aside { position: static; max-height: none; overflow: visible; }
    }
  }

  @media (max-width: 420px) {
    .app-shell .app-header { align-items: center; }
    .workspace-layout { grid-template-columns: 56px minmax(0, 1fr); }
    .side-drawer { align-items: center; padding: 12px 5px; }
    .side-drawer button { justify-content: center; width: 44px; padding: 0; }
    .side-drawer button span, .side-drawer .drawer-label { display: none; }
  }
</style>

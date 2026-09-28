<script lang="ts">
  import CharacterCanvas from '../features/character/ui/CharacterCanvas.svelte'
  import CharacterControls from '../features/character/ui/CharacterControls.svelte'
  import ImageAnimationEditor from '../features/image-animation/ui/ImageAnimationEditor.svelte'
  import { defaultFrontFacingTPose, type JointId, type Skeleton } from '../features/character/model/skeleton'
  import { clampProportion, defaultCharacterProportions, type CharacterProportions } from '../features/character/model/proportions'

  let skeleton = $state<Skeleton>(structuredClone(defaultFrontFacingTPose))
  let pose = $state<Partial<Record<JointId, number>>>({})
  let proportions = $state<CharacterProportions>({ ...defaultCharacterProportions })
  let showBones = $state(true)
  let showJoints = $state(true)
  let workspace = $state<'character' | 'image'>('character')

  function resetTPose() {
    skeleton = structuredClone(defaultFrontFacingTPose)
    pose = {}
  }

  function resetProportions() {
    proportions = { ...defaultCharacterProportions }
  }
</script>

<div class="app-shell">
  <header class="app-header">
    <strong>2D Maker</strong>
    <fieldset class="workspace-switch">
      <legend>Workspace</legend>
      <label>
        <input type="radio" name="workspace" value="character" bind:group={workspace} />
        <span>Character</span>
      </label>
      <label>
        <input type="radio" name="workspace" value="image" bind:group={workspace} />
        <span>Image animation</span>
      </label>
    </fieldset>
  </header>
  {#if workspace === 'character'}
    <main>
      <aside>
        <CharacterControls
          {skeleton}
          {pose}
          {proportions}
          {showBones}
          {showJoints}
          onShowBonesChange={(value) => showBones = value}
          onShowJointsChange={(value) => showJoints = value}
          onPoseChange={(id, radians) => pose = { ...pose, [id]: radians }}
          onProportionChange={(id, scale) => proportions = { ...proportions, [id]: clampProportion(scale) }}
          onResetProportions={resetProportions}
          onReset={resetTPose}
        />
      </aside>
      <CharacterCanvas {skeleton} {pose} {proportions} {showBones} {showJoints} />
    </main>
  {/if}
  <section class="image-workspace" class:active={workspace === 'image'} aria-hidden={workspace !== 'image'}>
    <ImageAnimationEditor />
  </section>
</div>

<style lang="scss">
  .app-shell {
    min-height: 100svh;
    .app-header {
      display: flex;
      align-items: center;
      gap: 24px;
      min-height: 60px;
      padding: 0 24px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);

      strong { flex: 0 0 auto; }
    }

    .workspace-switch {
      display: flex;
      align-self: stretch;
      gap: 6px;
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;

      legend {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }

      label { position: relative; cursor: pointer; }

      span {
        display: flex;
        align-items: center;
        min-height: 44px;
        padding: 0 12px;
        border-bottom: 2px solid transparent;
        color: var(--muted);
      }

      input {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
      }

      input:checked + span {
        border-bottom-color: var(--accent);
        color: var(--accent);
        font-weight: 600;
      }

      input:focus-visible + span {
        outline: 3px solid var(--accent);
        outline-offset: 2px;
      }
    }

    > main {
      display: grid;
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 28px;
      align-items: start;
      max-width: 1440px;
      margin: 0 auto;
      padding: 28px;
    }

    aside { min-width: 0; }
  }

  .image-workspace { display: none; }
  .image-workspace.active { display: block; }

  @media (max-width: 700px) {
    .app-shell {
      .app-header {
        flex-wrap: wrap;
        gap: 0 16px;
        padding: 8px 16px 0;
      }

      .workspace-switch {
        flex: 1 1 100%;
        min-height: 44px;
        margin-top: 4px;
      }

      > main {
        grid-template-columns: minmax(0, 1fr);
        gap: 20px;
        padding: 16px;
      }
    }
  }
</style>

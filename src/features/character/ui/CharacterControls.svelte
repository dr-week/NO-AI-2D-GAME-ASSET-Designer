<script lang="ts">
  import { poseJointControls, type JointId, type Skeleton } from '../model/skeleton'
  import { proportionRange, type CharacterProportions } from '../model/proportions'
  import { boneLengthControls, type BoneLengthGroup, type BoneLengthScales } from '../model/boneLengths'
  import Icon from '../../../lib/Icon.svelte'

  type Props = {
    skeleton: Skeleton
    pose: Partial<Record<JointId, number>>
    proportions: CharacterProportions
    boneScales: BoneLengthScales
    showBones: boolean
    showJoints: boolean
    onShowBonesChange: (value: boolean) => void
    onShowJointsChange: (value: boolean) => void
    onPoseChange: (id: JointId, radians: number) => void
    onProportionChange: (id: keyof CharacterProportions, scale: number) => void
    onBoneScaleChange: (id: BoneLengthGroup, scale: number) => void
    onResetBoneLengths: () => void
    onResetProportions: () => void
    onReset: () => void
    onRandomize: () => void
    onRandomPose: () => void
    onMirrorPose: () => void
  }

  let { skeleton, pose, proportions, boneScales, showBones, showJoints, onShowBonesChange, onShowJointsChange, onPoseChange, onProportionChange, onBoneScaleChange, onResetBoneLengths, onResetProportions, onReset, onRandomize, onRandomPose, onMirrorPose }: Props = $props()
  const proportionControls: { id: keyof CharacterProportions; label: string }[] = [
    { id: 'head', label: 'Head size' },
    { id: 'torso', label: 'Torso width' },
    { id: 'arms', label: 'Arm width' },
    { id: 'legs', label: 'Leg width' },
  ]
  const proportionPercentRange = {
    min: Math.round(proportionRange.min * 100),
    max: Math.round(proportionRange.max * 100),
    step: Math.round(proportionRange.step * 100),
  }
</script>

<section class="controls" aria-labelledby="controls-title">
  <header class="panel-title">
    <span class="title-icon"><Icon name="character" size={22} /></span>
    <span><h1 id="controls-title">Figure</h1><small>Front-facing rig</small></span>
  </header>
  <button class="random-button" type="button" onclick={onRandomize}><Icon name="reset" size={16} />Random character</button>
  <details class="drawer">
    <summary><Icon name="pose" /><span>Pose</span></summary>
    <div class="pose-actions"><button type="button" onclick={onRandomPose}>Random pose</button><button type="button" onclick={onMirrorPose}>Mirror pose</button></div>
    {#each poseJointControls as control (control.id)}
      {@const [min, max] = skeleton.joints[control.id].rotationLimit}
      {@const degrees = Math.round((pose[control.id] ?? 0) * 180 / Math.PI)}
      <label class="joint-control" for={`pose-${control.id}`}>
        <span>{control.label}<output>{degrees}°</output></span>
        <input id={`pose-${control.id}`} type="range" min={Math.ceil(min * 180 / Math.PI)} max={Math.floor(max * 180 / Math.PI)} value={degrees} oninput={(event) => onPoseChange(control.id, Number(event.currentTarget.value) * Math.PI / 180)} />
      </label>
    {/each}
  </details>
  <details class="drawer" open>
    <summary><Icon name="shape" /><span>Proportions</span></summary>
    {#each proportionControls as control (control.id)}
      {@const percent = Math.round(proportions[control.id] * 100)}
      <label class="joint-control" for={`proportion-${control.id}`}>
        <span>{control.label}<output>{percent}%</output></span>
        <input id={`proportion-${control.id}`} type="range" min={proportionPercentRange.min} max={proportionPercentRange.max} step={proportionPercentRange.step} value={percent} oninput={(event) => onProportionChange(control.id, Number(event.currentTarget.value) / 100)} />
      </label>
    {/each}
    <button class="inline-reset" type="button" aria-label="Reset proportions" title="Reset proportions" onclick={onResetProportions}><Icon name="reset" size={14} />Reset</button>
  </details>
  <details class="drawer">
    <summary><Icon name="bone" /><span>Bone lengths</span></summary>
    {#each boneLengthControls as control (control.id)}
      {@const percent = Math.round(boneScales[control.id] * 100)}
      <label class="joint-control" for={`bone-${control.id}`}>
        <span>{control.label}<output>{percent}%</output></span>
        <input id={`bone-${control.id}`} type="range" min={proportionPercentRange.min} max={proportionPercentRange.max} step={proportionPercentRange.step} value={percent} oninput={(event) => onBoneScaleChange(control.id, Number(event.currentTarget.value) / 100)} />
      </label>
    {/each}
    <button class="inline-reset" type="button" aria-label="Reset bone lengths" title="Reset bone lengths" onclick={onResetBoneLengths}><Icon name="reset" size={14} />Reset</button>
  </details>
  <details class="drawer view-drawer">
    <summary><Icon name="eye" /><span>Guides</span></summary>
    <label><input type="checkbox" checked={showBones} onchange={(event) => onShowBonesChange(event.currentTarget.checked)} /> Bones</label>
    <label><input type="checkbox" checked={showJoints} onchange={(event) => onShowJointsChange(event.currentTarget.checked)} /> Joints</label>
  </details>
  <button class="reset-button" type="button" onclick={onReset}><Icon name="reset" size={16} />Reset pose</button>
</section>

<style lang="scss">
  .controls {
    padding: 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    box-shadow: var(--shadow);

    .panel-title { display: flex; align-items: center; gap: 11px; margin-bottom: 12px; }
    .title-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; background: var(--accent-soft); color: var(--accent); }
    .random-button { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; min-height: 38px; margin: 0 0 10px; border: 1px solid var(--accent); border-radius: 8px; background: var(--accent); color: white; font: inherit; font-size: .8rem; font-weight: 650; cursor: pointer; }
    h1 { margin: 0; font-size: 1rem; font-weight: 650; letter-spacing: -.02em; }
    small { display: block; margin-top: 2px; color: var(--muted); font-size: .75rem; }
    label { display: flex; align-items: center; gap: 10px; min-height: 38px; cursor: pointer; }
    input { width: 16px; height: 16px; accent-color: var(--accent); }
    details { border-top: 1px solid var(--border); }
    summary { display: flex; align-items: center; gap: 9px; min-height: 43px; color: var(--text); font-size: .85rem; font-weight: 600; cursor: pointer; list-style: none; }
    summary::-webkit-details-marker { display: none; }
    summary::after { content: ''; width: 7px; height: 7px; margin: 0 3px 3px auto; border-right: 1.5px solid var(--muted); border-bottom: 1.5px solid var(--muted); transform: rotate(45deg); transition: transform 140ms ease; }
    details[open] > summary::after { margin-bottom: 0; transform: rotate(225deg); }
    summary :global(svg) { color: var(--moss); }
    .drawer { padding-bottom: 10px; }
    .joint-control {
      display: grid; gap: 2px; min-height: 48px; padding: 4px 0; font-size: 0.8rem;
      span { display: flex; justify-content: space-between; gap: 8px; }
      output { color: var(--muted); font-variant-numeric: tabular-nums; }
      input { width: 100%; height: 24px; }
    }
    .pose-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .pose-actions button { min-height: 34px; margin: 0; padding: 5px; font-size: .72rem; }
    button {
      width: 100%; min-height: 38px; margin-top: 10px; padding: 7px 10px;
      border: 1px solid var(--border); border-radius: 8px; background: transparent;
      color: var(--muted); font: inherit; font-size: .8rem; cursor: pointer;
      &:hover { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
    }
    .inline-reset { display: inline-flex; align-items: center; justify-content: flex-start; gap: 6px; width: auto; min-height: 30px; margin-top: 4px; padding: 4px 7px; border-color: transparent; color: var(--muted); font-size: .72rem; }
    .inline-reset :global(svg) { color: var(--accent); }
    .reset-button { display: flex; justify-content: center; align-items: center; gap: 7px; margin-top: 10px; border: 0; }
  }
</style>

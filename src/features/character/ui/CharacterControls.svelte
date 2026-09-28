<script lang="ts">
  import type { JointId, Skeleton } from '../model/skeleton'
  import { proportionRange, type CharacterProportions } from '../model/proportions'

  type Props = {
    skeleton: Skeleton
    pose: Partial<Record<JointId, number>>
    proportions: CharacterProportions
    showBones: boolean
    showJoints: boolean
    onShowBonesChange: (value: boolean) => void
    onShowJointsChange: (value: boolean) => void
    onPoseChange: (id: JointId, radians: number) => void
    onProportionChange: (id: keyof CharacterProportions, scale: number) => void
    onResetProportions: () => void
    onReset: () => void
  }

  let { skeleton, pose, proportions, showBones, showJoints, onShowBonesChange, onShowJointsChange, onPoseChange, onProportionChange, onResetProportions, onReset }: Props = $props()
  const poseJoints: { id: JointId; label: string }[] = [
    { id: 'shoulderL', label: 'Left shoulder' }, { id: 'elbowL', label: 'Left elbow' },
    { id: 'shoulderR', label: 'Right shoulder' }, { id: 'elbowR', label: 'Right elbow' },
    { id: 'hipL', label: 'Left hip' }, { id: 'kneeL', label: 'Left knee' },
    { id: 'hipR', label: 'Right hip' }, { id: 'kneeR', label: 'Right knee' },
  ]
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
  <h1 id="controls-title">Character</h1>
  <p>Front-facing 2D character</p>
  <label><input type="checkbox" checked={showBones} onchange={(event) => onShowBonesChange(event.currentTarget.checked)} /> Show bones</label>
  <label><input type="checkbox" checked={showJoints} onchange={(event) => onShowJointsChange(event.currentTarget.checked)} /> Show joints</label>
  <details>
    <summary>Joint pose</summary>
    {#each poseJoints as control (control.id)}
      {@const [min, max] = skeleton.joints[control.id].rotationLimit}
      {@const degrees = Math.round((pose[control.id] ?? 0) * 180 / Math.PI)}
      <label class="joint-control" for={`pose-${control.id}`}>
        <span>{control.label}<output>{degrees}°</output></span>
        <input id={`pose-${control.id}`} type="range" min={Math.ceil(min * 180 / Math.PI)} max={Math.floor(max * 180 / Math.PI)} value={degrees} oninput={(event) => onPoseChange(control.id, Number(event.currentTarget.value) * Math.PI / 180)} />
      </label>
    {/each}
  </details>
  <details>
    <summary>Body proportions</summary>
    {#each proportionControls as control (control.id)}
      {@const percent = Math.round(proportions[control.id] * 100)}
      <label class="joint-control" for={`proportion-${control.id}`}>
        <span>{control.label}<output>{percent}%</output></span>
        <input id={`proportion-${control.id}`} type="range" min={proportionPercentRange.min} max={proportionPercentRange.max} step={proportionPercentRange.step} value={percent} oninput={(event) => onProportionChange(control.id, Number(event.currentTarget.value) / 100)} />
      </label>
    {/each}
    <button type="button" onclick={onResetProportions}>Reset proportions</button>
  </details>
  <button type="button" onclick={onReset}>Reset T-pose</button>
</section>

<style lang="scss">
  .controls {
    padding: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;

    h1 { margin: 0; font-size: 1.125rem; }
    p { margin: 6px 0 20px; color: var(--muted); font-size: 0.875rem; }
    label { display: flex; align-items: center; gap: 12px; min-height: 44px; cursor: pointer; }
    input { width: 18px; height: 18px; accent-color: var(--accent); }
    details { margin-top: 16px; border-top: 1px solid var(--border); }
    summary { min-height: 44px; padding-top: 12px; font-weight: 600; cursor: pointer; }
    .joint-control {
      display: grid; gap: 2px; min-height: 52px; padding: 4px 0; font-size: 0.8125rem;
      span { display: flex; justify-content: space-between; gap: 8px; }
      output { color: var(--muted); font-variant-numeric: tabular-nums; }
      input { width: 100%; height: 24px; }
    }
    button {
      width: 100%; min-height: 44px; margin-top: 16px; padding: 8px 12px;
      border: 1px solid var(--accent); border-radius: 6px; background: var(--surface);
      color: var(--accent); font: inherit; font-weight: 600; cursor: pointer;
      &:hover { background: #f0f2ff; }
    }
  }
</style>

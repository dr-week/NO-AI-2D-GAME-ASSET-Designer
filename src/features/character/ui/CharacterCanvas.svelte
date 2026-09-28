<script lang="ts">
  import { fitSkeleton, resolveSkeleton } from '../model/geometry'
  import type { JointId, Skeleton } from '../model/skeleton'
  import type { CharacterProportions } from '../model/proportions'
  import { downloadCharacterSvg } from '../io/exportSvg'
  import Icon from '../../../lib/Icon.svelte'

  type Props = { skeleton: Skeleton; pose: Partial<Record<JointId, number>>; proportions: CharacterProportions; showBones: boolean; showJoints: boolean }
  let { skeleton, pose, proportions, showBones, showJoints }: Props = $props()
  let svgElement: SVGSVGElement
  let resolved = $derived(resolveSkeleton(skeleton, pose))
  let fit = $derived(fitSkeleton(resolved, { width: 1080, height: 1920 }))
  let jointIds = $derived(Object.keys(skeleton.joints) as JointId[])
  let poseLabel = $derived(Object.values(pose).every((angle) => Math.abs(angle ?? 0) < 0.001) ? 'T-pose' : 'Custom pose')
</script>

<section class="canvas-panel" aria-label="Character preview">
  <div class="canvas" role="group" aria-label="Transparent character canvas">
    <svg bind:this={svgElement} viewBox="0 0 1080 1920" role="img" aria-labelledby="canvas-title">
      <title id="canvas-title">{poseLabel} front view character on a transparent portrait canvas</title>
      <g transform={`translate(${fit.x} ${fit.y}) scale(${fit.scale})`}>
        <g class="body" aria-hidden="true">
          <line class="torso" stroke-width={170 * proportions.torso} x1={resolved.pelvis.x} y1={resolved.pelvis.y} x2={resolved.spine.x} y2={resolved.spine.y} />
          <line class="neck" stroke-width={62 * proportions.torso} x1={resolved.spine.x} y1={resolved.spine.y} x2={resolved.neck.x} y2={resolved.neck.y} />
          <line class="pelvis" stroke-width={125 * proportions.torso} x1={resolved.hipL.x} y1={resolved.hipL.y} x2={resolved.hipR.x} y2={resolved.hipR.y} />
          <line class="upper-limb" stroke-width={86 * proportions.arms} x1={resolved.shoulderL.x} y1={resolved.shoulderL.y} x2={resolved.elbowL.x} y2={resolved.elbowL.y} />
          <line class="lower-limb" stroke-width={68 * proportions.arms} x1={resolved.elbowL.x} y1={resolved.elbowL.y} x2={resolved.wristL.x} y2={resolved.wristL.y} />
          <line class="upper-limb" stroke-width={86 * proportions.arms} x1={resolved.shoulderR.x} y1={resolved.shoulderR.y} x2={resolved.elbowR.x} y2={resolved.elbowR.y} />
          <line class="lower-limb" stroke-width={68 * proportions.arms} x1={resolved.elbowR.x} y1={resolved.elbowR.y} x2={resolved.wristR.x} y2={resolved.wristR.y} />
          <line class="upper-limb leg" stroke-width={86 * proportions.legs} x1={resolved.hipL.x} y1={resolved.hipL.y} x2={resolved.kneeL.x} y2={resolved.kneeL.y} />
          <line class="lower-limb leg" stroke-width={68 * proportions.legs} x1={resolved.kneeL.x} y1={resolved.kneeL.y} x2={resolved.ankleL.x} y2={resolved.ankleL.y} />
          <line class="upper-limb leg" stroke-width={86 * proportions.legs} x1={resolved.hipR.x} y1={resolved.hipR.y} x2={resolved.kneeR.x} y2={resolved.kneeR.y} />
          <line class="lower-limb leg" stroke-width={68 * proportions.legs} x1={resolved.kneeR.x} y1={resolved.kneeR.y} x2={resolved.ankleR.x} y2={resolved.ankleR.y} />
          <ellipse class="head" cx={resolved.head.x} cy={resolved.head.y - 4} rx={72 * proportions.head} ry={88 * proportions.head} />
          <ellipse class="hand" cx={resolved.wristL.x} cy={resolved.wristL.y} rx={58 * proportions.arms} ry={34 * proportions.arms} />
          <ellipse class="hand" cx={resolved.wristR.x} cy={resolved.wristR.y} rx={58 * proportions.arms} ry={34 * proportions.arms} />
          <ellipse class="foot" cx={resolved.ankleL.x + 28} cy={resolved.ankleL.y + 16} rx={60 * proportions.legs} ry={30 * proportions.legs} />
          <ellipse class="foot" cx={resolved.ankleR.x - 28} cy={resolved.ankleR.y + 16} rx={60 * proportions.legs} ry={30 * proportions.legs} />
        </g>
        {#if showBones}
          <g class="bones">
            {#each jointIds as id (id)}
              {@const joint = skeleton.joints[id]}
              {#if joint.parentId}
                <line x1={resolved[joint.parentId].x} y1={resolved[joint.parentId].y} x2={resolved[id].x} y2={resolved[id].y} />
              {/if}
            {/each}
          </g>
        {/if}
        {#if showJoints}
          <g class="joints">
            {#each jointIds as id (id)}
              <circle cx={resolved[id].x} cy={resolved[id].y} r="13" />
            {/each}
          </g>
        {/if}
      </g>
    </svg>
  </div>
  <div class="canvas-caption"><strong><Icon name="character" size={16} /> Front · {poseLabel}</strong><span>1080 × 1920</span><button type="button" onclick={() => downloadCharacterSvg(svgElement)}><Icon name="export" size={16} />SVG</button></div>
</section>

<style lang="scss">
  .canvas-panel { display: grid; justify-items: center; gap: 10px; min-width: 0; }
  .canvas {
    display: grid; place-items: center; width: 100%; min-height: 0; padding: 22px;
    background-color: var(--surface-raised);
    background-image: conic-gradient(#e6e1d7 25%, transparent 0 50%, #e6e1d7 0 75%, transparent 0);
    background-size: 18px 18px;
    border: 1px solid var(--border); border-radius: 15px; box-shadow: var(--shadow);
    svg { display: block; width: min(100%, 390px); max-height: 72svh; aspect-ratio: 9 / 16; overflow: visible; }
  }
  .body { fill: none; stroke: var(--moss); stroke-linecap: round; stroke-linejoin: round; }
  .torso { stroke: #efc7a8; }
  .neck { stroke: #efc7a8; }
  .pelvis { stroke: #59657d; }
  .upper-limb { stroke: #efc7a8; }
  .lower-limb { stroke: #efc7a8; }
  .leg { stroke: var(--moss); }
  .head { fill: #efc7a8; stroke: var(--moss); stroke-width: 9; }
  .hand, .foot { fill: #efc7a8; stroke: var(--moss); stroke-width: 8; }
  .foot { fill: var(--text); }
  .bones { fill: none; stroke: var(--accent); stroke-width: 8; stroke-linecap: round; stroke-linejoin: round; }
  .joints { fill: #fff; stroke: var(--accent); stroke-width: 6; }
  .canvas-caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; color: var(--muted); font-size: 0.75rem; }
  .canvas-caption strong { display: inline-flex; align-items: center; gap: 7px; }
  .canvas-caption strong { color: var(--text); }
  .canvas-caption button { display: inline-flex; align-items: center; gap: 7px; min-height: 36px; padding: 0 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--accent); font: inherit; font-size: .8rem; cursor: pointer; }
  .canvas-caption button:hover { border-color: var(--accent); background: var(--accent-soft); }
</style>

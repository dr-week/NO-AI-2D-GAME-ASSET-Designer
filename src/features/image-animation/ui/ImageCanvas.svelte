<script lang="ts">
  import { getMaskCenter } from '../model/maskGeometry'
  import type { Layer, Motion, Point } from '../model/types'
  import { backgroundMotionDuration, motionStyle } from '../../animation/themeEngine'

  type Props = {
    imageUrl: string
    width: number
    height: number
    layers: Layer[]
    backgroundMotion: Motion
    draft: Point[]
    draftMaskUrl: string
    onAddPoint: (point: Point) => void
  }
  let { imageUrl, width, height, layers, backgroundMotion, draft, draftMaskUrl, onAddPoint }: Props = $props()
  let canvasElement = $state<SVGSVGElement>()
  let keyboardCursor = $state<Point>({ x: 0, y: 0 })

  $effect(() => { keyboardCursor = { x: width / 2, y: height / 2 } })

  function addPointerPoint(event: PointerEvent) {
    if (event.button !== 0 || !canvasElement) return
    const matrix = canvasElement.getScreenCTM()
    if (!matrix) return
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    keyboardCursor = { x: Math.max(0, Math.min(width, point.x)), y: Math.max(0, Math.min(height, point.y)) }
    onAddPoint(keyboardCursor)
  }

  function moveCursor(event: KeyboardEvent) {
    const step = Math.max(width, height) * (event.shiftKey ? 0.05 : 0.01)
    const offsets: Record<string, Point> = {
      ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step },
    }
    const offset = offsets[event.key]
    if (offset) {
      event.preventDefault()
      keyboardCursor = { x: Math.max(0, Math.min(width, keyboardCursor.x + offset.x)), y: Math.max(0, Math.min(height, keyboardCursor.y + offset.y)) }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onAddPoint(keyboardCursor)
    }
  }
</script>

<button class="image-canvas" type="button" aria-label="Image mask canvas. Click or use arrow keys to position, then press Enter to add a point." onpointerdown={addPointerPoint} onkeydown={moveCursor}>
  <svg bind:this={canvasElement} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Imported image and selected animation layers">
    <defs>
      {#each layers as layer (layer.id)}
        {#if layer.kind === 'image' && !layer.maskUrl}
          <clipPath id={`clip-${layer.id}`} clipPathUnits="userSpaceOnUse">
            <polygon points={layer.points.map((point) => `${point.x},${point.y}`).join(' ')} />
          </clipPath>
        {/if}
      {/each}
      {#each layers as layer (layer.id)}
        {#if layer.kind === 'image' && layer.maskUrl}
          <mask id={`mask-${layer.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
            <image href={layer.maskUrl} width={width} height={height} />
          </mask>
        {/if}
      {/each}
    </defs>
    <g transform={`translate(${width / 2} ${height / 2})`}>
      <g class={`motion-effect motion-${backgroundMotion}`} style={motionStyle(backgroundMotion, backgroundMotionDuration)}>
        <g transform={`translate(${-width / 2} ${-height / 2})`}><image href={imageUrl} width={width} height={height} /></g>
      </g>
    </g>
    {#each layers as layer (layer.id)}
      {#if layer.kind === 'text'}
        <g transform={`translate(${layer.x} ${layer.y})`}>
          <g class={`motion-effect motion-${layer.motion}`} style={motionStyle(layer.motion, layer.duration)}>
          <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size={layer.fontSize} fill={layer.fill}>{layer.text}</text>
          </g>
        </g>
      {:else}
        {@const center = layer.maskUrl ? { x: width / 2, y: height / 2 } : getMaskCenter(layer.points)}
        <g transform={`translate(${center.x} ${center.y})`}>
          <g class={`motion-effect motion-${layer.motion}`} style={motionStyle(layer.motion, layer.duration)}>
            <g transform={`translate(${-center.x} ${-center.y})`}>
              <image href={imageUrl} width={width} height={height} clip-path={layer.maskUrl ? undefined : `url(#clip-${layer.id})`} mask={layer.maskUrl ? `url(#mask-${layer.id})` : undefined} />
            </g>
          </g>
        </g>
      {/if}
    {/each}
    {#if draft.length > 0}
      <polyline class="selection" points={draft.map((point) => `${point.x},${point.y}`).join(' ')} />
      {#each draft as point, index (index)}<circle class="selection-point" cx={point.x} cy={point.y} r={Math.max(3, width / 400)} />{/each}
    {/if}
    {#if draftMaskUrl}<image href={draftMaskUrl} width={width} height={height} opacity="0.38" pointer-events="none" />{/if}
    <circle class="keyboard-cursor" cx={keyboardCursor.x} cy={keyboardCursor.y} r={Math.max(5, width / 300)} />
  </svg>
</button>

<style lang="scss">
  .image-canvas { display: grid; place-items: center; max-width: 100%; max-height: 68svh; padding: 0; border: 0; border-radius: 0; background: transparent; color: inherit; cursor: crosshair;
    svg { display: block; width: auto; height: auto; max-width: 100%; max-height: 68svh; }
  }
  .selection { fill: #5269c922; stroke: #5269c9; stroke-width: 4; stroke-dasharray: 8 5; }
  .selection-point { fill: white; stroke: #5269c9; stroke-width: 2; }
  .keyboard-cursor { fill: #ffdf66aa; stroke: #302800; stroke-width: 3; pointer-events: none; }
  .motion-effect { transform-box: view-box; transform-origin: 0 0; animation: layer-motion var(--cycle) cubic-bezier(.2, 0, 0, 1) var(--motion-iterations) var(--motion-direction) both; }
  @keyframes layer-motion { from { transform: var(--motion-from); opacity: var(--opacity-from); } to { transform: var(--motion-to); opacity: var(--opacity-to); } }
  @media (prefers-reduced-motion: reduce) { .motion-effect { animation: none; } }
</style>

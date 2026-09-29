<script lang="ts">
  import { onDestroy } from 'svelte'
  import { untrack } from 'svelte'
  import Icon from '../../../lib/Icon.svelte'
  import { characterMotionClips, sampleCharacterClip } from '../model/animation'
  import type { CharacterPose, JointId } from '../model/skeleton'

  type Props = { pose: CharacterPose; playing: boolean; onPoseChange: (pose: CharacterPose) => void; onPlayingChange: (playing: boolean) => void }
  let { pose, playing, onPoseChange, onPlayingChange }: Props = $props()
  let selectedClipId = $state('wave')
  let clip = $derived(characterMotionClips[selectedClipId])
  let progress = $state(0)
  let speed = $state(1)
  let cycleDuration = $derived(clip.duration / speed)
  let frame = 0
  let startedAt = 0
  let startProgress = 0

  function showFrame(value: number) {
    progress = value
    onPoseChange(sampleCharacterClip(clip, value, pose))
  }

  function advance(now: number) {
    const cycle = cycleDuration * 1000
    const next = (startProgress + (now - startedAt) / cycle) % 1
    showFrame(next)
    frame = requestAnimationFrame(advance)
  }

  function togglePlayback() {
    if (playing) {
      onPlayingChange(false)
      return
    }
    onPlayingChange(true)
  }

  function restartClip() {
    seek(0)
  }

  function seek(value: number) {
    showFrame(value)
    if (playing) {
      startProgress = value
      startedAt = performance.now()
    }
  }

  function stepKeyframe(direction: -1 | 1) {
    const times = clip.keyframes.map(({ at }) => at)
    const target = direction < 0
      ? [...times].reverse().find((time) => time < progress - 0.001) ?? times[times.length - 1]
      : times.find((time) => time > progress + 0.001) ?? times[0]
    seek(target)
  }

  function selectClip(id: string) {
    const nextClip = characterMotionClips[id]
    if (!nextClip) return
    const clearedPose = { ...pose }
    for (const frame of clip.keyframes) {
      for (const joint of Object.keys(frame.pose) as JointId[]) clearedPose[joint] = 0
    }
    selectedClipId = id
    progress = 0
    onPoseChange(sampleCharacterClip(nextClip, 0, clearedPose))
    if (playing) {
      startProgress = 0
      startedAt = performance.now()
    }
  }

  $effect(() => {
    if (!playing) return
    startedAt = performance.now()
    startProgress = untrack(() => progress)
    frame = requestAnimationFrame(advance)
    return () => cancelAnimationFrame(frame)
  })

  function scrub(event: Event) {
    seek(Number((event.currentTarget as HTMLInputElement).value) / 1000)
  }

  onDestroy(() => cancelAnimationFrame(frame))
</script>

<section class="motion-controls" aria-label="Character animation controls">
  <header class="motion-heading"><Icon name="motion" size={17} /><strong>Motion</strong><select aria-label="Character animation" value={selectedClipId} onchange={(event) => selectClip(event.currentTarget.value)}>{#each Object.values(characterMotionClips) as item (item.id)}<option value={item.id}>{item.name}</option>{/each}</select><span>Loop · {clip.keyframes.length} poses</span></header>
  <div class="transport" aria-label="Animation transport">
    <button type="button" aria-label="Previous key pose" title="Previous key pose" onclick={() => stepKeyframe(-1)}>Prev key</button>
    <button type="button" class="play-button" aria-label={playing ? 'Pause character animation' : 'Play character animation'} aria-pressed={playing} onclick={togglePlayback}><Icon name={playing ? 'pause' : 'play'} size={16} /><span>{playing ? 'Pause' : 'Animate'}</span></button>
    <button type="button" class="restart-button" aria-label="Restart animation" title="Restart clip" onclick={restartClip}><Icon name="reset" size={15} /></button>
    <button type="button" aria-label="Next key pose" title="Next key pose" onclick={() => stepKeyframe(1)}>Next key</button>
  </div>
  <label class="scrub-control" for="character-motion-time">
    <span class="visually-hidden">Animation position</span>
    <input id="character-motion-time" type="range" min="0" max="1000" step="1" value={Math.round(progress * 1000)} oninput={scrub} />
    <output>{(progress * cycleDuration).toFixed(1)}s</output>
  </label>
  <label class="speed-control" for="character-motion-speed"><span>Speed <output>{speed.toFixed(1)}×</output></span><input id="character-motion-speed" type="range" min="0.5" max="2" step="0.1" value={speed} oninput={(event) => speed = Number(event.currentTarget.value)} /></label>
</section>

<style lang="scss">
  .motion-controls { display: grid; gap: 9px; padding: 11px 13px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow); }
  .motion-heading { display: flex; align-items: center; gap: 7px; color: var(--moss); font-size: .76rem; }
  .motion-heading strong { color: var(--text); font-weight: 650; }
  .motion-heading select { flex: 1; min-width: 0; min-height: 32px; padding: 4px 7px; border: 1px solid var(--border); border-radius: 7px; background: var(--surface-raised); color: var(--text); font: inherit; }
  .motion-heading > span { color: var(--muted); font-size: .68rem; white-space: nowrap; }
  .transport { display: grid; grid-template-columns: 1fr auto 34px 1fr; gap: 6px; }
  .transport > button { min-height: 34px; padding: 4px 7px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--muted); font: inherit; font-size: .68rem; cursor: pointer; }
  .transport > button:hover { border-color: var(--accent); color: var(--accent); }
  .transport > .play-button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 36px; padding: 0 11px; border: 0; border-radius: 9px; background: var(--accent); color: white; font: inherit; font-size: .74rem; font-weight: 650; cursor: pointer; }
  .transport > .play-button:hover { background: #9f4939; color: white; }
  .restart-button { display: grid; place-items: center; width: 34px; padding: 0 !important; }
  .scrub-control { display: flex; align-items: center; gap: 8px; min-width: 0; margin: 0; color: var(--muted); font-size: .68rem; }
  .scrub-control input { width: 100%; min-width: 50px; accent-color: var(--accent); }
  .speed-control { display: grid; gap: 2px; margin: 0; color: var(--muted); font-size: .68rem; }
  .speed-control span { display: flex; justify-content: space-between; }
  .speed-control input { width: 100%; accent-color: var(--accent); }
  output { min-width: 30px; color: var(--muted); font-size: .68rem; font-variant-numeric: tabular-nums; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @media (max-width: 420px) { .motion-controls { gap: 7px; padding: 9px; } .transport { gap: 4px; } .transport > button { padding: 3px 4px; font-size: .63rem; } }
</style>

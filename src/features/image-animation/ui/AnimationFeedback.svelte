<script lang="ts">
  import type { Layer, Motion, FeedbackEntry } from '../model/types'

  type Props = {
    imageName: string
    backgroundMotion: Motion
    layers: Layer[]
    onRandomAnimation: () => void
  }
  type FeedbackFile = { getFile(): Promise<{ text(): Promise<string> }>; createWritable(): Promise<{ write(data: string): Promise<void>; close(): Promise<void> }> }
  type FeedbackDirectory = { getFileHandle(name: string, options: { create: boolean }): Promise<FeedbackFile> }
  type WindowWithDirectoryPicker = Window & { showDirectoryPicker?: () => Promise<FeedbackDirectory> }

  let { imageName, backgroundMotion, layers, onRandomAnimation }: Props = $props()
  const storageKey = '2dmaker-animation-feedback-v1'
  const logFileName = '2dmaker-animation-feedback.jsonl'
  const motionChoices: Motion[] = ['float', 'drift', 'pulse']
  let entries = $state(loadEntries())
  let status = $state('Feedback stays in this browser until you choose a folder or download it.')
  let trialId = $state('')
  let ratedTrial = $state(false)
  let directory: FeedbackDirectory | null = null

  function loadEntries(): FeedbackEntry[] {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
      return Array.isArray(value) ? value as FeedbackEntry[] : []
    } catch { return [] }
  }

  function randomAnimation() {
    onRandomAnimation()
    trialId = crypto.randomUUID()
    ratedTrial = false
    status = 'Rate this animation to record your feedback.'
  }

  async function chooseFolder() {
    try {
      const picker = (window as WindowWithDirectoryPicker).showDirectoryPicker
      if (!picker) { status = 'Folder access is unavailable. Download the log instead.'; return }
      directory = await picker.call(window)
      status = `Future ratings will be saved to ${logFileName} in the chosen folder.`
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      status = 'Could not open folder. Feedback remains stored in this browser.'
    }
  }

  function downloadLog() {
    const text = entries.map((entry) => JSON.stringify(entry)).join('\n')
    const url = URL.createObjectURL(new Blob([text ? `${text}\n` : ''], { type: 'application/x-ndjson' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = logFileName
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function rateTrial(rating: FeedbackEntry['rating']) {
    if (!trialId || ratedTrial) return
    const entry: FeedbackEntry = {
      id: trialId,
      createdAt: new Date().toISOString(),
      rating,
      image: imageName,
      backgroundMotion,
      layers: layers.map(({ name, motion, duration }) => ({ name, motion, duration })),
    }
    entries = [...entries, entry].slice(-5000)
    ratedTrial = true
    try { localStorage.setItem(storageKey, JSON.stringify(entries)) }
    catch { status = 'Browser storage is full; use a feedback folder or download the log.' }
    if (!directory) {
      status = 'Rating saved in this browser. Choose a feedback folder or download the log.'
      return
    }
    try {
      const file = await directory.getFileHandle(logFileName, { create: true })
      const previous = await (await file.getFile()).text()
      const writer = await file.createWritable()
      await writer.write(`${previous}${previous && !previous.endsWith('\n') ? '\n' : ''}${JSON.stringify(entry)}\n`)
      await writer.close()
      status = `Rating saved to ${logFileName}.`
    } catch {
      status = 'Folder write failed. Rating remains in the browser; download the log as backup.'
    }
  }
</script>

<section class="feedback-panel" aria-labelledby="feedback-title">
  <h2 id="feedback-title">Animation trials</h2>
  <button class="random-button" type="button" onclick={randomAnimation}>Random animation</button>
  <div class="rating-row">
    <button type="button" aria-label="Like this animation" disabled={!trialId || ratedTrial} onclick={() => rateTrial('like')}>👍 Like</button>
    <button type="button" aria-label="Dislike this animation" disabled={!trialId || ratedTrial} onclick={() => rateTrial('dislike')}>👎 Dislike</button>
  </div>
  <p aria-live="polite">{status}</p>
  <p class="feedback-count">{entries.length} ratings stored locally</p>
  <button type="button" onclick={chooseFolder}>Choose feedback folder</button>
  <button type="button" disabled={!entries.length} onclick={downloadLog}>Download feedback log</button>
</section>

<style lang="scss">
  .feedback-panel { display: grid; gap: 8px; margin: 16px 0; padding: 12px; border: 1px solid var(--border); border-radius: 7px; background: #f8f9fc;
    h2 { margin: 0 0 2px; }
    p { margin: 0; }
    button { min-height: 40px; }
  }
  .random-button { background: var(--accent); border-color: var(--accent); color: white; font-weight: 650; }
  .rating-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .feedback-count { font-size: .75rem !important; }
</style>

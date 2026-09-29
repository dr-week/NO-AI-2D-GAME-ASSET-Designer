<script lang="ts">
  import { downloadBlob } from '../../../platform/download'
  import type { Layer, Motion, FeedbackEntry } from '../model/types'
  import { createFeedbackEntry } from '../model/feedback'
  import { artworkFeedbackFileName, serializeUnifiedFeedbackLog } from '../../artwork-feedback/io/unifiedExport'
  import {
    appendFeedbackEntry,
    chooseFeedbackDirectory,
    feedbackFileName,
    loadFeedbackEntries,
    saveFeedbackEntries,
    type FeedbackDirectory,
  } from '../io/feedbackStore'

  type Props = {
    imageName: string
    backgroundMotion: Motion
    layers: Layer[]
    onRandomAnimation: () => void
  }
  let { imageName, backgroundMotion, layers, onRandomAnimation }: Props = $props()
  let entries = $state(loadFeedbackEntries())
  let status = $state('Feedback stays in this browser until you choose a folder or download it.')
  let trialId = $state('')
  let ratedTrial = $state(false)
  let directory: FeedbackDirectory | null = null

  function randomAnimation() {
    onRandomAnimation()
    trialId = crypto.randomUUID()
    ratedTrial = false
    status = 'Rate this animation to record your feedback.'
  }

  async function chooseFolder() {
    try {
      directory = await chooseFeedbackDirectory()
      if (!directory) { status = 'Folder access is unavailable. Download the log instead.'; return }
      status = `Future ratings will be saved to ${feedbackFileName} in the chosen folder.`
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      status = 'Could not open folder. Feedback remains stored in this browser.'
    }
  }

  function downloadLog() {
    downloadBlob(new Blob([serializeUnifiedFeedbackLog()], { type: 'application/x-ndjson' }), artworkFeedbackFileName)
  }

  async function rateTrial(rating: FeedbackEntry['rating']) {
    if (!trialId || ratedTrial) return
    const entry = createFeedbackEntry({
      id: trialId,
      createdAt: new Date().toISOString(),
      rating,
      image: imageName,
      backgroundMotion,
      layers,
    })
    entries = [...entries, entry].slice(-5000)
    ratedTrial = true
    let savedLocally = true
    savedLocally = saveFeedbackEntries(entries)
    if (!directory) {
      status = savedLocally
        ? 'Rating saved in this browser. Choose a feedback folder or download the log.'
        : 'Browser storage failed. Rating is available to download in this session.'
      return
    }
    try {
      await appendFeedbackEntry(directory, entry)
      status = `Rating saved to ${feedbackFileName}.`
    } catch {
      status = savedLocally
        ? 'Folder write failed. Rating remains in the browser; download the log as backup.'
        : 'Folder and browser storage failed. Rating is available to download in this session.'
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
  <button type="button" onclick={downloadLog}>Export all ratings (JSONL)</button>
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

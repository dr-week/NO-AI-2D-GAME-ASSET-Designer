<script lang="ts">
  import { downloadBlob } from '../../../platform/download'
  import { loadArtworkFeedbackEntries, saveArtworkFeedbackEntries, type ArtworkFeedbackEntry } from '../io/feedbackStore'
  import { artworkFeedbackFileName, serializeUnifiedFeedbackLog } from '../io/unifiedExport'
  type Props = { kind: 'character' | 'landscape'; snapshot: unknown }
  let { kind, snapshot }: Props = $props()
  let status = $state('Rate this artwork to save local feedback.')
  let entries = $state(loadArtworkFeedbackEntries())
  let signature = $derived(JSON.stringify(snapshot) ?? 'null')
  let alreadyRated = $derived(entries.some((entry) => entry.kind === kind && entry.snapshot === signature))

  function rate(rating: ArtworkFeedbackEntry['rating']) {
    if (alreadyRated) return
    const entry = { kind, snapshot: signature, rating, createdAt: new Date().toISOString() }
    entries = [...entries, entry].slice(-5000)
    if (saveArtworkFeedbackEntries(entries)) {
      status = 'Feedback saved in this browser.'
    } else {
      status = 'Browser storage is full or unavailable; this rating could not be saved.'
    }
  }

  function exportRatings() {
    const content = serializeUnifiedFeedbackLog()
    if (!content) { status = 'No ratings are available to export yet.'; return }
    downloadBlob(new Blob([content], { type: 'application/x-ndjson' }), artworkFeedbackFileName)
  }
</script>

<section class="artwork-feedback" aria-label={`${kind} artwork feedback`}>
  <div class="feedback-heading"><strong>How does it look?</strong><span>{entries.length} ratings</span></div>
  <div class="rating-row">
    <button type="button" aria-label="Thumbs up, I like this artwork" aria-pressed={alreadyRated && entries.find((entry) => entry.kind === kind && entry.snapshot === signature)?.rating === 'like'} disabled={alreadyRated} onclick={() => rate('like')}>👍 <span>Looks good</span></button>
    <button type="button" aria-label="Thumbs down, I dislike this artwork" aria-pressed={alreadyRated && entries.find((entry) => entry.kind === kind && entry.snapshot === signature)?.rating === 'dislike'} disabled={alreadyRated} onclick={() => rate('dislike')}>👎 <span>Needs work</span></button>
  </div>
  <button type="button" onclick={exportRatings}>Export all ratings (JSONL)</button>
  <p aria-live="polite">{status}</p>
</section>

<style lang="scss">
  .artwork-feedback { display: grid; gap: 8px; padding: 11px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-raised); }
  .feedback-heading { display: flex; justify-content: space-between; gap: 8px; font-size: .76rem; }
  .feedback-heading span, p { color: var(--muted); font-size: .68rem; }
  .rating-row { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  button { min-height: 38px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); font: inherit; font-size: .72rem; cursor: pointer; }
  button:hover:not(:disabled), button[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
  button:disabled { cursor: default; opacity: .72; }
  p { margin: 0; line-height: 1.4; }
</style>

<script lang="ts">
  import { describeLayaCommand, parseLayaCommand, type LayaCommand } from '../model/commands.ts'
  import { decideCharacterBrief } from '../model/localCharacterDecision.ts'
  import type { CharacterDecisionConfig } from '../model/characterDecision.ts'
  import { characterProfiles, type CharacterProfileId } from '../model/characterProfiles.ts'
  import { suggestCharacterProfile } from '../io/systemOneClient.ts'
  const canUseLocalModel = import.meta.env.DEV

  type Props = {
    onApply: (command: LayaCommand) => void
    onApplyDecision: (config: CharacterDecisionConfig) => void
  }
  let { onApply, onApplyDecision }: Props = $props()
  let input = $state('')
  let brief = $state('')
  let selectedProfile = $state<CharacterProfileId>('balanced')
  let modelSuggestion = $state<CharacterProfileId | null>(null)
  let modelBusy = $state(false)
  let status = $state('Commands are checked locally against character limits.')

  function submit(event: SubmitEvent) {
    event.preventDefault()
    try {
      const command = parseLayaCommand(input)
      onApply(command)
      status = `Applied: ${describeLayaCommand(command)}.`
      input = ''
    } catch (cause) {
      status = cause instanceof Error ? cause.message : 'Could not apply command.'
    }
  }

  function quickDesign(event: SubmitEvent) {
    event.preventDefault()
    const result = decideCharacterBrief(brief, selectedProfile)
    if (!result.ok) {
      status = result.reason
      return
    }
    onApplyDecision(result.config)
    const name = characterProfiles[result.profile].name
    status = result.matchedOverall
      ? `${name} profile applied with overall character sizing.`
      : `${name} profile applied; ${result.matchedFeatures} explicit feature cues refined it.`
  }

  async function askLocalModel() {
    modelBusy = true
    modelSuggestion = null
    status = 'Waiting for the optional local Laya runtime…'
    const requestedBrief = brief
    try {
      const suggestion = await suggestCharacterProfile(requestedBrief)
      if (brief !== requestedBrief) {
        status = 'Brief changed while Laya was deciding. Request a new suggestion.'
        return
      }
      modelSuggestion = suggestion
      status = 'Laya suggested a body profile. Review it before applying.'
    } catch (cause) {
      status = cause instanceof Error
        ? `${cause.message} Start the optional model with scripts/start-laya-system-one.ps1.`
        : 'Local Laya could not decide; manual controls remain available.'
    } finally {
      modelBusy = false
    }
  }

  function applyModelSuggestion() {
    if (!modelSuggestion) return
    selectedProfile = modelSuggestion
    onApplyDecision(characterProfiles[modelSuggestion].config)
    status = `${characterProfiles[modelSuggestion].name} suggestion applied. Review the character preview.`
    modelSuggestion = null
  }
</script>

<section class="laya-panel" aria-labelledby="laya-title">
  <h2 id="laya-title">Laya commands</h2>
  <form onsubmit={submit}>
    <label for="laya-command">Character command</label>
    <input id="laya-command" bind:value={input} autocomplete="off" placeholder="pose left elbow 45°" />
    <button type="submit">Apply command</button>
  </form>
  <form onsubmit={quickDesign}>
    <label for="laya-profile">Body profile</label>
    <select id="laya-profile" bind:value={selectedProfile}>
      {#each Object.values(characterProfiles) as profile}
        <option value={profile.id}>{profile.name} · {profile.description}</option>
      {/each}
    </select>
    <label for="laya-brief">Local System 1 quick design</label>
    <textarea id="laya-brief" bind:value={brief} maxlength="500" rows="2" oninput={() => modelSuggestion = null} placeholder="small head, broad torso, long arms"></textarea>
    <button type="submit">Shape character from brief</button>
    {#if canUseLocalModel}<button type="button" disabled={modelBusy} onclick={askLocalModel}>{modelBusy ? 'Deciding…' : 'Suggest with Laya'}</button>{/if}
  </form>
  {#if modelSuggestion}
    <div class="suggestion" aria-label="Laya profile suggestion">
      <strong>{characterProfiles[modelSuggestion].name}</strong>
      <span>{characterProfiles[modelSuggestion].description}</span>
      <div>
        <button type="button" onclick={applyModelSuggestion}>Review in preview</button>
        <button type="button" onclick={() => modelSuggestion = null}>Dismiss</button>
      </div>
    </div>
  {/if}
  <small>Rules work offline. Local Laya inference is development-only and downloads model weights on first use.</small>
  <p role="status" aria-live="polite">{status}</p>
  <details>
    <summary>Command examples</summary>
    <ul>
      <li><code>pose left elbow 45°</code></li>
      <li><code>proportion head 110%</code></li>
      <li><code>length upper arm 110%</code></li>
      <li><code>reset pose</code>, <code>reset proportions</code>, or <code>reset lengths</code></li>
    </ul>
  </details>
</section>

<style lang="scss">
  .laya-panel {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);

    h2 { margin: 0; font-size: 1rem; }
    form, ul { display: grid; gap: 8px; }
    label, small { font-size: .8125rem; }
    small { color: var(--muted); }
    input, textarea, select, button { min-height: 40px; padding: 8px 10px; font: inherit; }
    input, textarea, select { min-width: 0; border: 1px solid var(--border); border-radius: 5px; }
    textarea { resize: vertical; }
    button { border: 1px solid var(--accent); border-radius: 5px; background: var(--surface); color: var(--accent); cursor: pointer; }
    button:disabled { opacity: .6; cursor: wait; }
    .suggestion { display: grid; gap: 6px; padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-size: .8125rem; }
    .suggestion div { display: flex; gap: 8px; }
    p { margin: 0; font-size: .8125rem; color: var(--muted); }
    summary { min-height: 36px; padding-top: 8px; cursor: pointer; }
    ul { margin: 4px 0 0; padding-left: 20px; font-size: .8125rem; }
  }
</style>

<script lang="ts">
  import { describeLayaCommand, parseLayaCommand, type LayaCommand } from '../model/commands.ts'

  type Props = { onApply: (command: LayaCommand) => void }
  let { onApply }: Props = $props()
  let input = $state('')
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
</script>

<section class="laya-panel" aria-labelledby="laya-title">
  <h2 id="laya-title">Laya commands</h2>
  <form onsubmit={submit}>
    <label for="laya-command">Character command</label>
    <input id="laya-command" bind:value={input} autocomplete="off" placeholder="pose left elbow 45°" />
    <button type="submit">Apply command</button>
  </form>
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
    label { font-size: .8125rem; }
    input, button { min-height: 40px; padding: 8px 10px; font: inherit; }
    input { min-width: 0; border: 1px solid var(--border); border-radius: 5px; }
    button { border: 1px solid var(--accent); border-radius: 5px; background: var(--surface); color: var(--accent); cursor: pointer; }
    p { margin: 0; font-size: .8125rem; color: var(--muted); }
    summary { min-height: 36px; padding-top: 8px; cursor: pointer; }
    ul { margin: 4px 0 0; padding-left: 20px; font-size: .8125rem; }
  }
</style>

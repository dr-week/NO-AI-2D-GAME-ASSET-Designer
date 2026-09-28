import assert from 'node:assert/strict'
import test from 'node:test'
import {
  animationTemplates,
  backgroundMotionDuration,
  defaultMotionDuration,
  createTemplateMotion,
  motionDefinitions,
  motionStyle,
} from '../src/features/animation/themeEngine.ts'

const templates = Object.values(animationTemplates)

test('every template points to a supported motion definition', () => {
  for (const template of templates) {
    assert.ok(template.id)
    assert.ok(motionDefinitions[template.motion], `${template.id} has a motion definition`)
    assert.ok(template.durationMs[0] > 0 && template.durationMs[1] >= template.durationMs[0])
  }
})

test('random templates cover every supported animated motion', () => {
  const templateMotions = new Set(templates.map(({ motion }) => motion))
  const animatedMotions = Object.keys(motionDefinitions).filter((motion) => motion !== 'still')
  assert.deepEqual([...templateMotions].sort(), animatedMotions.sort())
})

test('seeded variants stay in bounds and repeat exactly', () => {
  for (const template of templates) {
    const first = createTemplateMotion(template, 42)
    const second = createTemplateMotion(template, 42)
    const [min, max] = template.durationMs.map((value) => value / 1000)
    assert.deepEqual(first, second)
    assert.ok(first.duration >= min - 0.01 && first.duration <= max + 0.01)
    assert.equal(first.motion, template.motion)
  }
})

test('image editor motion variants are stable for a seed', () => {
  for (const template of templates) {
    assert.deepEqual(
      createTemplateMotion(template, 42),
      createTemplateMotion(template, 42),
    )
  }
})

test('shared-axis templates combine fade and horizontal or vertical movement', () => {
  for (const motion of ['sharedAxisX', 'sharedAxisY']) {
    assert.ok(motionDefinitions[motion].opacity)
    assert.equal(motionDefinitions[motion].transform?.type, 'translate')
    assert.match(motionStyle(motion, 0.3), /--opacity-from:0/)
    assert.match(motionStyle(motion, 0.3), /--cycle:0.3s/)
  }
})

test('canvas background motion uses one preview and export duration', () => {
  assert.equal(backgroundMotionDuration, 8)
})

test('directly selected motions use their template midpoint duration', () => {
  assert.equal(defaultMotionDuration('fade'), 0.3)
  assert.equal(defaultMotionDuration('rise'), 0.35)
  assert.equal(defaultMotionDuration('float'), 3)
  assert.equal(defaultMotionDuration('still'), 3)
})

test('every motion produces complete preview CSS variables', () => {
  for (const motion of Object.keys(motionDefinitions)) {
    const style = motionStyle(motion, 2)
    for (const name of ['--cycle:', '--motion-from:', '--motion-to:', '--opacity-from:', '--opacity-to:']) {
      assert.ok(style.includes(name), `${motion} includes ${name}`)
    }
    assert.doesNotMatch(style, /undefined|NaN/)
  }
})

test('preview transform strings derive from canonical motion values', () => {
  assert.match(motionStyle('sharedAxisX', 0.3), /--motion-from:translate\(24px, 0px\)/)
  assert.match(motionStyle('rotate', 2), /--motion-to:rotate\(5deg\)/)
  assert.match(motionStyle('pulse', 2), /--motion-to:scale\(1\.025\)/)
})

test('variation rejects non-finite seeds', () => {
  assert.throws(() => createTemplateMotion(templates[0], Number.POSITIVE_INFINITY), /finite/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { defaultFrontFacingTPose } from '../src/features/character/model/skeleton.ts'
import { fitSkeleton, resolveSkeleton } from '../src/features/character/model/geometry.ts'

test('default T-pose has connected bilateral joints and horizontal arms', () => {
  const joints = resolveSkeleton(defaultFrontFacingTPose)
  const pairs = [
    ['shoulderL', 'shoulderR'], ['elbowL', 'elbowR'], ['wristL', 'wristR'],
    ['hipL', 'hipR'], ['kneeL', 'kneeR'], ['ankleL', 'ankleR'],
  ]

  for (const [left, right] of pairs) {
    assert.ok(Math.abs((joints[left].x + joints[right].x) / 2 - joints.pelvis.x) < 1e-9)
    assert.ok(Math.abs(joints[left].y - joints[right].y) < 1e-9)
  }
  for (const id of ['shoulderL', 'elbowL', 'wristL', 'shoulderR', 'elbowR', 'wristR']) {
    const joint = defaultFrontFacingTPose.joints[id]
    assert.ok(joint.parentId)
    assert.ok(joint.boneLength > 0)
    assert.ok(joints[joint.parentId])
  }
  assert.equal(joints.shoulderL.y, joints.elbowL.y)
  assert.equal(joints.elbowL.y, joints.wristL.y)
  assert.equal(joints.shoulderR.y, joints.elbowR.y)
  assert.equal(joints.elbowR.y, joints.wristR.y)
})

test('maximum supported head and pose stay inside portrait viewBox', () => {
  const joints = resolveSkeleton(defaultFrontFacingTPose, {
    shoulderL: 0.8,
    elbowL: -1.8,
    shoulderR: -0.8,
    elbowR: 1.8,
  })
  const fit = fitSkeleton(joints, { width: 1080, height: 1920 })
  const headLeft = (joints.head.x - 72 * 1.3 - 4.5) * fit.scale + fit.x
  const headTop = (joints.head.y - 4 - 88 * 1.3 - 4.5) * fit.scale + fit.y
  const ankleBottom = (joints.ankleL.y + 16 + 30 * 1.3 + 4) * fit.scale + fit.y

  assert.ok(headLeft >= 0)
  assert.ok(headTop >= 0)
  assert.ok(ankleBottom <= 1920)
})

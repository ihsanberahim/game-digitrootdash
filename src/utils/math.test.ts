import assert from 'node:assert/strict';
import test from 'node:test';
import { computeDigitalRoot, getStepByStepBreakdown } from './math';

for (const value of ['18', '90', '19', '3838', '6093', '0']) {
  test(`casting-out result matches the digital root for ${value}`, () => {
    const breakdown = getStepByStepBreakdown(value);
    assert.equal(breakdown.castingOutNines.finalRoot, computeDigitalRoot(value));
  });
}

test('all-cancel input keeps nine as its digital root', () => {
  const breakdown = getStepByStepBreakdown('18');
  assert.deepEqual(breakdown.castingOutNines.cancelledDigits, [0, 1]);
  assert.equal(breakdown.castingOutNines.remainingSum, 0);
  assert.equal(breakdown.castingOutNines.finalRoot, 9);
});

test('inputs without cancellation retain every digit', () => {
  const breakdown = getStepByStepBreakdown('3838');
  assert.deepEqual(breakdown.castingOutNines.cancelledDigits, []);
  assert.deepEqual(breakdown.castingOutNines.remainingDigits, [3, 8, 3, 8]);
  assert.equal(breakdown.castingOutNines.remainingSum, 22);
  assert.equal(breakdown.castingOutNines.finalRoot, 4);
});

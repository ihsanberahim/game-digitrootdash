import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateTimeTaken,
  shouldHandleGameKey,
  shouldFinishOnQuit,
  shouldStartFromMenuShortcut,
} from './game';

test('menu Enter shortcut is blocked while a sheet is open', () => {
  assert.equal(shouldStartFromMenuShortcut('Enter', 'DIV', true), false);
});

test('menu Enter shortcut ignores interactive controls', () => {
  assert.equal(shouldStartFromMenuShortcut('Enter', 'BUTTON', false), false);
  assert.equal(shouldStartFromMenuShortcut('Enter', 'INPUT', false), false);
});

test('menu Enter shortcut starts from a non-interactive target', () => {
  assert.equal(shouldStartFromMenuShortcut('Enter', 'BODY', false), true);
});

test('game shortcuts are blocked behind a modal', () => {
  assert.equal(shouldHandleGameKey('5', false, true), false);
  assert.equal(shouldHandleGameKey('h', false, true), false);
  assert.equal(shouldHandleGameKey('Escape', false, true), false);
});

test('held game keys do not spend attempts', () => {
  assert.equal(shouldHandleGameKey('5', true, false), false);
});

test('timed games record their configured full duration', () => {
  assert.equal(calculateTimeTaken('timed', 60, 1, 0), 60);
});

test('untimed games use elapsed time', () => {
  assert.equal(calculateTimeTaken('sprint', 60, 0, 17), 17);
  assert.equal(calculateTimeTaken('zen', 60, 0, 23), 23);
});

test('quitting Zen finishes and persists the session', () => {
  assert.equal(shouldFinishOnQuit('zen'), true);
  assert.equal(shouldFinishOnQuit('timed'), false);
  assert.equal(shouldFinishOnQuit('sprint'), false);
  assert.equal(shouldFinishOnQuit('survival'), false);
});

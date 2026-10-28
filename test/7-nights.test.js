// Part 7 — addNights
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { call, show } from '../support/call.js';

const file = new URL('../src/nights.js', import.meta.url);

/* Runs addNights and returns what came back, and both boards as they are afterwards. */
async function run(a, b) {
  const shown = `addNights(${show(a)}, ${show(b)})`;
  const { value, args } = await call(file, 'addNights', [a, b],
    `${shown} needs to return the new board once the loops have finished.`);
  return { shown, value, a: args[0], b: args[1] };
}

function sharedRows(board) {
  return Array.isArray(board) && board.length > 1 && board.every(row => row === board[0]);
}

async function check(a, b, expected) {
  const { shown, value } = await run(a, b);
  if (isDeepStrictEqual(value, expected)) return;
  if (sharedRows(value)) {
    assert.fail(`${shown} should be ${show(expected)}, but every row of the board it returned is the same array, holding ${value[0].length} sums. That happens when \`const row = []\` is written once, above the outer loop: then every iteration pushes onto that one row. Make a new row at the top of the outer loop's body. See "Arrays of arrays", "Building a grid row by row".`);
  }
  const firstLength = a.length > 0 ? a[0].length : 0;
  if (Array.isArray(value) && a.some(row => row.length !== firstLength) && value.every(row => Array.isArray(row) && row.length === firstLength)) {
    assert.fail(`${shown} should be ${show(expected)}, but it returned ${show(value)}. Every row came back with ${firstLength} element${firstLength === 1 ? '' : 's'}, the length of the first row, but the rows here have different lengths: this is a jagged array. Walk each row to its own end, with a[r].length. See "Arrays of arrays", on rows of different lengths.`);
  }
  assert.fail(`${shown} should be ${show(expected)}, but it returned ${show(value)}. Each element is the sum of the elements at the same row and column of the two boards. See "Arrays of arrays".`);
}

/* A board that changed, and how. */
function changedMessage(name, shown, before, after) {
  return `${shown} changed its ${name} argument: it was ${show(before)}, and afterwards it is ${show(after)}. ` +
    'Each night\'s board is still needed after the adding, so addNights must leave both as they were. ' +
    'Writing into a board, as in `a[r][c] += ...`, changes that board. Build a new board, and return it. ' +
    'See "Finding, slicing and joining", "Does it change the array?".';
}

test('adds the two boards, element by element', async () => {
  await check([[1, 2, 3], [4, 5, 6]], [[2, 2, 2], [1, 1, 1]], [[3, 4, 5], [5, 6, 7]]);
  await check([[0, -3]], [[-1, 3]], [[-1, 0]]);
  await check([[5], [6], [7]], [[1], [1], [1]], [[6], [7], [8]]);
});

test('rows of different lengths: each row is added to its own end', async () => {
  await check([[1, 2], [3, 4, 5]], [[1, 1], [1, 1, 1]], [[2, 3], [4, 5, 6]]);
  await check([[6, 6, 6], [2]], [[-1, 0, 1], [3]], [[5, 6, 7], [5]]);
});

test('empty boards, and rows with no rounds', async () => {
  await check([], [], []);
  await check([[], []], [[], []], [[], []]);
});

test('leaves both boards as they were', async () => {
  const a = [[2, -1, 3], [0, 4, -2]];
  const b = [[1, 2, -1], [3, -2, 0]];
  const { shown, value, a: aAfter, b: bAfter } = await run(structuredClone(a), structuredClone(b));
  if (!isDeepStrictEqual(aAfter, a) && Array.isArray(value) && value !== aAfter && value.some((row, r) => row === aAfter[r])) {
    assert.fail(`${shown} changed its first argument: it was ${show(a)}, and afterwards it is ${show(aAfter)}. ` +
      'The board it returned is a new outer array, but the rows inside it are the very rows of the first board, not new ones. ' +
      'Copying the outer array, with a.slice() for example, makes a new array that holds the same rows, so writing into a row of the copy writes into night one\'s row. ' +
      'Make each row of the result a new array too. See "Arrays of arrays", "Building a grid row by row".');
  }
  if (!isDeepStrictEqual(aAfter, a)) assert.fail(changedMessage('first', shown, a, aAfter));
  if (!isDeepStrictEqual(bAfter, b)) assert.fail(changedMessage('second', shown, b, bAfter));
});

test('returns a new board, not one of the two it was given', async () => {
  const { shown, value, a, b } = await run([[1, 1], [2, 2]], [[3, 3], [4, 4]]);
  if (value === a || value === b) {
    assert.fail(`${shown} returned the very board it was given as its ${value === a ? 'first' : 'second'} argument, not a new one. Build a new board, and return it.`);
  }
  if (Array.isArray(value) && value.some((row, r) => row === a[r] || row === b[r])) {
    assert.fail(`A row of the board ${shown} returned is a row of one of the boards it was given, not a new row. Make a new row for each row of the result.`);
  }
});

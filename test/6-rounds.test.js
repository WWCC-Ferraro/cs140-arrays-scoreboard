// Part 6 — roundTotals
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { answer, show } from '../support/call.js';

const file = new URL('../src/rounds.js', import.meta.url);

/* What wrong totals most likely did, worked out from what came back. */
function whatWentWrong(board, got, expected) {
  if (!Array.isArray(got)) return 'It should return an array: one total for each round.';
  if (got.some(x => Number.isNaN(x))) return 'A total is NaN. A row too short to reach a round gives undefined there, and a number + undefined is NaN. Add a row\'s score only for a round the row reaches. See "Arrays of arrays", on rows of different lengths.';
  const rowSums = board.map(row => row.reduce((sum, x) => sum + x, 0));
  if (isDeepStrictEqual(got, rowSums)) return 'Those are the totals of each row: each player\'s points. A round is a column: the score at the same index in every row.';
  if (board.length > 0 && got.length === board[0].length && got.length < expected.length) {
    return `It has ${got.length} round${got.length === 1 ? '' : 's'}, the length of the first row, but a later row is longer. The board has as many rounds as its longest row. See "Arrays of arrays", on rows of different lengths.`;
  }
  if (got.length === board.length && board.length !== expected.length) {
    return `It has ${got.length} total${got.length === 1 ? '' : 's'}, one for each row: board.length counts the players, not the rounds. The rounds are the scores within a row, so the number of rounds is the length of the longest row. See "Arrays of arrays", "Two lengths, and replacing an element".`;
  }
  if (got.length !== expected.length) return `There should be ${expected.length} total${expected.length === 1 ? '' : 's'}, one for each round: as many as the longest row has scores. See "Arrays of arrays".`;
  return 'Each total is one round\'s scores added up: the elements at the same index in every row. See "Arrays of arrays", "One row, or one column".';
}

async function check(board, expected) {
  const got = await answer(file, 'roundTotals', [board],
    `roundTotals(${show(board)}) needs to return the array of totals once the loops have finished.`);
  if (!isDeepStrictEqual(got, expected)) {
    assert.fail(`roundTotals(${show(board)}) should be ${show(expected)}, but it returned ${show(got)}. ${whatWentWrong(board, got, expected)}`);
  }
}

test('one total for each round, added up over every row', async () => {
  await check([[1, 2, 3], [4, 5, 6]], [5, 7, 9]);
  await check([[4], [1], [2]], [7]);
  await check([[1, -2, 3]], [1, -2, 3]);
  await check([[3, -1], [-3, 1], [0, 2]], [0, 2]);
});

test('a shorter row adds nothing to the rounds it does not reach', async () => {
  await check([[2, 1, 4], [3]], [5, 1, 4]);
  await check([[1, 1, 1], [2, 2], [3, 3, 3]], [6, 6, 4]);
});

test('the rounds are counted from the longest row, wherever it is', async () => {
  await check([[3], [1, 2, 5]], [4, 2, 5]);
  await check([[], [2, 3]], [2, 3]);
});

test('a board with no rounds gives an empty array', async () => {
  await check([], []);
  await check([[], []], []);
});

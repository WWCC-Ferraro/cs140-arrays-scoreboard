// Part 2 — tally
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { answer, show } from '../support/call.js';

const file = new URL('../src/tally.js', import.meta.url);

/* What a wrong tally most likely did, worked out from what came back. */
function whatWentWrong(row, got, expected) {
  if (!Array.isArray(got) || got.length !== 4) return 'It should return an array of four numbers, in this order: [gains, losses, net, average].';
  if (row.length === 0 && Number.isNaN(got[3])) return 'With no rounds, the average is 0 / 0, which is NaN in JavaScript ("Arithmetic operators"). A player with no rounds has an average of 0.';
  const first = row[0];
  if (row.length > 1 && got[0] === (first > 0 ? 1 : 0) && got[1] === (first < 0 ? 1 : 0) && got[2] === first) {
    return `Those numbers count only the first round, ${first}. A \`return\` inside the loop ends the function on the first iteration, before the other rounds are looked at. The answer is ready only once the loop has finished. See "Walking an array".`;
  }
  const zeros = row.filter(x => x === 0).length;
  if (zeros > 0 && got[0] === expected[0] + zeros) return 'It counted each round of 0 as a gain. A gain is a score above 0: is 0 above 0? Check whether the comparison is > or >=. See "Walking an array", on counting.';
  if (zeros > 0 && got[1] === expected[1] + zeros) return 'It counted each round of 0 as a loss. A loss is a score below 0: is 0 below 0? Check whether the comparison is < or <=. See "Walking an array", on counting.';
  if (zeros > 0 && got[3] === expected[2] / (expected[0] + expected[1])) return 'The average divides by the rounds that were not 0. A round of 0 is still a round, so divide the net by the number of rounds: the length of the row. See "Lists of values", on length.';
  if (isDeepStrictEqual([got[1], got[0], got[2], got[3]], expected)) return 'Gains and losses are swapped. The order is [gains, losses, net, average], as the comment above tally says.';
  if (got[2] !== expected[2]) return 'The net is every round\'s score added up, the scores below 0 too. See "Walking an array".';
  return 'Compare the four numbers one by one. The order is [gains, losses, net, average]. See "Walking an array".';
}

async function check(row, expected) {
  const got = await answer(file, 'tally', [row],
    `tally(${show(row)}) needs to return the four numbers once the loop has finished.`);
  if (!isDeepStrictEqual(got, expected)) {
    assert.fail(`tally(${show(row)}) should be ${show(expected)}, but it returned ${show(got)}. ${whatWentWrong(row, got, expected)}`);
  }
}

test('counts the rounds above 0 and below 0, and adds up the net', async () => {
  await check([3, -2, 5], [2, 1, 6, 2]);
  await check([-1, -4], [0, 2, -5, -2.5]);
  await check([4], [1, 0, 4, 4]);
  await check([2, -2], [1, 1, 0, 0]);
});

test('a round of 0 is neither a gain nor a loss', async () => {
  await check([0, 0, 3], [1, 0, 3, 1]);
  await check([0, -6], [0, 1, -6, -3]);
});

test('the average counts every round, the rounds of 0 too', async () => {
  await check([3, -2, 0, 5], [2, 1, 6, 1.5]);
  await check([0, 8, 0, 0], [1, 0, 8, 2]);
});

test('a player with no rounds: every number is 0', async () => {
  await check([], [0, 0, 0, 0]);
});

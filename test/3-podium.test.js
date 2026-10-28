// Part 3 — topTwo
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { answer, show } from '../support/call.js';

const file = new URL('../src/podium.js', import.meta.url);

/* What a wrong podium most likely did, worked out from what came back. */
function whatWentWrong(names, totals, got, expected) {
  if (!Array.isArray(got) || got.length !== 2) return 'It should return an array of two names: [first, second].';
  if (totals.length > 0 && totals.every(t => t < 0) && got[0] === undefined) {
    return 'Every total here is below 0, and nobody came first. Does the highest so far start at 0? Then no total ever beats it. "Walking an array" shows a start that always works: a value from the array itself.';
  }
  if (got[0] !== undefined && got[0] === got[1]) return `${got[0]} is in both places. Second place is the best of the other players.`;
  if (isDeepStrictEqual([got[1], got[0]], expected)) {
    const tied = totals[names.indexOf(expected[0])] === totals[names.indexOf(expected[1])];
    if (tied) return `${expected[0]} and ${expected[1]} have the same total, and ${expected[0]} comes first in the names, so ${expected[0]} ranks higher. A new total should take a place only when it is higher, not when it is equal: check > against >=.`;
    return 'First and second are the wrong way round. See "Walking an array".';
  }
  if (got[0] === expected[0] && expected[1] !== undefined && names.indexOf(expected[1]) < names.indexOf(expected[0])) {
    return `${expected[1]} led until ${expected[0]} came along with a higher total, so ${expected[1]} is now second. When a new leader arrives, the old leader moves down to second place. See "Walking an array", on finding the highest.`;
  }
  if (got[0] === expected[0] && got[1] === undefined && expected[1] !== undefined) {
    return 'Second place was never filled. While there is no second yet, the comparison has nothing to compare against, and a comparison with undefined (such as totals[-1]) is always false. The first total that does not beat the leader becomes second, whatever it is. See "Walking an array", on finding the highest.';
  }
  if (got[0] === expected[0] && expected[1] === undefined) return 'With one player, there is no second place, so second is undefined.';
  if (got[0] === expected[0]) return 'First place is right. Second place is the highest total among everyone else: each total that does not beat the leader may still beat the second. See "Walking an array".';
  return 'Go through the totals in order, keeping track of the leader and the second so far. See "Walking an array".';
}

async function check(names, totals, expected) {
  const call = `topTwo(${show(names)}, ${show(totals)})`;
  const got = await answer(file, 'topTwo', [names, totals],
    `${call} needs to return [first, second] once the loop has finished.`);
  if (!isDeepStrictEqual(got, expected)) {
    assert.fail(`${call} should be ${show(expected)}, but it returned ${show(got)}. ${whatWentWrong(names, totals, got, expected)}`);
  }
}

test('the highest total first, the next highest second', async () => {
  await check(['Ada', 'Ben', 'Cleo'], [4, 9, 7], ['Ben', 'Cleo']);
  await check(['Ada', 'Ben', 'Cleo'], [9, 4, 7], ['Ada', 'Cleo']);
  await check(['Ada', 'Ben', 'Cleo', 'Dev'], [1, 3, 2, 8], ['Dev', 'Ben']);
});

test('when a new leader arrives, the old leader becomes second', async () => {
  await check(['Ada', 'Ben', 'Cleo'], [4, 9, 2], ['Ben', 'Ada']);
  await check(['Ada', 'Ben', 'Cleo', 'Dev'], [3, 1, 8, 2], ['Cleo', 'Ada']);
});

test('totals below 0', async () => {
  await check(['Ada', 'Ben', 'Cleo'], [-5, -2, -9], ['Ben', 'Ada']);
  await check(['Ada', 'Ben'], [-1, 3], ['Ben', 'Ada']);
});

test('in a tie, the player who comes first in the names ranks higher', async () => {
  await check(['Ada', 'Ben'], [5, 5], ['Ada', 'Ben']);
  await check(['Ada', 'Ben', 'Cleo'], [3, 7, 7], ['Ben', 'Cleo']);
  await check(['Ada', 'Ben', 'Cleo'], [9, 4, 4], ['Ada', 'Ben']);
});

test('one player has no second place; no players have neither', async () => {
  await check(['Ada'], [-3], ['Ada', undefined]);
  await check([], [], [undefined, undefined]);
});

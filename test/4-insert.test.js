// Part 4 — insertAt
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { call, show } from '../support/call.js';
import { offLimitsIn } from '../support/off-limits.js';

const file = new URL('../src/turns.js', import.meta.url);

const GROWS_FOREVER = 'Each write one index past the end makes the array one longer, so a condition that ' +
  'reads list.length again on every check never catches up. See "Mutating while traversing", ' +
  '"Adding moves the end".';

/* What a wrong insert most likely did, worked out from the array afterwards. */
function whatWentWrong(before, after, expected) {
  if (isDeepStrictEqual(after, before)) return 'The array given is unchanged. insertAt changes the array it is given, in place, as splice does: the scoreboard keeps using that same array.';
  if (after.length === before.length) return 'The array is no longer, so an element was replaced, not inserted. Every element from `index` on moves up one index first, to make room. If your loop starts at list.length - 1, that is an off-by-one: the first element to move goes to index list.length, the new end. See "Adding and removing elements", on writing past the end.';
  if (after.length === expected.length) {
    const lost = before.filter(x => !after.some(y => isDeepStrictEqual(x, y)));
    if (lost.length > 0) {
      const repeated = after.find((x, i) => after.findIndex(y => isDeepStrictEqual(x, y)) !== i);
      return `${lost.map(show).join(' and ')} ${lost.length === 1 ? 'is' : 'are'} missing${repeated === undefined ? '' : `, and ${show(repeated)} appears more than once`}. Moving forward, from \`index\` up, each element is copied over the next one before that one has moved, so the next one is lost. Which direction leaves the elements still to be moved where they were? See "Mutating while traversing", "Walking backwards".`;
    }
  }
  if (after.includes(undefined)) return 'There is an undefined, or an empty slot, in the array. Check the first index the loop writes to: the new end is index list.length, not one past it. See "Adding and removing elements".';
  return 'Compare the two element by element. The new item goes at `index`, and nothing is lost.';
}

async function check(list, item, index, expected) {
  const shown = `insertAt(${show(list)}, ${show(item)}, ${index})`;
  const before = structuredClone(list);
  const { value, args } = await call(file, 'insertAt', [list, item, index],
    `${shown} needs to return the new length, as push does.`, GROWS_FOREVER);
  const after = args[0];
  if (!isDeepStrictEqual(after, expected)) {
    assert.fail(`After ${shown}, the array should be ${show(expected)}, but it is ${show(after)}. ${whatWentWrong(before, after, expected)}`);
  }
  if (value !== expected.length) {
    const why = Array.isArray(value) ? 'It returned an array. ' : value === before.length ? 'That is the length before the insert. ' : '';
    assert.fail(`${shown} should return ${expected.length}, the new length, as push does, but it returned ${show(value)}. ${why}`);
  }
}

test('inserts in the middle, and the elements after it move up', async () => {
  await check(['Ada', 'Ben', 'Dev'], 'Cleo', 2, ['Ada', 'Ben', 'Cleo', 'Dev']);
  await check([1, 2, 4, 5, 6], 3, 2, [1, 2, 3, 4, 5, 6]);
});

test('inserts at the front: every element moves up', async () => {
  await check([10, 20, 30, 40], 5, 0, [5, 10, 20, 30, 40]);
});

test('at index list.length, the item goes on the end', async () => {
  await check(['a', 'b'], 'c', 2, ['a', 'b', 'c']);
  await check([], 'x', 0, ['x']);
});

test('works on an array of rows, too', async () => {
  await check([[1, 2], [3, 4], [5, 6]], [9, 9], 1, [[1, 2], [9, 9], [3, 4], [5, 6]]);
});

test('uses none of splice, unshift, shift, slice or concat', () => {
  const used = offLimitsIn(file, 'insertAt');
  if (used.length > 0) {
    assert.fail(`insertAt uses ${used.join(' and ')}. This part rebuilds what splice does, so the methods that would do the moving for you are off limits here; the comment at the top of src/turns.js says which and why. push and pop are allowed.`);
  }
});

// Part 5 — removeAt
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { call, show } from '../support/call.js';
import { offLimitsIn } from '../support/off-limits.js';

const file = new URL('../src/turns.js', import.meta.url);

/* What a wrong remove most likely did, worked out from the array afterwards. */
function whatWentWrong(before, after, expected) {
  if (isDeepStrictEqual(after, before) && before.length > 0 && isDeepStrictEqual(before.slice(0, -1), expected)) return 'The array is unchanged. Removing the last element moves nothing, but the array still has to get one shorter.';
  if (isDeepStrictEqual(after, before)) return 'The array given is unchanged. removeAt changes the array it is given, in place, as splice does: the scoreboard keeps using that same array.';
  if (after.length === before.length && isDeepStrictEqual(after.slice(0, -1), expected)) {
    if (after[after.length - 1] === undefined) return 'The elements moved down, but the last element is now undefined and the array is no shorter. The loop went one step too far: on its last iteration it copied list[list.length], past the end. Then the array needs to get one shorter. See "Adding and removing elements".';
    return 'The elements moved down, but the array is no shorter, so its last element appears twice. After the move, take the last element off the end.';
  }
  if (isDeepStrictEqual(after, before.slice(0, -1)) && before.length > 1) return 'The last element is gone, not the one at `index`. Move each element after `index` down one first; then the one to drop is at the end.';
  return 'Compare the two element by element. Only the element at `index` is gone, and everything after it moved down one.';
}

async function check(list, index, expectedList, expectedValue) {
  const shown = `removeAt(${show(list)}, ${index})`;
  const before = structuredClone(list);
  const { value, args } = await call(file, 'removeAt', [list, index],
    `${shown} needs to return the element it removed, as pop does.`);
  const after = args[0];
  if (!isDeepStrictEqual(after, expectedList)) {
    assert.fail(`After ${shown}, the array should be ${show(expectedList)}, but it is ${show(after)}. ${whatWentWrong(before, after, expectedList)}`);
  }
  if (!isDeepStrictEqual(value, expectedValue)) {
    let why = '';
    if (isDeepStrictEqual(value, [expectedValue])) why = 'That is an array holding the element. splice returns an array; removeAt returns the element itself, as pop does. See "Adding and removing elements".';
    else if (isDeepStrictEqual(value, before[index + 1])) why = `That is the element that moved down into index ${index}. Read the element to remove before anything moves over it. See "Mutating while traversing", "Removing shifts what comes after".`;
    else if (isDeepStrictEqual(value, before[before.length - 1])) why = 'That is the last element, which pop took off the end. After the move, the end holds a copy of the last element, not the one removed, so what pop returns is not the answer. Read the element to remove before anything moves over it. See "Adding and removing elements", on what pop returns.';
    assert.fail(`${shown} should return ${show(expectedValue)}, the element removed, but it returned ${show(value)}. ${why}`);
  }
}

test('removes from the middle, and the elements after it move down', async () => {
  await check(['Ada', 'Ben', 'Cleo', 'Dev'], 1, ['Ada', 'Cleo', 'Dev'], 'Ben');
  await check([7, 8, 9, 10, 11], 2, [7, 8, 10, 11], 9);
});

test('removes the first element: every other element moves down', async () => {
  await check([1, 2, 3, 4], 0, [2, 3, 4], 1);
});

test('removes the last element', async () => {
  await check([1, 2, 3], 2, [1, 2], 3);
  await check(['x'], 0, [], 'x');
});

test('works on an array of rows, too', async () => {
  await check([[1], [2, 2], [3]], 1, [[1], [3]], [2, 2]);
});

test('uses none of splice, unshift, shift, slice or concat', () => {
  const used = offLimitsIn(file, 'removeAt');
  if (used.length > 0) {
    assert.fail(`removeAt uses ${used.join(' and ')}. This part rebuilds what splice does, so the methods that would do the moving for you are off limits here; the comment at the top of src/turns.js says which and why. push and pop are allowed.`);
  }
});

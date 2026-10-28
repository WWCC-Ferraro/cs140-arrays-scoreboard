// Part 1 — parsePoints
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { answer, show, LEGEND } from '../support/call.js';

const file = new URL('../src/points.js', import.meta.url);

/* What a wrong row most likely did, worked out from what came back. */
function whatWentWrong(line, got, expected) {
  if (!Array.isArray(got)) return 'It should return an array: one number for each score in the line.';
  const text = got.find(x => typeof x === 'string');
  if (text !== undefined) return `${show(text)} is text, not a number. split returns pieces of text, and Number(...) turns a piece into a number. See "Conversion — when a value does not fit".`;
  const characters = line.replaceAll(' ', '').length;
  if (got.length === 1 && expected.length > 1) return 'The whole line came back as one element. With no argument, split does not cut the string at all: "a b".split() is ["a b"]. Python\'s split() cuts at the spaces; JavaScript\'s needs the separator, " ". See "Finding, slicing and joining".';
  const zeros = (xs) => xs.filter(x => x === 0).length;
  const withoutZeros = (xs) => xs.filter(x => x !== 0);
  if (got.length > expected.length && zeros(got) > zeros(expected) && isDeepStrictEqual(withoutZeros(got), withoutZeros(expected))) {
    return 'There are more 0s than the line has scores of 0. Where two spaces are next to each other, or a space is at the start or end, split(" ") leaves an empty piece, "", between them, and Number("") is 0. Leave the empty pieces out. See "Finding, slicing and joining" and "Conversion — when a value does not fit".';
  }
  if (got.length === characters && characters > expected.length) return 'There is one element for every character, so a score like 10 became 1 and 0, and a minus sign became NaN: Number("-") is NaN. split("") cuts between every pair of characters. Cut at the spaces instead. See "Finding, slicing and joining".';
  if (got.length < expected.length && zeros(expected) > 0 && isDeepStrictEqual(got, withoutZeros(expected))) {
    return 'The 0s are missing. A 0 in the line is a real score: a round that scored nothing. Only the empty pieces, "", are not scores, and once converted an empty piece and a real 0 are both 0. So decide whether a piece is a score while it is still text, before converting it. See "Finding, slicing and joining".';
  }
  if (got.length < expected.length) return `It has ${got.length} element${got.length === 1 ? '' : 's'}, and the line has ${expected.length} scores. Does the loop reach every piece?`;
  return 'Cut the line at the spaces, and keep each piece that is a score, as a number, in order.';
}

async function check(line, expected) {
  const got = await answer(file, 'parsePoints', [line],
    `parsePoints(${show(line)}) needs to return the array once the loop has finished.`);
  if (!isDeepStrictEqual(got, expected)) {
    assert.fail(`parsePoints(${show(line)}) should be ${show(expected)}, but it returned ${show(got)}. ${whatWentWrong(line, got, expected)} ${LEGEND}`);
  }
}

test('one space between scores: each score becomes a number', async () => {
  await check('3 -2 5', [3, -2, 5]);
  await check('7', [7]);
  await check('10 -10 0 25', [10, -10, 0, 25]);
});

test('extra spaces, between scores or at the ends, are not scores', async () => {
  await check(' 4  0 -1 ', [4, 0, -1]);
  await check('6  2', [6, 2]);
  await check('   12   -3', [12, -3]);
});

test('a line with no scores gives an empty array', async () => {
  await check('', []);
  await check('   ', []);
});

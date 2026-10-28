// The game-night scoreboard. You do not need to change anything in this file.
//
// It prints the scoreboard for one night of games, and a two-night
// tournament, and every part of it is worked out by the functions you are
// writing. Run it whenever you like:
//
//   npm start
//
// Before you finish a function, its part of the scoreboard shows
// `undefined`, which is what a function returns when it has no `return` yet.
// Some parts need an earlier part's answer: the names beside the scores come
// from the turn order Part 4 builds, and the tallies are worked out from the
// scores Part 1 reads. Those say which part they are waiting for. Finish a
// function, run the scoreboard again, and its part comes right.
//
// The `import` lines bring in the functions you write in the other files.

import { parsePoints } from './points.js';
import { tally } from './tally.js';
import { topTwo } from './podium.js';
import { insertAt, removeAt } from './turns.js';
import { roundTotals } from './rounds.js';
import { addNights } from './nights.js';

// Array.isArray(x) is true when x is an array. The scoreboard uses it to
// tell whether a function has returned an array yet.

// An array of scores as text, one space between them: [3, -2] is "3 -2".
function scoresText(row) {
  if (!Array.isArray(row)) {
    return String(row);
  }
  return row.join(' ');
}

// A number rounded to two decimal places, for the averages.
function rounded(n) {
  return Math.round(n * 100) / 100;
}

// ─── The turn order ─────────────────────────────────────────────────────────
// Four players sit down. Before round 1, Eli arrives and sits between Ben and
// Cleo.

const turns = ['Ada', 'Ben', 'Cleo', 'Dev'];
console.log('=== Game night at the Corner Table ===');
console.log('');
console.log(`Four players sit down: ${turns.join(', ')}`);
console.log('Before round 1, Eli arrives and sits at index 2 (Part 4):');

const seated = insertAt(turns, 'Eli', 2);
if (seated === undefined) {
  console.log('  insertAt returned undefined: Part 4 is not finished yet.');
}
console.log(`  The turn order: ${turns.join(', ')}`);
console.log(`  Players at the table: ${seated}`);

// ─── Tonight's scores ──────────────────────────────────────────────────────
// What the scorekeeper typed: one line for each seat, in the turn order from
// round 1. So the names for the lines come from `turns`, as Part 4 left it.
// `players` is a copy, made with slice() ("Finding, slicing and joining"),
// because Part 5 changes `turns` later and these names must not change.

const players = turns.slice();
const lines = [
  '3 -2 5 1 -3',
  ' 4  4 -1 ',
  '0 6  -2 3 2',
  '-2 -3 1 -4 -1',
  '2 0 0 5 -1',
];

const board = [];
for (const line of lines) {
  board.push(parsePoints(line));
}

console.log('');
console.log('Tonight\'s scores, a row for each player (Part 1):');
for (let i = 0; i < lines.length; i++) {
  console.log(`  ${players[i]}: ${scoresText(board[i])}`);
}
if (players.length !== lines.length) {
  console.log(`  (The names come from the turn order that Part 4 builds. There are ${lines.length} lines ` +
    `of scores and ${players.length} names, so they do not line up yet.)`);
}

// ─── A player leaves ───────────────────────────────────────────────────────
// After round 3, Ben has to leave, so Ben's line has only three scores.

console.log('');
console.log('After round 3, Ben has to leave (Part 5):');
const left = removeAt(turns, turns.indexOf('Ben'));
if (left === undefined) {
  console.log('  removeAt returned undefined: Part 5 is not finished yet.');
} else {
  const leftRow = board[players.indexOf(left)];
  console.log(`  ${left} left, with these scores: ${scoresText(leftRow)}`);
}
console.log(`  The turn order from round 4: ${turns.join(', ')}`);

// ─── Tallies ────────────────────────────────────────────────────────────────

let boardRead = true;
for (const row of board) {
  if (!Array.isArray(row)) {
    boardRead = false;
  }
}

const nets = [];
console.log('');
console.log('Each player\'s tally (Part 2):');
if (!boardRead) {
  console.log('  waiting for Part 1: the tallies are worked out from the scores it reads');
} else {
  for (let i = 0; i < lines.length; i++) {
    const t = tally(board[i]);
    if (!Array.isArray(t)) {
      console.log(`  ${players[i]}: ${t}`);
    } else {
      console.log(`  ${players[i]}: gains ${t[0]}, losses ${t[1]}, net ${t[2]}, average ${rounded(t[3])}`);
    }
    nets.push(Array.isArray(t) ? t[2] : t);
  }
}

// ─── The podium ─────────────────────────────────────────────────────────────

console.log('');
console.log('Tonight\'s podium (Part 3):');
if (nets.length < lines.length || nets.includes(undefined)) {
  console.log('  waiting for Parts 1 and 2: the podium ranks the net scores they work out');
} else {
  const podium = topTwo(players, nets);
  if (!Array.isArray(podium)) {
    console.log(`  ${podium}`);
  } else {
    const firstNet = nets[players.indexOf(podium[0])];
    const secondNet = nets[players.indexOf(podium[1])];
    console.log(`  1st: ${podium[0]}, with ${firstNet}`);
    console.log(`  2nd: ${podium[1]}, with ${secondNet}`);
  }
}

// ─── Round by round ────────────────────────────────────────────────────────

console.log('');
console.log('Points scored at the table, round by round (Part 6):');
if (!boardRead) {
  console.log('  waiting for Part 1: the rounds are added up from the scores it reads');
} else {
  const perRound = roundTotals(board);
  if (!Array.isArray(perRound)) {
    console.log(`  ${perRound}`);
  } else {
    for (let r = 0; r < perRound.length; r++) {
      console.log(`  Round ${r + 1}: ${perRound[r]}`);
    }
  }
}

// ─── The October tournament ────────────────────────────────────────────────
// Two nights, the same four players, three rounds each night. These boards
// were recorded as numbers, so they do not need Part 1.

const entrants = ['Ada', 'Ben', 'Cleo', 'Dev'];
const nightOne = [
  [2, -1, 3],
  [0, 4, -2],
  [1, 1, 1],
  [-3, 2, 5],
];
const nightTwo = [
  [1, 2, -1],
  [3, -2, 0],
  [2, 0, 2],
  [1, 1, -4],
];
const nightOneBefore = nightOne.join(' | ');

const tournament = addNights(nightOne, nightTwo);

console.log('');
console.log('The October tournament, both nights added together (Part 7):');
if (!Array.isArray(tournament)) {
  console.log(`  ${tournament}`);
} else {
  for (let i = 0; i < entrants.length; i++) {
    console.log(`  ${entrants[i]}: ${scoresText(tournament[i])}`);
  }
  if (nightOne.join(' | ') === nightOneBefore) {
    console.log('  Night one\'s board is as it was recorded.');
  } else {
    console.log(`  Night one's board has changed! It was ${nightOneBefore}, and now it is ${nightOne.join(' | ')}.`);
  }

  const tournamentNets = [];
  for (const row of tournament) {
    const t = Array.isArray(row) ? tally(row) : undefined;
    tournamentNets.push(Array.isArray(t) ? t[2] : undefined);
  }
  if (tournamentNets.includes(undefined)) {
    console.log('  The champion: waiting for Part 2, which works out the net scores');
  } else {
    const winners = topTwo(entrants, tournamentNets);
    if (!Array.isArray(winners)) {
      console.log(`  The champion: ${winners}`);
    } else {
      console.log(`  The champion: ${winners[0]}. Runner-up: ${winners[1]}.`);
    }
  }
}

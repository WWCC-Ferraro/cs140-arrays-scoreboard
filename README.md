# Arrays at game night: reading, walking, changing and nesting

Seven small functions, each built around an array. `parsePoints` turns a
line of text into an array of numbers. `tally` and `topTwo` walk an array and
work out a result from it. `insertAt` and `removeAt` change an array in
place, doing by hand what `splice` does. `roundTotals` and
`addNights` work on an array of arrays: a grid of scores, with one row for
each player.

The program in `src/game-night.js` uses all seven to keep score at a game
night: the turn order as players arrive and leave, each player's scores and
tally, the podium, the points scored in each round, and a two-night
tournament. You write the functions; the scoreboard program is already
written. Each function you finish fixes one part of the scoreboard, and
several parts build on earlier ones: the tallies are worked out from the
scores that Part 1 reads.

## What each part leans on

| Part | Lessons |
|---|---|
| 1 `parsePoints` | Finding, slicing and joining; Adding and removing elements; Conversion — when a value does not fit |
| 2 `tally` | Walking an array; Lists of values |
| 3 `topTwo` | Walking an array; Lists of values |
| 4 `insertAt` | Adding and removing elements; Mutating while traversing |
| 5 `removeAt` | Adding and removing elements; Mutating while traversing |
| 6 `roundTotals` | Arrays of arrays |
| 7 `addNights` | Arrays of arrays; Finding, slicing and joining |

Every part also leans on *Writing a function's answer*, and on the loops from
the Loops module.

## Getting started

1. Open **your repository**. It is made for you: private, and named for this
   homework, the term and your username — `<term>-cs140-arrays-scoreboard-<you>`.
   On [this homework's page](https://wwcc.dev/#/lesson/arrays-scoreboard),
   type your GitHub username and click **Open my Codespace**. On your own
   computer, clone it with GitHub Desktop (**Code**, then **Open with GitHub
   Desktop**) and check that `node --version` prints 22 or later. The lesson
   *How a homework works* walks through both.
2. Run the scoreboard:

   ```sh
   npm start
   ```

   The scoreboard is mostly `undefined`, and the parts that need an earlier
   part say which one they are waiting for. A function returns `undefined`
   when it has no `return`, and none of your seven functions has a `return`
   yet. That is the expected starting point.
3. Run the tests:

   ```sh
   npm test
   ```

   All but two of the tests fail at first. That is the starting point too,
   not a problem. The two that pass check that Parts 4 and 5 do not use
   certain methods, and they keep passing unless you use one.

While you work on one part, run just its tests:

```sh
node --test test/4-insert.test.js
```

The same tests run on GitHub every time you push. The **Actions** tab shows
the result.

## How to write each answer

Each function is already written except for the code between its braces.
Write your code there, where it says `// TODO: put your code here`. Leave
`export` in front of each function: `export` is what lets the tests and the
scoreboard use the function.

Before you write a part, ask the question from *Finding, slicing and
joining*: does this function change the array it is given, or return a new
value? A function that changes it is **mutating**, and one that leaves it as
it was is **non-mutating**. The comment above each function says which.

- `parsePoints`, `tally`, `topTwo`, `roundTotals` and `addNights` are
  non-mutating: they leave the arrays they are given as they were, and return
  a new value. When that value is an array, one way to build it is with
  `push`, starting from an empty array.
- `insertAt` and `removeAt` are mutating: they change the array they are
  given, in place. They still end with a `return`: `insertAt` returns the new length, as `push`
  does, and `removeAt` returns the element it removed, as `pop` does.

Whichever it is, **every path through the function has to reach a `return`**.
A path with no `return` returns `undefined`, and a failing test's message
names the input that took that path.

Stuck? Put `console.log(something)` inside a loop, and it prints the value of
`something` on every iteration, which shows you what the loop is doing. The
tests do not look at what you print, so print as much as you like.

## The parts

The comment above each function, in its own file, says what the function
receives and what it returns, with examples. When a test fails, its message
says what came back and what to look at. When a message shows text, each
space appears as `·`, so that an extra space is easy to see.

If a loop never stops, the tests stop it after one second and say so in the
message. The scoreboard program has no such limit. If `npm start` seems to
hang, a loop is probably running forever: press **Ctrl+C** to stop the
program.

### Part 1 · From a line of text to a row of scores — `src/points.js`

The scorekeeper types each player's scores into one line, one score for each
round, with spaces between them: `"3 -2 5"` is three rounds, scoring 3, -2
and 5. `parsePoints` returns those scores as an array of numbers:
`[3, -2, 5]`.

The scorekeeper types fast, so a line can start or end with a space, and
there can be more than one space between two scores. `" 4  0 -1 "` is still
three scores, `[4, 0, -1]`. The spaces only separate the scores.

`split(" ")` cuts a string at each space and returns the pieces, as text.
`Number(...)` turns a piece of text into a number. Where two spaces are next
to each other, though, `split(" ")` returns an empty string, `""`, between
them, and a space at either end of the line leaves an empty string at that
end. `Number("")` is `0`, not `NaN`, so once converted, an empty piece looks
just like a real score of 0. Try `" 4  0".split(" ")` in Node to see the
pieces, and decide which of them are scores while they are still text.

### Part 2 · One player's tally — `src/tally.js`

`tally` takes one player's row of round scores and returns four numbers in
an array: `[gains, losses, net, average]`.

- `gains` is how many rounds scored above 0, and `losses` how many scored
  below 0. A round that scored 0 is neither.
- `net` is every round's score added up.
- `average` is the net divided by the number of rounds. A round of 0 still
  counts as a round here.

`tally([3, -2, 0, 5])` is `[2, 1, 6, 1.5]`: two gains, one loss, a net of 6,
and 6 divided by 4 rounds.

A player who played no rounds has an empty row, `[]`, and gets
`[0, 0, 0, 0]`. An average of no rounds has no value: in JavaScript,
`0 / 0` is `NaN`. The scoreboard prints 0 for it, so `tally` returns 0.

Which position holds which number is something every caller of `tally` has
to remember: position 2 is the net. The Objects module, next, gives each
value a name instead.

### Part 3 · First and second place — `src/podium.js`

`topTwo(names, totals)` returns the names of the players with the highest and
the second highest totals, as `[first, second]`. The two arrays are parallel:
`totals[i]` is the total of the player `names[i]`.

- Totals can be below 0, because a round can lose points.
- In a tie, the player who comes first in `names` ranks higher.
- With one player, there is no second place, so `second` is `undefined`. With
  no players, both are.

`topTwo(["Ada", "Ben", "Cleo"], [4, 9, 7])` is `["Ben", "Cleo"]`.

The loop keeps track of two players as it goes: the leader so far, and the
second so far. Think about what happens to the leader when a higher total
comes along.

### Parts 4 and 5 · Changing the turn order — `src/turns.js`

The players take turns in the order of an array of names. A late arrival
joins the turn order in the middle, and a player who has to leave is taken
out. Both functions change the array they are given, in place, the way
`splice` does, because the scoreboard keeps using that same array all night.

**`splice`, `unshift`, `shift`, `slice` and `concat` are off limits in these
two functions.** These two parts rebuild what `splice` does, and each of
those five methods would do the moving for you: `unshift` moves every element
up to make room at the front, `shift` moves every element down, and `slice`
and `concat` build a new array with the elements already where they go.
`push` and `pop` are allowed: they make the array one longer or one shorter
at the end, and move nothing. A test reads `src/turns.js` and names any of
the five that `insertAt` or `removeAt` uses.

**Part 4.** `insertAt(list, item, index)` puts `item` into `list` at `index`.
Nothing is replaced: every element from `index` on moves up one index, and
the array gets one longer. Here is `insertAt(order, "Cleo", 2)`, where
`order` is `["Ada", "Ben", "Dev"]`:

| | index 0 | index 1 | index 2 | index 3 |
|---|---|---|---|---|
| Before | Ada | Ben | Dev | |
| `"Dev"` copied up from index 2 to index 3 | Ada | Ben | Dev | Dev |
| `"Cleo"` written at index 2 | Ada | Ben | Cleo | Dev |

With one element to move, the order of the moves does not matter. With two
or more, it does. Try `[1, 2, 4, 5]` with `3` at index 2 on paper, moving
from index 2 forwards: what happens to the `5`? *Mutating while traversing*
is about the same kind of choice.

`index` is from 0 up to `list.length`. At `list.length`, the item goes on the
end. `insertAt` returns the new length, as `push` does.

**Part 5.** `removeAt(list, index)` takes the element at `index` out of
`list`. No gap is left: every element after it moves down one index, and the
array gets one shorter. It returns the element it removed, as `pop` does:
the element itself, not an array holding it (which is what `splice`
returns).

`index` is always an index that holds an element, from 0 up to
`list.length - 1`.

Both functions work on an array of anything. The scoreboard uses them on
names, and the tests use numbers and whole rows of scores too.

### Part 6 · Round by round — `src/rounds.js`

A board is an array of arrays: one row for each player, and in each row, one
score for each round. Column 0 is round 1. `roundTotals(board)` returns one
total for each round: every player's score for that round, added up.

`roundTotals([[1, 2, 3], [4, 5, 6]])` is `[5, 7, 9]`.

A player who leaves early has a shorter row, so the rows can have different
lengths: the board is a **jagged array**, in the words of *Arrays of
arrays*. The board has as many rounds as its longest row, and a row too
short to reach a round adds nothing to it. `roundTotals([[2, 1, 4], [3]])`
is `[5, 1, 4]`. An empty board, `[]`, has no rounds, so the result is `[]`.

### Part 7 · Two nights, one tournament — `src/nights.js`

A tournament is played over two nights by the same players, in the same
order, with the same number of rounds each night. `addNights(a, b)` returns
a new board where each element is the sum of the elements at the same row
and column of `a` and `b`:

```js
addNights([[1, 2, 3], [4, 5, 6]], [[2, 2, 2], [1, 1, 1]])
// [[3, 4, 5], [5, 6, 7]]
```

The two boards always have the same shape: the same number of rows, and the
row at each index the same length in both. The rows of one board can still
have different lengths, as in a jagged array. Both boards can be empty, and
then so is the result.

Each night's board is still needed afterwards, to show what happened that
night. So `addNights` leaves both boards as they were, and builds a new board
to return. The scoreboard checks that night one's board is unchanged, and
says so if it is not.

## Done means

- `npm test` passes every test.
- `npm start` prints a scoreboard with no `undefined` in it, and nothing
  waiting for an earlier part.

## Using an AI assistant

`AGENTS.md` in this repository tells AI coding assistants how this course wants
them to help: as a tutor who explains errors, asks questions and gives hints,
not by writing your answers. Most assistants read it automatically. It is in
the open, so read it too. It says what good AI help looks like.

In VS Code, in a Codespace or on your own computer, AI code suggestions are
switched off for this homework (`.vscode/settings.json`), so the code you hand
in is your own. Chat is on, and it follows `AGENTS.md`: ask it about an error,
a failing test or an idea.

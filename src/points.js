// Part 1 · From a line of text to a row of scores
//
// The scorekeeper types each player's scores into one line, one score for
// each round, with spaces between them. The scoreboard needs numbers, so
// this function turns the line into an array of them.
//
// Write your code between the braces, where it says TODO, and end with
// `return`. `export` lets the tests and the scoreboard use the function.
// Leave it in place.

/**
 * Return the scores in `line` as an array of numbers, in the order typed.
 *
 * Each score is a whole number, and a score below 0 is written with a minus
 * sign: "-2". The scorekeeper types fast, so the line may start or end with
 * spaces, and there may be more than one space between two scores. Spaces
 * only separate the scores; they are never a score. A line with no scores,
 * "" or only spaces, gives an empty array.
 *
 *   parsePoints("3 -2 5")        -> [3, -2, 5]
 *   parsePoints(" 4  0 -1 ")     -> [4, 0, -1]   (the extra spaces are not scores)
 *   parsePoints("")              -> []
 */
export function parsePoints(line) {
  // TODO: put your code here
}

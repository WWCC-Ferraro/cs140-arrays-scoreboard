// Part 7 · Two nights, one tournament
//
// A tournament is played over two nights, by the same players in the same
// order, with the same number of rounds each night. Its board adds the two
// nights together: each player's round 1 scores from both nights, their
// round 2 scores, and so on.
//
// Each night's board is still needed after the adding, to show what
// happened that night, so neither may change.

/**
 * Return a new board, the same shape as `a` and `b`, where each element is
 * the sum of the elements at the same row and column of `a` and `b`. Leave
 * `a` and `b` as they were.
 *
 * `a` and `b` always have the same shape: the same number of rows, and the
 * same length for rows at the same index. Either can be empty, [], and then
 * so is the result.
 *
 *   addNights([[1, 2, 3], [4, 5, 6]], [[2, 2, 2], [1, 1, 1]])
 *     -> [[3, 4, 5], [5, 6, 7]]
 *   addNights([], [])   -> []
 */
export function addNights(a, b) {
  // TODO: put your code here
}

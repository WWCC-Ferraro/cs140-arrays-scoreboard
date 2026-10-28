// Part 6 · Round by round
//
// The board is an array of arrays: one row for each player, and in each
// row, one score for each round. Row 0 is the first player's, and column 0
// is round 1. The scoreboard shows how many points the table scored in each
// round, added up over every player: one total for each column.
//
// A player who leaves early has a shorter row, so the rows of a board can
// have different lengths.

/**
 * Return an array with one total for each round: element 0 is every
 * player's round 1 score added up, element 1 every round 2 score, and so on.
 *
 * The board has as many rounds as its longest row. A row that is too short
 * to reach a round has no score for it, and adds nothing to that round's
 * total. An empty board, or one whose rows are all empty, has no rounds:
 * the result is [].
 *
 *   roundTotals([[1, 2, 3], [4, 5, 6]])   -> [5, 7, 9]
 *   roundTotals([[2, 1, 4], [3]])         -> [5, 1, 4]   (the second player left after round 1)
 *   roundTotals([])                       -> []
 */
export function roundTotals(board) {
  // TODO: put your code here
}

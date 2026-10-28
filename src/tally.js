// Part 2 · One player's tally
//
// After the night's rounds, the scoreboard shows each player's tally: how
// many rounds won them points, how many lost them points, the net score,
// and the average score for a round.
//
// The four numbers come back in one array, each in its own position. Which
// position holds which number is something every caller has to remember;
// the Objects module, next, gives each value a name instead.

/**
 * Return `[gains, losses, net, average]` for one player's `row` of round
 * scores:
 *
 *   gains    how many rounds scored above 0
 *   losses   how many rounds scored below 0
 *   net      all the round scores added up
 *   average  the net divided by the number of rounds
 *
 * A round that scored 0 is neither a gain nor a loss, but it is still a
 * round: it counts in the net and in the average.
 *
 * A player who played no rounds has an empty `row`. Then every number is 0,
 * the average too: an average of no rounds has no value, and 0 / 0 in
 * JavaScript is NaN, so the scoreboard shows 0 for it.
 *
 *   tally([3, -2, 0, 5])   -> [2, 1, 6, 1.5]   (6 points over 4 rounds)
 *   tally([-1, -4])        -> [0, 2, -5, -2.5]
 *   tally([])              -> [0, 0, 0, 0]
 */
export function tally(row) {
  // TODO: put your code here
}

// Part 3 · First and second place
//
// The scoreboard ends the night with a podium: the player with the highest
// total, and the player with the next highest.
//
// `names` and `totals` are parallel arrays: the total at each index belongs
// to the player whose name is at the same index.

/**
 * Return `[first, second]`: the names of the players with the highest and
 * the second highest totals.
 *
 * Totals can be below 0, because a round can lose points. When two players
 * have the same total, the one who comes first in `names` ranks higher.
 * With only one player, there is no second place, so `second` is undefined;
 * with no players at all, both are.
 *
 *   topTwo(["Ada", "Ben", "Cleo"], [4, 9, 7])   -> ["Ben", "Cleo"]
 *   topTwo(["Ada", "Ben"], [5, 5])              -> ["Ada", "Ben"]   (a tie)
 *   topTwo(["Ada"], [-3])                       -> ["Ada", undefined]
 */
export function topTwo(names, totals) {
  // TODO: put your code here
}

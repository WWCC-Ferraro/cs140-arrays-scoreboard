// Parts 4 and 5 · Changing the turn order
//
// The players take turns in the order of an array of names. A late arrival
// joins it at a seat in the middle, and a player who has to leave is taken
// out. Both functions change the array they are given, in place, the way
// `splice` does: the scoreboard keeps the same turn order array all night.
//
// `splice`, `unshift`, `shift`, `slice` and `concat` are off limits in this
// file, because each of them would do the moving for you, and the moving is
// what these two parts practise. `unshift` moves every element up to make
// room at the front, `shift` moves every element down, and `slice` and
// `concat` build a new array with the elements already where they go.
// `push` and `pop` are allowed: they make the array one longer or one
// shorter at the end, and move nothing. A test reads this file and names any
// of the five it finds.
//
// Both functions work on an array of anything: names, numbers, or whole rows
// of a scoreboard.

/**
 * Part 4. Insert `item` into `list` at `index`, in place. Nothing is
 * replaced: the elements from `index` on each move up one index to make
 * room, and the array gets one longer. Return the new length, as `push`
 * does.
 *
 * `index` is from 0 up to `list.length`. At `list.length`, the item goes on
 * the end.
 *
 *   const order = ["Ada", "Ben", "Dev"];
 *   insertAt(order, "Cleo", 2)   -> 4
 *   order                        -> ["Ada", "Ben", "Cleo", "Dev"]
 */
export function insertAt(list, item, index) {
  // TODO: put your code here
}

/**
 * Part 5. Remove the element at `index` from `list`, in place. No gap is
 * left: the elements after it each move down one index, and the array gets
 * one shorter. Return the element removed, as `pop` does.
 *
 * `index` is from 0 up to `list.length - 1`: there is always an element
 * there to remove.
 *
 *   const order = ["Ada", "Ben", "Cleo", "Dev"];
 *   removeAt(order, 1)   -> "Ben"
 *   order                -> ["Ada", "Cleo", "Dev"]
 */
export function removeAt(list, index) {
  // TODO: put your code here
}

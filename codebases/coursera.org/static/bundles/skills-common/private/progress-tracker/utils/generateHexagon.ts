export type HexagonDef = {
  width: number;
  height: number;
  path: string;
};

/**
 * A function that generates a hexagon path and some metadata
 *
 * A simple explanation of the math:
 *
 *            1
 *           / \
 *          /   \
 *         6     2
 *         |     |
 *         |  X  |
 *         |     |
 *         5     3
 *          \   /
 *           \ /
 *            4
 *
 *
 *  barHeight = distance from 2 to 3
 *  D = distance from 1 to 4
 *  a = 1/4 d, or half the distance from 6 to 2
 *  b = distance from 6 to 5.
 *
 *  To derive the formulae below, you can think of the
 *  hexagon as a series of internal triangles connecting
 *  in the center.
 *
 *  imagine a point in the center, X, and the triangles are:
 *
 *      1,x,2
 *      2,x,3
 *      3,x,4
 *      4,x,5
 *      5,x,6
 *      6,x,1
 *
 * The SVG path is generated from point 0 to point 6 and then closed.
 *
 */
export default function generateHexagon(barHeight: number): HexagonDef {
  const D = barHeight * 2;
  const a = D / 4;
  const b = Math.sqrt(3) * a; // we flatten it a little to make it wider than it is tall

  return {
    width: b * 2,
    height: D,
    path: `
      M 0 ${-2 * a}
      L ${b} ${-1 * a}
      L ${b} ${a}
      L 0 ${2 * a}
      L ${-1 * b} ${a}
      L ${-1 * b} ${-1 * a}
      Z
    `,
  };
}

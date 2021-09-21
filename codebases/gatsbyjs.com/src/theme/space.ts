import {
  space as baseSpace,
  SpaceToken as DesignSpaceToken,
} from "gatsby-design-tokens"
import { MapToString } from "./types"

/* 
  Our previous 'spaces' tokens

  spaces = {
    "3xs": `0.125rem`,
    "2xs": `0.25rem`,
    xs: `0.5rem`,
    s: `0.75rem`,
    m: `1rem`,
    l: `1.5rem`,
    xl: `2rem`,
    "2xl": `2.5rem`,
    "3xl": `3rem`,
    "4xl": `4rem`,
    "5xl": `6rem`,
  }

  imported 'baseSpace' tokens

  baseSpace = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72]

  we need to expand it to provide missing values: 3xs and 5xl

  expandedSpace = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 84, 96]

  the '84' is added as a middle point between the last '72' and needed '96'

*/

export type SpaceToken = DesignSpaceToken | 13 | 14 | 15
export type PxSpace = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
]

export type Space = MapToString<PxSpace>

const [first, ...rest] = baseSpace
const PX_IN_REM = 16
const space: Space = [
  first,
  `${2 / PX_IN_REM}rem`,
  ...rest,
  `${84 / PX_IN_REM}rem`,
  `${96 / PX_IN_REM}rem`,
] as Space

/* 
  We dynamicaly change (increase) root base font-size value,
  for the Cloud app and gatsbyjs.com 
  that's why our previous spaces were set in `rem`, 
  we have do translate 'px' values to `rem`

  our final values of space tokens are

  space = [
    0: "0rem"
    1: "0.125rem"
    2: "0.25rem"
    3: "0.5rem"
    4: "0.75rem"
    5: "1rem"
    6: "1.25rem"
    7: "1.5rem"
    8: "2rem"
    9: "2.5rem"
    10: "3rem"
    11: "3.5rem"
    12: "4rem"
    13: "4.5rem"
    14: "5.25rem"
    15: "6rem"
  ]
 
*/

export default space

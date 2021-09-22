export type BreakpointToken = `mobile` | `phablet` | `tablet` | `desktop` | `hd`

export type Breakpoints = Record<BreakpointToken, number>

const breakpoints: Breakpoints = {
  mobile: 360,
  phablet: 550,
  tablet: 750,
  desktop: 1000,
  hd: 1300,
}

/**
 * ThemeUI expects "breakpoints" scale to consist of
 * strings representing each breakpoint with a CSS length unit INCLUDED
 * ordered in mobile-first order
 *
 * Hence we need to extract values from our "breakpoints" object,
 * sort them in ascending order and append "px" unit
 */
export type BreakpointsList = [string, string, string, string, string]

const breakpointsInPixels = Object.values(breakpoints)
breakpointsInPixels.sort((a, b) => a - b)

export const breakpointsList = breakpointsInPixels.map(
  breakpoint => `${breakpoint}px`
) as BreakpointsList

export default breakpoints

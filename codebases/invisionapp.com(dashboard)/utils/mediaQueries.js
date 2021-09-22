import { TILE_BREAKPOINTS } from '../constants/TileBreakpoints'

export const makeMediaQueryProps = (mediaQueries, cb) => {
  const mediaQueryKeys = Object.keys(mediaQueries)
  return mediaQueryKeys.reduce((acc, range) => {
    const mediaQuery = mediaQueries[range]
    return {
      ...acc,
      [range]: cb(mediaQuery)
    }
  }, {})
}

export const getActiveMQs = function () {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return makeMediaQueryProps(TILE_BREAKPOINTS, () => false)
  }
  return makeMediaQueryProps(TILE_BREAKPOINTS, mediaQuery => window.matchMedia(mediaQuery).matches)
}

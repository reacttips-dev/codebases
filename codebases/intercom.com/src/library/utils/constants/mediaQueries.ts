export const mqBreakpoints = {
  largePhone: 414,
  tablet: 768,
  laptop: 990,
  desktop: 1024,
  desktopLg: 1440,
  desktopXLg: 1600,
}

export const mq = {
  largePhone: `max-width: ${mqBreakpoints.largePhone}px`,
  mobile: `max-width: ${mqBreakpoints.tablet - 1}px`,
  tablet: `min-width: ${mqBreakpoints.tablet}px`,
  laptop: `min-width: ${mqBreakpoints.laptop}px`,
  desktop: `min-width: ${mqBreakpoints.desktop}px`,
  desktopLg: `min-width: ${mqBreakpoints.desktopLg}px`,
  desktopXLg: `min-width: ${mqBreakpoints.desktopXLg}px`,
}

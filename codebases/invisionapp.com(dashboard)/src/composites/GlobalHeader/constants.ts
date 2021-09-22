export const GLOBAL_NAV_HEIGHT = 64
export const GLOBAL_NAV_HEIGHT_WITH_BORDER = 67
export const HEADER_HEIGHT = 48
export const PADDING_BELOW_HEADER = 16
export const STICKY_TABLE_HEADER_HEIGHT = 56
export const STICKY_TABLE_HEADER_OFFSET = 0
export const TABLET = 1024
export const DESKTOP = 1350

export const breakpoints = {
  mobileDown: `max-width: ${TABLET - 1}px`,
  tabletDown: `max-width: ${DESKTOP - 1}px`,
  tabletUp: `min-width: ${TABLET}px`,
  desktopUp: `min-width: ${DESKTOP}px`,
}

export const generateLoadingPlaceholderColumnCount = (mqs) => {
  // TODO: refactor to use same logic as generateColumnCount
  // Need to make sure this works with non-sidebar
  if (mqs.xs) {
    return 1
  } else if (mqs.s) {
    return 2
  } else if (mqs.m) {
    return 3
  } else if (mqs.l) {
    return 2
  } else if (mqs.xl) {
    return 3
  } else if (mqs.xxl) {
    return 4
  }
  return 1
}

export const generateGutter = (mqs) => {
  return mqs.lDown ? 16 : 32
}

export const generateColumnCount = (width, gutter, minTileWidth = 280) => {
  return Math.floor((width + gutter) / (minTileWidth + gutter)) || 1
}

export const articleCss = theme => ({
  alignItems: `center`,
  display: `flex`,
  flexDirection: `column`,
  margin: `${theme.space[15]} 0`,
})

export const numberCss = ({ theme, color }) => ({
  background: theme.colors[color][10],
  borderRadius: theme.radii[6],
  color: theme.colors[color][50],
  alignItems: `center`,
  display: `flex`,
  fontWeight: theme.fontWeights.bold,
  justifyContent: `center`,
  height: theme.space[8],
  width: theme.space[8],
  zIndex: theme.zIndices.base,
})

export const lightHeadingCss = ({ theme }) => ({
  fontSize: theme.fontSizes[2],
  lineHeight: theme.lineHeights.solid,
  letterSpacing: theme.letterSpacings.tracked,
  textAlign: `center`,
  marginTop: theme.space[7],
  zIndex: theme.zIndices.base,

  span: {
    color: theme.colors.purple[60],
    display: `block`,
  },
})

export const emphasizedHeadingCss = ({ theme, color = `purple` }) => ({
  color: theme.colors.grey[90],
  fontSize: theme.fontSizes[8],
  lineHeight: 1.1, // to-do: add the value to gatsby-interface
  letterSpacing: theme.letterSpacings.tight,
  maxWidth: `52rem`,
  marginTop: theme.space[7],
  textAlign: `center`,
  zIndex: theme.zIndices.base,

  strong: {
    color: theme.colors[color][50],
    fontWeight: `inherit`,
  },

  span: {
    display: `block`,
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[10],
  },
})

export const articleLedeCss = theme => ({
  color: theme.colors.grey[70],
  fontSize: theme.fontSizes[3],
  margin: 0,
  marginTop: theme.space[9],
  maxWidth: `48rem`,
  textAlign: `center`,
  zIndex: theme.zIndices.base,

  "p:last-of-type": {
    marginBottom: 0,
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[4],
  },
})

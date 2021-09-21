export const navSimpleLinkCss = ({ theme, isInverted }) => [
  {
    color: theme.colors.blackFade[70],
    display: `inline-block`,
    padding: `2px 4px`,
    transform: `translateX(-4px)`,

    "&:hover, &:focus": {
      color: theme.colors.purple[60],
      transition: `all ${theme.transitions.speed.default} ${theme.transitions.curve.default}`,
      textDecoration: `none`,
    },
  },
  isInverted && {
    color: theme.colors.whiteFade[70],
    "&:hover, &:focus": {
      color: theme.colors.white,
    },
  },
]

export const headerNavSimpleLinkCss = ({ theme }) => [
  navSimpleLinkCss({ theme }),
  {
    fontSize: theme.fontSizes[1],
    textDecoration: `none`,

    "&:after": {
      content: `"›"`,
      color: theme.colors.blackFade[40],
      marginLeft: theme.space[2],
    },
  },
]

export const headerNavLinkIconCss = ({ theme }) => ({
  marginRight: theme.space[3],
  height: theme.space[7],
  width: theme.space[7],

  [theme.mediaQueries.desktop]: {
    height: theme.space[8],
    left: theme.space[4],
    position: `absolute`,
    top: `.3rem`, // exception, we need a custom, not tokenized value
    width: theme.space[8],
  },
})

export const footerLinkCss = ({ theme, isInverted }) => [
  navSimpleLinkCss({ theme, isInverted }),
]

export const ctaBtnCss = ({ theme, tone, variant }) => [
  {
    borderRadius: theme.radii[3],
  },
  tone === `cloud` && {
    background: theme.colors.purple[60],
    borderColor: theme.colors.purple[60],
    fontWeight: theme.fontWeights.bold,

    "&:hover": {
      background: theme.colors.purple[70],
      borderColor: theme.colors.purple[70],
    },
  },
  variant === `secondary` && {
    background: theme.colors.white,
    borderColor: theme.colors.purple[30],
    color: theme.colors.purple[70],

    "&:hover": {
      background: theme.colors.purple[5],
      borderColor: theme.colors.purple[40],
      color: theme.colors.purple[90],
    },
  },
]

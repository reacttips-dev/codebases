import vars from 'sass-extract-loader?{"plugins":["sass-extract-js"]}!../stylesheets/_vars.scss'

const space = {
  base: 0,
  xs: vars.spacingXs,
  s: vars.spacingS,
  m: vars.spacingM,
  l: vars.spacingL,
  xl: vars.spacingXl
}

const lineHeights = {
  xs: 1,
  sm: 1.1,
  md: 1.2,
  lg: 1.4
}

const fontWeights = ['300', '400', '500', '600']

const fontSizes = {
  base: vars.fontSizeBase,
  xs: vars.fontSizeXs,
  s: vars.fontSizeS,
  m: vars.fontSizeM,
  l: vars.fontSizeL,
  xl: vars.fontSizeXl,
  xxl: vars.fontSizeXxl
}

export const colors = {
  white: '#ffffff',
  black: '#000000',
  blue50: vars.brandBlue50,
  blue100: vars.brandBlue100,
  blue200: vars.brandBlue200,
  blue300: vars.brandBlue300,
  blue400: vars.brandBlue400,
  blue500: vars.brandBlue500,
  grey50: vars.brandGrey50,
  grey100: vars.brandGrey100,
  grey200: vars.brandGrey200,
  grey300: vars.brandGrey300,
  grey400: vars.brandGrey400,
  grey500: vars.brandGrey500,
  green50: vars.brandGreen50,
  green100: vars.brandGreen100,
  green200: vars.brandGreen200,
  green300: vars.brandGreen300,
  green400: vars.brandGreen400,
  green500: vars.brandGreen500,
  yellow50: vars.brandYellow50,
  yellow100: vars.brandYellow100,
  yellow200: vars.brandYellow200,
  yellow300: vars.brandYellow300,
  yellow400: vars.brandYellow400,
  yellow500: vars.brandYellow500,
  red50: vars.brandRed50,
  red100: vars.brandRed100,
  red200: vars.brandRed200,
  red300: vars.brandRed300,
  red400: vars.brandRed400,
  red500: vars.brandRed500,
  purple50: vars.brandPurple50,
  purple100: vars.brandPurple100,
  purple200: vars.brandPurple200,
  purple300: vars.brandPurple300,
  purple400: vars.brandPurple400,
  purple500: vars.brandPurple500,
  lighthouse: {
    poor: 'hsl(1, 73%, 45%)',
    average: 'hsl(31, 100%, 45%)',
    good: 'hsl(139, 70%, 30%)'
  },
  greyOutline: vars.greyOutline,
  silverGrey: vars.colourSilverGrey,
  gradingGreen: vars.colourGradingGreen,
  gradingRed: vars.colourGradingRed,
  gradingOrange: vars.colourGradingAmber,
  positiveBlue: vars.colourPositiveBlue,
  success: vars.brandGreen300,
  error: vars.brandRed300,
  warning: vars.brandYellow400,
  disabledActive: vars.brandGrey100,
  neutralActive: vars.brandGrey200,
  successActive: vars.brandGreen200,
  errorActive: vars.brandRed200,
  warningActive: vars.brandYellow300,
  neutralInactive: vars.brandGrey100,
  disabledInactive: vars.brandGrey100,
  successInactive: vars.brandGreen100,
  errorInactive: vars.brandRed100,
  warningInactive: vars.brandYellow200
}

export const chartColors = [
  colors.blue300,
  colors.green300,
  colors.yellow300,
  colors.red300,
  colors.purple300,
  colors.blue500,
  colors.green500,
  colors.yellow500,
  colors.red500,
  colors.purple500,
  colors.blue100,
  colors.green100,
  colors.yellow100,
  colors.red100,
  colors.purple100,
  colors.blue400,
  colors.green400,
  colors.yellow400,
  colors.red400,
  colors.purple400,
  colors.blue200,
  colors.green200,
  colors.yellow200,
  colors.red200,
  colors.purple200
]

export const barChartColors = [
  colors.red300,
  colors.yellow300,
  colors.green300,
  colors.purple300
]

export const harColors = {
  HTML: colors.blue300,
  JavaScript: colors.gradingOrange,
  CSS: colors.green300,
  Image: colors.purple300,
  Font: colors.red300,
  JSON: colors.yellow300,
  Video: 'black',
  Other: colors.grey300
}

export const budgetColors = {
  poor: '#E64C3B',
  average: '#FFCA32',
  good: colors.green200
}

export const chart = {
  HTML: colors.blue300,
  JavaScript: colors.gradingOrange,
  CSS: colors.green300,
  Image: colors.purple300,
  Font: colors.red300,
  JSON: colors.yellow300,
  Video: 'black',
  Other: colors.grey300
}

export const mainThreadActivityColors = {
  styleLayout: {
    active: colors.purple300,
    inactive: colors.purple200
  },
  scripting: {
    active: colors.yellow300,
    inactive: colors.yellow200
  },
  scriptParseCompile: {
    active: colors.yellow300,
    inactive: colors.yellow200
  },
  scriptEvaluation: {
    active: colors.yellow300,
    inactive: colors.yellow200
  },
  paintCompositeRender: {
    active: colors.green300,
    inactive: colors.green200
  },
  blocking: {
    active: colors.red300,
    inactive: colors.red200
  },
  parseHTML: {
    active: colors.blue300,
    inactive: colors.blue200
  },
  runTask: {
    active: colors.grey100,
    inactive: colors.grey50
  },
  undefined: {
    active: colors.grey300,
    inactive: colors.grey200
  }
}

export const breakpoints = ['40em', '64em', '80em', '90em']

export default {
  space: Object.keys(space).map(key => space[key]),
  breakpoints,
  fontSizes: Object.keys(fontSizes).map(key => fontSizes[key]),
  lineHeights,
  fontWeights,
  colors,

  chart: {
    flag: {
      height: 40
    }
  },

  buttons: {
    primary: {
      backgroundColor: colors.green300,
      borderColor: colors.green300,
      color: 'white',
      '&:hover, &:active, &:focus, &.active, &[data-selected]': {
        backgroundColor: colors.green400,
        borderColor: colors.green400
      }
    },
    primaryDisabled: {
      backgroundColor: colors.green200,
      borderColor: colors.green200,
      color: 'white'
    },
    secondary: {
      backgroundColor: colors.blue300,
      borderColor: colors.blue300,
      color: 'white',
      '&:hover, &:active, &:focus, &.active, &[data-selected]': {
        backgroundColor: colors.blue400,
        borderColor: colors.blue400
      }
    },
    secondaryDisabled: {
      backgroundColor: colors.blue200,
      borderColor: colors.blue200,
      color: 'white'
    },
    tertiary: {
      backgroundColor: colors.grey100,
      borderColor: colors.grey100,
      color: colors.grey400,
      '&:hover, &:active, &:focus, &.active, &[data-selected]': {
        backgroundColor: colors.grey200,
        borderColor: colors.grey200,
        color: colors.grey500
      }
    },
    tertiaryDisabled: {
      borderColor: colors.grey50,
      backgroundColor: colors.grey50,
      color: colors.grey400
    },
    outlined: {
      background: 'none',
      borderColor: colors.grey200,
      color: colors.grey400,
      '&:hover, &:active, &:focus, &.active, &[data-selected]': {
        borderColor: colors.grey200,
        color: colors.grey500
      }
    },
    outlinedActive: {
      background: colors.green100,
      borderColor: colors.green100,
      color: colors.grey500
    },
    outlinedDisabled: {
      background: 'none',
      borderColor: colors.grey200,
      color: colors.grey300
    },
    danger: {
      backgroundColor: 'white',
      borderColor: colors.red400,
      color: colors.red400,
      '&:hover, &:active, &:focus, &.active, &[data-selected]': {
        color: colors.red500
      }
    },
    dangerDisabled: {
      borderColor: colors.red200,
      backgroundColor: 'white',
      color: colors.red200
    },
    loading: {
      backgroundColor: colors.grey50,
      borderColor: colors.grey50,
      color: colors.grey50
    },
    text: {
      border: 'none',
      color: 'inherit',
      '&:hover, &:active, &:focus, &[data-selected]': {
        border: 'none',
        color: 'inherit'
      }
    }
  },

  inputStyles: {
    base: {
      borderColor: colors.grey200,
      '&:focus': {
        borderColor: colors.blue200
      }
    },
    success: {
      borderColor: colors.green200,
      '&:focus': {
        borderColor: colors.green200
      }
    },
    error: {
      borderColor: colors.red200,
      '&:focus': {
        borderColor: colors.red200
      }
    },
    warning: {
      borderColor: colors.yellow400,
      '&:focus': {
        borderColor: colors.yellow400
      }
    },
    disabled: {
      backgroundColor: colors.grey50
    },
    inactive: {
      backgroundColor: 'transparent',
      borderColor: colors.blue200,
      '&::placeholder': {
        color: colors.blue100,
        opacity: 1
      }
    }
  },

  iconStyles: {
    base: {
      color: colors.grey300
    },
    success: {
      color: colors.green300
    },
    error: {
      color: colors.red300
    },
    warning: {
      color: colors.yellow400
    }
  },

  gridStyles: {
    open: {},
    contained: {
      borderColor: colors.grey100,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '3px'
    }
  },

  linkStyles: {
    base: {
      color: colors.blue300,
      '&:hover, &:active, &:focus, &[data-selected]': {
        color: colors.blue400
      }
    },
    muted: {
      color: colors.grey300,
      '&:hover, &:active, &:focus, &[data-selected]': {
        color: colors.grey400
      }
    },
    navPrimary: {
      color: colors.white,
      fontWeight: 600,
      '&:hover, &:active, &:focus': {
        color: colors.white
      }
    },
    navPrimaryAlt: {
      color: colors.blue100,
      '&:hover, &:active, &:focus': {
        color: colors.white
      }
    },
    navSecondary: {
      borderBottom: '2px solid transparent',
      color: colors.blue100,
      '&:hover, &:active, &.active, &:focus': {
        color: colors.white
      },
      '&.active, &[data-selected]': {
        borderBottomColor: 'white',
        fontWeight: 600
      }
    },
    white: {
      color: colors.white,
      '&:hover, &:active, &:focus': {
        color: colors.white
      }
    },
    menu: {
      color: colors.grey400,
      '&:hover, &:active, &.active, &:focus, &[data-selected]': {
        color: colors.blue300
      }
    },
    callout: {
      color: colors.purple400,
      textDecoration: 'underline',
      '&:hover, &:active, &.active, &:focus, &[data-selected]': {
        color: colors.blue300
      }
    }
  },

  metricStyles: {
    default: {
      color: colors.grey400
    },
    ungraded: {
      color: colors.grey400
    },
    poor: {
      color: colors.gradingRed
    },
    average: {
      color: colors.gradingOrange
    },
    good: {
      color: colors.gradingGreen
    }
  },

  avatarStyles: {
    default: {
      borderColor: colors.blue200
    },
    secondary: {
      borderColor: 'white'
    },
    tertiary: {
      borderColor: colors.grey50
    },
    inherit: {
      borderColor: 'currentColor'
    },
    admin: {
      borderColor: colors.red200
    },
    adminLink: {
      borderColor: colors.red200,
      '&:hover, &:active, &.active, button:focus &': {
        borderColor: colors.red300
      }
    },
    member: {
      borderColor: colors.green200
    },
    memberLink: {
      borderColor: colors.green200,
      '&:hover, &:active, &.active, button:focus &': {
        borderColor: colors.green300
      }
    },
    viewer: {
      borderColor: colors.grey200
    },
    viewerLink: {
      borderColor: colors.grey200,
      '&:hover, &:active, &.active, button:focus &': {
        borderColor: colors.grey200
      }
    }
  },

  shadows: {
    menu: '0 5px 10px hsla(0, 0%, 77%, 0.3)',
    callout: '0px 1px 0px #CFD8FC'
  },

  feedback: {
    error: {
      borderColor: colors.red300,
      backgroundColor: colors.red100,
      color: colors.red400
    },
    info: {
      borderColor: colors.blue300,
      backgroundColor: colors.blue100,
      color: colors.blue400
    },
    warning: {
      borderColor: colors.yellow400,
      backgroundColor: colors.yellow100,
      color: colors.yellow500
    },
    success: {
      borderColor: colors.green300,
      backgroundColor: colors.green100,
      color: colors.green400
    }
  },

  statusStyles: {
    unknown: { backgroundColor: colors.grey50, color: colors.grey300 },
    none: { backgroundColor: colors.green50, color: colors.green300 },
    minor: { backgroundColor: colors.yellow50, color: colors.yellow500 },
    major: { backgroundColor: colors.red50, color: colors.red300 },
    critical: { backgroundColor: colors.red50, color: colors.red300 }
  },
  indicatorStyles: {
    unknown: { backgroundColor: colors.grey200 },
    none: { backgroundColor: colors.green200 },
    minor: { backgroundColor: colors.yellow300 },
    major: { backgroundColor: colors.red300 },
    critical: { backgroundColor: colors.red300 }
  }
}

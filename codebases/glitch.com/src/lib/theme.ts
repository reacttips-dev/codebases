/* eslint-disable sort-keys */
// The base theme
import { Theme } from 'theme-ui'

// Our components individual theme files
import badges from './components/Badge/theme'
import buttons from './components/Button/theme'

// potentially: imports file that imports all our components to pass here
// goal: tidy this

// Our theme
export const theme: Theme = {
  colors: {
    background: '#fff',
    text: '#000',
    brand: {
      red: '#FF7698',
      pink: '#FEC1EE',
      blue: '#2800FF',
      lightBlue: '#5A78FF',
      green: '#05F293',
      teal: '#9BE7D8',
      lightTeal: '#D0FFF1',
      yellow: '#FFFF60',
    },
    warning: {
      lightOrange: '#FFF4E6',
      orange: '#FFCC8F',
      red: '#FF7698',
    },
    editor: {
      1: '#2800FF',
      2: '#4860CC',
      3: '#CD4466',
      4: '#B25099',
      5: '#77770A',
      6: '#3E7A6E',
    },
    white: '#fff',
    black: '#000',
    gray: {
      1: '#F2F2F2',
      2: '#E0E0E0',
      3: '#BDBDBD',
      4: '#828282',
      5: '#4F4F4F',
      6: '#333333',
      white: '#fff',
      black: '#000',
    },
    blueDark: {
      1: '#9480FF',
      2: '#694DFF',
      3: '#3E1AFF',
      4: '#2800FF',
      5: '#2000CC',
      6: '#140080',
    },
    blueLight: {
      1: '#BDC9FF',
      2: '#9CAEFF',
      3: '#7B93FF',
      4: '#5A78FF',
      5: '#4860CC',
      6: '#364899',
    },
    tealDark: {
      1: '#D7F5EF',
      2: '#C3F1E8',
      3: '#AFECE0',
      4: '#9BE7D8',
      5: '#8CD0C2',
      6: '#6DA297',
    },
    green: {
      1: '#B4FBDF',
      2: '#69F7BE',
      3: '#37F5A9',
      4: '#05F293',
      5: '#05DA84',
      6: '#04C276',
    },
    yellow: {
      1: '#FFFFDF',
      2: '#FFFFBF',
      3: '#FFFFA0',
      4: '#FFFF60',
      5: '#E6E656',
      6: '#CCCC4D',
    },
    pink: {
      1: '#FFF3FC',
      2: '#FFE6F8',
      3: '#FED4F3',
      4: '#FEC1EE',
      5: '#E5AED6',
      6: '#CB9ABE',
    },
    modes: {
      dark: {
        background: '#000',
        primary: '#0cf',
        text: '#fff',
        editor: {
          1: '#5A78FF',
          2: '#FF7698',
          3: '#FEC1EE',
          4: '#FFFF60',
          5: '#9BE7D8',
          6: '#D0FFF1',
        },
      },
    },
  },
  fontSizes: [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  fonts: {
    body:
      '"Benton Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading:
      '"Benton Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    monospace: '"Fira Code", monospace',
  },
  letterSpacings: {
    body: 'normal',
    caps: '0.2em',
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  breakpoints: ['600px', '900px', '1200px', '1600px'],
  styles: {
    root: {
      variant: 'text.body2',
    },
  },
  text: {
    h1: {
      fontSize: [8, 10, 10, 11, 12],
      fontWeight: 'heading',
      fontFamily: 'heading',
      lineHeight: 'heading',
    },
    h2: {
      fontSize: [6, 9, 9, 10, 11],
      fontWeight: 'heading',
      fontFamily: 'heading',
      lineHeight: 'heading',
    },
    h3: {
      fontSize: [5, 7, 7, 9, 10],
      fontWeight: 'heading',
      fontFamily: 'heading',
      lineHeight: 'heading',
    },
    h4: {
      fontSize: [4, 5, 5, 7, 7],
      fontWeight: 'heading',
      fontFamily: 'heading',
      lineHeight: 'heading',
    },
    h5: {
      fontSize: [3, 3, 3, 5, 5],
      fontWeight: 'heading',
      fontFamily: 'heading',
      lineHeight: 'heading',
    },
    h6: {
      fontSize: [2, 2, 2, 2, 3],
      fontWeight: 'heading',
      fontFamily: 'heading',
      lineHeight: 'heading',
    },
    subtitle1: {
      fontSize: [1, 2, 2, 2, 2],
      fontWeight: 'body',
      fontFamily: 'body',
      lineHeight: 'body',
    },
    subtitle2: {
      fontSize: [0, 1, 1, 1, 1],
      fontWeight: ['body', 'bold'],
      fontFamily: 'body',
      lineHeight: 'body',
    },
    body1: {
      fontSize: [4, 5, 5, 5, 5],
      fontWeight: 'body',
      fontFamily: 'body',
      lineHeight: 'body',
    },
    body2: {
      fontSize: [2, 3, 2, 1, 3],
      fontWeight: 'body',
      fontFamily: 'body',
      lineHeight: 'body',
    },
    button: {
      fontSize: [2, 1, 2, 1, 3],
      fontWeight: 'body',
      fontFamily: 'body',
      lineHeight: 'body',
    },
    caption: {
      fontSize: [0, 0, 0, 0, 1],
      fontWeight: 'body',
      fontFamily: 'body',
      lineHeight: 'body',
    },
    code: {
      fontFamily: 'monospace',
      fontWeight: 'body',
      lineHeight: 'body',
    },
  },
  // Component Specific styling
  badges,
  buttons,
}

import globalColors from './globalColors.json'; /* TODO: Replace this with global colors imported from design-system package */

const darkTheme = {
  '--content-color-primary': globalColors['grey-00'],
  '--content-color-secondary': globalColors['grey-40'],
  '--content-color-tertiary': globalColors['grey-50'],
  '--content-color-brand': globalColors['orange-40'],
  '--content-color-info': globalColors['blue-30'],
  '--content-color-error': globalColors['red-30'],
  '--content-color-success': globalColors['green-30'],
  '--content-color-warning': globalColors['yellow-30'],
  '--content-color-link': globalColors['blue-40'],
  '--background-color-primary': globalColors['grey-90'],
  '--background-color-secondary': globalColors['grey-85'],
  '--background-color-tertiary': globalColors['grey-80'],
  '--background-color-info': globalColors['blue-90'],
  '--background-color-brand': globalColors['orange-90'],
  '--background-color-error': globalColors['red-90'],
  '--background-color-success': globalColors['green-90'],
  '--background-color-warning': globalColors['yellow-90'],
  '--border-color-default': globalColors['grey-70'],
  '--border-color-strong': globalColors['grey-60'],
  '--highlight-background-color-primary': globalColors['grey-70'],
  '--highlight-background-color-secondary': globalColors['grey-70'],
  '--highlight-background-color-tertiary': globalColors['grey-60'],
  '--highlight-background-color-transparent': 'rgba(255, 255, 255, 0.1)',
  '--background-modal-backdrop': 'rgba(0, 0, 0, 0.7)',
  '--shadow-default': '0px 2px 8px 0px rgba(0, 0, 0, 0.65)',

  // Component Specific Tokens
  '--illustration-stroke-color': '#8B8B8B',
  '--scrollbar-thumb-background-color': globalColors['grey-60'],
  '--scrollbar-track-background-color': globalColors['grey-80'],
  '--runner-summary-vertical-bar-hover-background-color': globalColors['grey-00'],
  '--selected-checkbox-background-color': globalColors['grey-00'],
  '--radio-button-background-color': '#686868',

  '--color-content-primary': '#FFFFFF',
  '--color-content-secondary': '#BFBFBF',
  '--color-content-tertiary': '#808080',
  '--color-content-brand-primary': '#FF7542',
  '--color-content-brand-secondary': '#80BFFF',
  '--color-content-accent-error': '#EEA495',
  '--color-content-accent-success': '#41E199',
  '--color-content-accent-warning': '#FFBD1F',
  '--color-background-primary': '#262626',
  '--color-background-secondary': '#2E2E2E',
  '--color-background-tertiary': '#363636',
  '--color-border-regular': '#3D3D3D',
  '--color-border-strong': '#4D4D4D',
  '--color-highlight-background-primary': '#333333',
  '--color-highlight-background-secondary': '#3B3B3B',
  '--color-highlight-background-tertiary': '#424242',

  // Flow specific tokens
  '--flow-input-border-color': globalColors['grey-50'],
  '--flow-input-focus-color': globalColors['blue-50']
};

export default darkTheme;


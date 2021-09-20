import globalColors from './globalColors.json'; /* TODO: Replace this with global colors imported from design-system package */

const lightTheme = {
  '--content-color-primary': globalColors['grey-90'],
  '--content-color-secondary': globalColors['grey-50'],
  '--content-color-tertiary': globalColors['grey-40'],
  '--content-color-brand': globalColors['orange-70'],
  '--content-color-info': globalColors['blue-70'],
  '--content-color-error': globalColors['red-70'],
  '--content-color-success': globalColors['green-70'],
  '--content-color-warning': globalColors['yellow-70'],
  '--content-color-link': globalColors['blue-60'],
  '--background-color-primary': globalColors['grey-00'],
  '--background-color-secondary': globalColors['grey-05'],
  '--background-color-tertiary': globalColors['grey-10'],
  '--background-color-info': globalColors['blue-10'],
  '--background-color-brand': globalColors['orange-10'],
  '--background-color-error': globalColors['red-10'],
  '--background-color-success': globalColors['green-10'],
  '--background-color-warning': globalColors['yellow-10'],
  '--border-color-default': globalColors['grey-20'],
  '--border-color-strong': globalColors['grey-30'],
  '--highlight-background-color-primary': globalColors['grey-20'],
  '--highlight-background-color-secondary': globalColors['grey-20'],
  '--highlight-background-color-tertiary': globalColors['grey-30'],
  '--highlight-background-color-transparent': 'rgba(26, 26, 26, 0.1)',
  '--background-modal-backdrop': 'rgba(26, 26, 26, 0.5)',
  '--shadow-default': '0px 2px 8px 0px rgba(0, 0, 0, 0.2)',

  // Component Specific Tokens
  '--illustration-stroke-color': '#686868',
  '--scrollbar-thumb-background-color': globalColors['grey-40'],
  '--scrollbar-track-background-color': globalColors['grey-20'],
  '--runner-summary-vertical-bar-hover-background-color': '#282828',
  '--selected-checkbox-background-color': globalColors['grey-85'],
  '--radio-button-background-color': '#bfbfbf',

  '--color-content-primary': '#1A1A1A',
  '--color-content-secondary': '#666666',
  '--color-content-tertiary': '#999999',
  '--color-content-brand-primary': '#C73500',
  '--color-content-brand-secondary': '#145EA9',
  '--color-content-accent-error': '#B32E14',
  '--color-content-accent-success': '#127347',
  '--color-content-accent-warning': '#7D6517',
  '--color-background-primary': '#FFFFFF',
  '--color-background-secondary': '#F7F7F7',
  '--color-background-tertiary': '#EBEBEB',
  '--color-border-regular': '#E3E3E3',
  '--color-border-strong': '#D9D9D9',
  '--color-highlight-background-primary': '#F2F2F2',
  '--color-highlight-background-secondary': '#EBEBEB',
  '--color-highlight-background-tertiary': '#E3E3E3',

  // Flow specific tokens
  '--flow-input-border-color': globalColors['grey-40'],
  '--flow-input-focus-color': globalColors['blue-30']
};

export default lightTheme;

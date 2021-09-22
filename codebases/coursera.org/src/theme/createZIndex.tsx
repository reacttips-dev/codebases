import type { ZIndexOptions } from '@material-ui/core/styles/zIndex';

/**
 * Values has been picked based on https://github.com/webedx-spark/coursera-ui/blob/master/src/styles/theme.js#L160
 * in order to simplify the adoption process and make sure that CDS components are compatible with CUI
 */
const zIndex: ZIndexOptions = {
  mobileStepper: 1000,
  speedDial: 2000,
  appBar: 3000,
  drawer: 4000,
  modal: 10000,
  snackbar: 10100,
  tooltip: 11000,
};

export default zIndex;

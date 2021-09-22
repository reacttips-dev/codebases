import createMuiTheme from '@material-ui/core/styles/createTheme';

import { Theme, ThemeOptions } from '@core/types';

import createBreakpoints from './createBreakpoints';
import createPalette from './createPalette';
import createSpacing from './createSpacing';
import createTypography from './createTypography';
import createZIndex from './createZIndex';
import createOverrides from './overrides';

const createTheme = (options: ThemeOptions): Theme => {
  const theme = createMuiTheme({
    palette: createPalette,
    spacing: createSpacing,
    overrides: createOverrides,
    direction: options.direction,
    breakpoints: createBreakpoints,
    zIndex: createZIndex,
  });

  theme.typography = createTypography(theme);
  theme.__isCDS__ = true;

  return theme;
};

export { Theme };
export default createTheme;

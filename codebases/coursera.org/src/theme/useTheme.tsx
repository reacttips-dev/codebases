import { useTheme } from '@material-ui/core/styles';
import type { Theme as MuiTheme } from '@material-ui/core/styles';

import type { Theme } from '@core/types';

/**
 * Type guard, determines whether Theme object is CdsTheme
 * @param theme
 */
export function isCdsTheme(theme: Theme | MuiTheme): theme is Theme {
  return '__isCDS__' in theme && theme.__isCDS__;
}

export default <T extends Theme>(): T => {
  const theme = useTheme() as T;

  if (!isCdsTheme(theme)) {
    throw new TypeError(
      'Could not access the theme. Please ensure <Provider /> is an ancestor.'
    );
  }

  return theme;
};

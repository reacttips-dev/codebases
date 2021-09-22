import type { ThemeResources, OwaPalette } from 'owa-theme-shared';
import getResourcesForTheme from './getResourcesForTheme';
import { isCssVariablesSupported } from 'owa-theme-common';
import getNeutralPaletteAsRawColors from './getNeutralPaletteAsRawColors';
import { getIsDarkThemeFromParameter } from '../utils/optionalArgumentHelpers';
import { computedFn } from 'mobx-utils/lib/computedFn';

// Note: the getResourcesForTheme -> fetchThemeResource codepath,
// responsible for providing the `resources` parameter to this method,
// isn't correctly memoizing so this is getting computed more than
// necessary, but still providing some benefit.
const createPaletteAsRawColors = computedFn(
    (resources: ThemeResources, neutralPaletteAsRawColors): OwaPalette => {
        return {
            ...neutralPaletteAsRawColors,
            ...resources.themePalette,
        };
    }
);

// emptyObject is declared as a file-scope const object to provide a stable return value,
// eliminating wasted renders when the undefined resources clause is encountered below.
const emptyObject = {};

/**
 * Returns the raw color values for various theme symbols. Should only be used if your code
 * needs to manipulate the colors, or apply them outside the current winow.
 * Otherwise, use `getPalette` instead.
 * @param themeId Theme if to get values for. If not provided, defaults to the current theme.
 */
export default function getPaletteAsRawColors(themeId?: string, isDarkTheme?: boolean): OwaPalette {
    isDarkTheme = getIsDarkThemeFromParameter(isDarkTheme);
    const useDarkTheme = isDarkTheme && isCssVariablesSupported();
    const resources: ThemeResources | undefined = getResourcesForTheme(themeId, useDarkTheme);

    if (!resources) {
        return emptyObject;
    }

    const neutralPaletteAsRawColors = getNeutralPaletteAsRawColors(useDarkTheme);
    return createPaletteAsRawColors(resources, neutralPaletteAsRawColors);
}

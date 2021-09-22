import getPaletteAsRawColors from './getPaletteAsRawColors';
import { isCssVariablesSupported } from 'owa-theme-common';
import {
    getThemeIdFromParameter,
    getIsDarkThemeFromParameter,
} from '../utils/optionalArgumentHelpers';
import type { OwaPalette } from 'owa-theme-shared';
import { computedFn } from 'mobx-utils/lib/computedFn';

const createCssVariablesPalette = (palette: OwaPalette): OwaPalette => {
    const variablePalette: OwaPalette = {};
    Object.keys(palette).forEach(key => {
        variablePalette[key] = `var(--${key})`;
    });

    return variablePalette;
};

const getPaletteComputed = computedFn(
    (themeId: string, isDarkTheme: boolean): OwaPalette => {
        let palette = getPaletteAsRawColors(themeId, isDarkTheme);

        if (isCssVariablesSupported() && !!palette) {
            return createCssVariablesPalette(palette);
        } else {
            // If the browser is IE, which doesn't support CSS variables,
            // just return the palette unmodified
            return palette;
        }
    }
);

/**
 * Returns the CSS values to use for various theme symbols to use for colors within the current window.
 * If your code needs to manipulate the values, or apply them outside the current window, use
 * `getPalleteFromResources` instead.
 * @param themeId Theme id to get values for. If not provided, defaults to the current theme.
 */
const getPalette = (themeId?: string, isDarkTheme?: boolean): OwaPalette => {
    themeId = getThemeIdFromParameter(themeId);
    isDarkTheme = getIsDarkThemeFromParameter(isDarkTheme);

    return getPaletteComputed(themeId, isDarkTheme);
};

export default getPalette;

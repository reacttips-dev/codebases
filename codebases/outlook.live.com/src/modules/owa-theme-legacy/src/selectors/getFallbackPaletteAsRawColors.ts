import type { ThemeResources, OwaPalette } from 'owa-theme-shared';
import getResourcesForTheme from './getResourcesForTheme';
import getNeutralPaletteAsRawColors from './getNeutralPaletteAsRawColors';
import getTheme from './getTheme';

/**
 * Returns the raw color values for various theme symbols in the fallback palette.
 * Should only be used if your code needs to manipulate the colors, or apply them
 * outside the current winow. Otherwise, use `getPalette` instead.
 * @param themeId Theme if to get values for. If not provided, defaults to the current theme.
 */
export default function getFallbackPaletteAsRawColors(): OwaPalette {
    const themeId = getTheme();
    const resources: ThemeResources = getResourcesForTheme(themeId, false);
    const neutralPaletteColors = getNeutralPaletteAsRawColors(false);

    if (!resources) {
        return {};
    }

    return {
        ...neutralPaletteColors,
        ...resources.themePalette,
    };
}

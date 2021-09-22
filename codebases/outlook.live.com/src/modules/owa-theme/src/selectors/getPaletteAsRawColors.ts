import type { OwaPalette } from 'owa-theme-shared';
import { getPaletteAsRawColors as getPaletteAsRawColorsLegacy } from 'owa-theme-legacy';
import { shouldUseSuiteThemes } from './shouldUseSuiteThemes';
import { getCurrentPalette } from 'owa-suite-theme';

// Check if the user is using the OWA base theme and is in dark mode
export function getPaletteAsRawColors(themeId?: string, isDarkTheme?: boolean): OwaPalette {
    if (shouldUseSuiteThemes()) {
        return getCurrentPalette();
    } else {
        return getPaletteAsRawColorsLegacy(themeId, isDarkTheme);
    }
}

import { ThemeConstants } from 'owa-theme-shared';
import { isCssVariablesSupported } from 'owa-theme-common';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { getEdgeThemeById, isThemeEdgeOnly } from '../selectors/getAllThemeIds';

const BASE_THEME = 'base';

export default function normalizeThemeId(themeId: string | undefined): string {
    return (themeId || BASE_THEME).toLowerCase();
}

export function normalizeThemeRequest(
    id: string | undefined,
    isDarkTheme: boolean | undefined,
    isUserPersonalizationAllowed: boolean
) {
    let themeId: string = normalizeThemeId(id);
    if (isThemeEdgeOnly(themeId)) {
        themeId = getEdgeThemeById(themeId);
    }

    if (!isUserPersonalizationAllowed) {
        isDarkTheme = false;
        themeId =
            themeId === ThemeConstants.CONTRAST_THEME_ID ? themeId : ThemeConstants.BASE_THEME_ID;
    } else if (!isCssVariablesSupported()) {
        // If css variables aren't supported, we don't support dark mode
        isDarkTheme = false;
    } else {
        // Default to the current mode if not specified
        isDarkTheme = typeof isDarkTheme === 'boolean' ? isDarkTheme : getIsDarkTheme();
    }

    return { themeId, isDarkTheme };
}

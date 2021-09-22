import { getCurrentThemeId } from './getCurrentThemeId';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { shouldUseCobranding } from 'owa-theme-common';
import { ThemeConstants } from 'owa-theme-shared';

// Check if the user is using the OWA base theme and is not in dark mode
export function getIsLightBaseTheme(): boolean {
    let theme = getCurrentThemeId();
    let isDarkTheme = getIsDarkTheme();
    return (
        !isDarkTheme &&
        (theme === ThemeConstants.BASE_OFFICE_THEME_ID ||
            (theme == ThemeConstants.BASE_THEME_ID && !shouldUseCobranding(theme, isDarkTheme)))
    );
}

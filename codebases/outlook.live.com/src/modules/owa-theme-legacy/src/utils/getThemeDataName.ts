import { getThemeDataNameWithoutOverrides, ThemeConstants } from 'owa-theme-shared';
import { isBookingsV2 } from '../utils/optionalArgumentHelpers';

export function getThemeDataName(themeId: string, isDarkTheme: boolean): string {
    if (
        themeId === ThemeConstants.BASE_THEME_ID ||
        themeId === ThemeConstants.BASE_OFFICE_THEME_ID
    ) {
        if (isBookingsV2()) {
            themeId = 'base.bookings';
        } else if (!isDarkTheme) {
            return `${ThemeConstants.BASE_THEME_ID}`;
        }
    }
    return getThemeDataNameWithoutOverrides(themeId, isDarkTheme);
}

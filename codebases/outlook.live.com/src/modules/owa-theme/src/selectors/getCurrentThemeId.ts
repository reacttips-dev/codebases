import { getCurrentThemeId as getCurrentThemeIdLegacy } from 'owa-theme-legacy';
import { shouldUseSuiteThemes } from './shouldUseSuiteThemes';
import { getCurrentTheme } from 'owa-suite-theme';

export function getCurrentThemeId(): string {
    if (shouldUseSuiteThemes()) {
        return getCurrentTheme()?.Id ?? 'base';
    } else {
        return getCurrentThemeIdLegacy();
    }
}

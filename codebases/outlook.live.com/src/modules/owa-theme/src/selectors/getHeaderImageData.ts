import { getHeaderImageData as getHeaderImageDataLegacy } from 'owa-theme-legacy';
import { shouldUseSuiteThemes } from './shouldUseSuiteThemes';
import { getCurrentTheme } from 'owa-suite-theme';
import type { BaseTheme } from '@suiteux/suiteux-shell';

export function getHeaderImageData(
    themeId?: string,
    isDarkTheme?: boolean
): Readonly<Pick<BaseTheme, 'BackgroundImageUrl' | 'BackgroundImageRepeat'>> {
    if (shouldUseSuiteThemes()) {
        return (isDarkTheme ? getCurrentTheme()?.DarkTheme : getCurrentTheme()) ?? {};
    } else {
        const { primary, repeat } = getHeaderImageDataLegacy(themeId, isDarkTheme);

        return {
            BackgroundImageUrl: primary,
            BackgroundImageRepeat: repeat,
        };
    }
}

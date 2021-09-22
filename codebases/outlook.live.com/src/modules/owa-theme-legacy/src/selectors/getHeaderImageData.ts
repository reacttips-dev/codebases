import getResourcesForTheme from './getResourcesForTheme';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import type { HeaderImageData } from 'owa-theme-shared';
import { getThemeIdFromParameter } from '../utils/optionalArgumentHelpers';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getCurrentTheme } from 'owa-suite-theme';

export default function getHeaderImageData(
    themeId?: string,
    isDarkTheme?: boolean
): HeaderImageData {
    if (isFeatureEnabled('fwk-suiteThemes')) {
        const theme = getCurrentTheme();
        if (theme) {
            return {
                primary: theme.BackgroundImageUrl,
                repeat: theme.BackgroundImageRepeat !== false,
            };
        } else {
            return {};
        }
    } else {
        themeId = getThemeIdFromParameter(themeId);

        const {
            primary = undefined,
            staticBg = undefined,
            repeat = true,
            emptyStateBg = undefined,
            emptyStateImgUrl = undefined,
        } = getResourcesForTheme(themeId, isDarkTheme).headerImages || {};

        return {
            primary: resolveImageUrl(primary),
            staticBg: resolveImageUrl(staticBg),
            emptyStateBg: resolveImageUrl(emptyStateBg),
            emptyStateImgUrl: emptyStateImgUrl,
            repeat,
        };
    }

    function resolveImageUrl(url?: string) {
        return url && getOwaResourceImageUrl(`themes/${themeId}/${url}`);
    }
}

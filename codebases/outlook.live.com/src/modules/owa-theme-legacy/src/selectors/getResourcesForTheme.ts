import normalizeThemeId from '../utils/normalizeThemeId';
import type { ThemeResources } from 'owa-theme-shared';
import {
    getThemeIdFromParameter,
    getIsDarkThemeFromParameter,
} from '../utils/optionalArgumentHelpers';
import { fetchThemeResource } from './fetchThemeResource';
import { shouldUseCobranding, getCobrandingThemeResources } from 'owa-theme-common';
import { computedFn } from 'mobx-utils/lib/computedFn';

const createResourcesForTheme = computedFn(
    (normalizedTheme: string, isDarkTheme: boolean): ThemeResources => {
        if (shouldUseCobranding(normalizedTheme, isDarkTheme)) {
            return getCobrandingThemeResources();
        }

        return fetchThemeResource(normalizedTheme, isDarkTheme) as ThemeResources;
    }
);

export default function getResourcesForTheme(
    themeId?: string,
    isDarkTheme?: boolean
): ThemeResources {
    themeId = getThemeIdFromParameter(themeId);
    isDarkTheme = getIsDarkThemeFromParameter(isDarkTheme);
    const normalizedTheme = normalizeThemeId(themeId);

    return createResourcesForTheme(normalizedTheme, isDarkTheme);
}

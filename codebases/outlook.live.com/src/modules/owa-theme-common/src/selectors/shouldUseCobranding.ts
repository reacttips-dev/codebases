import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { isTenantThemeDataAvailable } from './isTenantThemeDataAvailable';

export function shouldUseCobranding(themeId: string, isDarkTheme: boolean): boolean {
    return (
        themeId === 'base' &&
        !isDarkTheme &&
        isTenantThemeDataAvailable() &&
        !isHostAppFeatureEnabled('loadThemeFromHostApp')
    );
}

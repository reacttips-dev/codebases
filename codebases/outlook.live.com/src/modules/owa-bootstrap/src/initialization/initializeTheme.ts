import { getOpxHostApi } from 'owa-opx';
import { markFunction } from 'owa-performance';
import { hasQueryStringParameter } from 'owa-querystring';
import { getUserConfiguration } from 'owa-session-store';
import { loadInitialTheme as loadInitialThemeLegacy } from 'owa-theme-legacy';
import { loadInitialTheme as loadInitialThemeSuite } from 'owa-suite-theme';
import { initializeIsMsHighContrastState } from 'owa-high-contrast';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import type { UserTheme } from '@suiteux/suiteux-shell';
import { lazyIsDarkTheme, lazyRegisterIsDarkThemeOnChangeHandler } from 'owa-metaos-app-bootstrap';
import { OwaPalette } from 'owa-theme-shared';

let isInitializeThemeRunningFirstTime = true;
export default markFunction(async function initializeTheme() {
    const userConfig = getUserConfiguration();
    const userOptions = userConfig?.UserOptions;
    let isDarkTheme = !!userOptions?.IsDarkModeTheme;
    let themeStorageId = userOptions?.ThemeStorageId;
    let themesAllowed = !!userConfig?.SegmentationSettings?.Themes;
    let palette: OwaPalette | undefined = undefined;

    if (isHostAppFeatureEnabled('loadThemeFromHostApp')) {
        const opxHostApi = getOpxHostApi();
        isDarkTheme = (await opxHostApi.isDarkTheme()) || false;
        themeStorageId = 'base';
        themesAllowed = true;
        palette = hasQueryStringParameter('useOwaTheme')
            ? undefined
            : await opxHostApi.getOpxPalette(isDarkTheme);

        if (isInitializeThemeRunningFirstTime) {
            opxHostApi.registerThemeChangedHandler(initializeTheme);
        }
    } else if (isHostAppFeatureEnabled('platformAppSdk')) {
        isDarkTheme = await lazyIsDarkTheme.importAndExecute();

        // In certain MetaOS hubs we want to disable the accent colors (of buttons/links/etc) that the user might have set,
        // to better match the hub's theme which doesn't support them (e.g. in Outlook win32), so we use the base theme.
        if (isHostAppFeatureEnabled('useBaseTheme')) {
            themeStorageId = 'base';
        }

        if (isInitializeThemeRunningFirstTime) {
            lazyRegisterIsDarkThemeOnChangeHandler.importAndExecute(initializeTheme);
        }
    }

    if (
        isFeatureEnabled('fwk-suiteThemes') &&
        userConfig.UserThemeJson &&
        !isHostAppFeatureEnabled('useBaseTheme')
    ) {
        loadInitialThemeSuite(
            JSON.parse(userConfig.UserThemeJson) as UserTheme,
            isDarkTheme,
            // TODO (SuiteThemes): Where is this value stored?
            true,
            palette
        );
    } else {
        await loadInitialThemeLegacy(themeStorageId, isDarkTheme, themesAllowed, palette);
    }

    if (isInitializeThemeRunningFirstTime) {
        initializeIsMsHighContrastState();
        isInitializeThemeRunningFirstTime = false;
    }
}, 'ti');

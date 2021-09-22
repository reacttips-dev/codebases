import type { ThemeResources } from 'owa-theme-shared';
import { getUserConfiguration } from 'owa-session-store';
import { isTenantThemeDataAvailable } from '../index';
import { BASE_LIGHT_THEME_PALETTE } from '../resources/baseLightThemePalette';
import { computed } from 'mobx';

// baseLightThemeResources is declared as a file-scope const object to provide a stable return value,
// eliminating wasted renders when the undefined resources clause is encountered below.
const baseLightThemeResources = { themePalette: BASE_LIGHT_THEME_PALETTE };

const computeCobrandingThemeResources = computed(
    (): ThemeResources => {
        if (!isTenantThemeDataAvailable()) {
            return baseLightThemeResources;
        }

        let {
            ThemePrimary,
            ThemeSecondary,
            ThemeTertiary,
            ThemeDark,
            ThemeDarkAlt,
            ThemeDarker,
            ThemeLight,
            ThemeLightAlt,
            ThemeLighter,
            HeaderText,
            NavBarBackground,
        } = getUserConfiguration().TenantThemeData!;

        return {
            themePalette: {
                themePrimary: ThemePrimary!,
                themeSecondary: ThemeSecondary!,
                themeTertiary: ThemeTertiary!,
                themeDark: ThemeDark!,
                themeDarkAlt: ThemeDarkAlt!,
                themeDarker: ThemeDarker!,
                themeLight: ThemeLight!,
                themeLighterAlt: ThemeLightAlt!,
                themeLighter: ThemeLighter!,

                // TODO: should we adjust these for the various values, such as search values?
                headerBackground: NavBarBackground!,
                headerBackgroundSearch: NavBarBackground!,
                headerBrandText: HeaderText!,
                headerTextIcons: HeaderText!,
                headerSearchBoxBackground: 'rgba(255,255,255,.7)',
                headerSearchBoxIcon: ThemeDarker!,
                headerSearchPlaceholderText: ThemeDarker!,
                headerSearchButtonBackground: ThemePrimary!,
                headerSearchButtonBackgroundHover: ThemeDarker!,
                headerSearchButtonIcon: HeaderText!,
                headerSearchFilters: ThemePrimary!,
                headerSearchFiltersHover: ThemeDarker!,
                headerButtonsBackground: NavBarBackground!,
                headerButtonsBackgroundHover: ThemeDark!,
                headerButtonsBackgroundSearch: NavBarBackground!,
                headerButtonsBackgroundSearchHover: ThemeDark!,
                headerBadgeBackground: ThemeDarker!,
                headerBadgeText: HeaderText!,
                headerSearchIcon: HeaderText!,
                searchBoxBackground: 'rgba(255,255,255,.7)',
            },
        };
    }
);

export function getCobrandingThemeResources() {
    return computeCobrandingThemeResources.get();
}

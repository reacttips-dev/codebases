import type { OwaPalette } from 'owa-theme-shared';
import type { UserTheme, BaseTheme } from '@suiteux/suiteux-shell';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { BASE_LIGHT_THEME_PALETTE, BASE_DARK_THEME_PALETTE } from 'owa-theme-common';

export function generateOwaPaletteFromSuitePalette(
    userTheme?: UserTheme,
    isDarkTheme: boolean = getIsDarkTheme()
): OwaPalette {
    if (!userTheme) {
        return isDarkTheme ? BASE_DARK_THEME_PALETTE : BASE_LIGHT_THEME_PALETTE;
    }
    const theme: BaseTheme = isDarkTheme ? userTheme.DarkTheme ?? userTheme : userTheme;
    const palette = {
        themePrimary: theme.Primary,
        themeSecondary: theme.Secondary,
        themeTertiary: theme.Tertiary,
        themeDark: theme.Dark,
        themeDarkAlt: theme.DarkAlt,
        themeDarker: theme.Darker,
        themeLight: theme.Light,
        themeLighterAlt: theme.LighterAlt,
        themeLighter: theme.Lighter,

        headerBackground: theme.NavBar,
        headerBackgroundSearch: theme.SearchNavBar,
        headerBrandText: theme.AppName,
        headerTextIcons: theme.DefaultText,
        headerSearchBoxBackground: (theme as any).SearchBoxBackground,
        headerSearchBoxIcon: theme.Darker,
        headerSearchPlaceholderText: theme.Darker,
        headerSearchButtonBackground: theme.Primary,
        headerSearchButtonBackgroundHover: theme.Darker,
        headerSearchButtonIcon: theme.DefaultText,
        headerSearchFilters: theme.Primary,
        headerSearchFiltersHover: theme.Darker,
        headerButtonsBackground: theme.NavBar,
        headerButtonsBackgroundHover: theme.Dark,
        headerButtonsBackgroundSearch: theme.NavBar,
        headerButtonsBackgroundSearchHover: theme.Dark,
        headerBadgeBackground: theme.Darker,
        headerBadgeText: theme.DefaultText,
        headerSearchIcon: theme.DefaultText,
        searchBoxBackground: (theme as any).SearchBoxBackground,
    };

    const basePalette = isDarkTheme ? BASE_DARK_THEME_PALETTE : BASE_LIGHT_THEME_PALETTE;
    for (const key of Object.keys(BASE_LIGHT_THEME_PALETTE)) {
        if (palette[key] === undefined) {
            palette[key] = basePalette[key];
        }
    }

    return palette;
}

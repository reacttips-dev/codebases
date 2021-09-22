import { getUserConfiguration } from 'owa-session-store';
import { isTenantThemeDataAvailable } from 'owa-theme-common';
import type { UserTheme } from '@suiteux/suiteux-shell';
import type TenantThemeData from 'owa-service/lib/contract/TenantThemeData';

export function getCobrandingUserTheme(): UserTheme | null {
    if (!isTenantThemeDataAvailable()) {
        return null;
    }

    let {
        ThemePrimary: Primary,
        ThemeSecondary: Secondary,
        ThemeTertiary: Tertiary,
        ThemeDark: Dark,
        ThemeDarkAlt: DarkAlt,
        ThemeDarker: Darker,
        ThemeLight: Light,
        ThemeLightAlt: LighterAlt,
        ThemeLighter: Lighter,
        HeaderText,
        NavBarBackground,
    } = getUserConfiguration().TenantThemeData! as Required<TenantThemeData>;

    return {
        Id: 'base',
        NavBar: NavBarBackground,
        AppName: HeaderText,
        DefaultText: HeaderText,
        Primary,
        Secondary,
        Tertiary,
        Dark,
        DarkAlt,
        Darker,
        Light,
        LighterAlt,
        Lighter,
    };
}

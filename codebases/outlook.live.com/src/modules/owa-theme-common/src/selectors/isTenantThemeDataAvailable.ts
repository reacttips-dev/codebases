import { getUserConfiguration } from 'owa-session-store';

export function isTenantThemeDataAvailable(): boolean {
    const { TenantThemeData } = getUserConfiguration();

    return !!(
        TenantThemeData?.HeaderText &&
        TenantThemeData.NavBarBackground &&
        TenantThemeData.O365Logo &&
        TenantThemeData.ThemePrimary &&
        TenantThemeData.ThemeSecondary &&
        TenantThemeData.ThemeTertiary &&
        TenantThemeData.ThemeDark &&
        TenantThemeData.ThemeDarkAlt &&
        TenantThemeData.ThemeDarker &&
        TenantThemeData.ThemeLight &&
        TenantThemeData.ThemeLightAlt &&
        TenantThemeData.ThemeLighter
    );
}

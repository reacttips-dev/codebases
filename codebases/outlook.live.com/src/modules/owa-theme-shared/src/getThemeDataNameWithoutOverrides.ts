export function getThemeDataNameWithoutOverrides(themeId: string, isDarkTheme: boolean): string {
    return `${themeId}${isDarkTheme ? '.dark' : ''}`;
}

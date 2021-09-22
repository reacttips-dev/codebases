import { action } from 'satcheljs';

export default action(
    'LOAD_OWA_THEME',
    (themeId: string, isDarkTheme?: boolean, themesAllowed?: boolean) => ({
        themeId,
        isDarkTheme,
        themesAllowed,
    })
);

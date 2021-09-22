import { fetchThemeFile, ThemeConstants, OwaPalette } from 'owa-theme-shared';
import { getThemeDataName } from '../utils/getThemeDataName';
import loadTheme from '../actions/loadTheme';
import { normalizeThemeRequest } from '../utils/normalizeThemeId';
import { setItem } from 'owa-local-storage';
import { store } from '../store/store';
import { addThemeData } from '../mutators/addThemeData';
import { mergeThemePalette } from '../mutators/mergeThemePalette';
import { isEdgeThemeEnabled } from '../selectors/getAllThemeIds';

export async function loadInitialTheme(
    themeStorageId: string | undefined,
    darkMode: boolean,
    themesAllowed: boolean,
    palette?: OwaPalette
) {
    let { themeId, isDarkTheme } = normalizeThemeRequest(themeStorageId, darkMode, themesAllowed);
    if (!isEdgeThemeEnabled(themeId)) {
        themeId = ThemeConstants.BASE_THEME_ID;
    }

    const themeDataName = getThemeDataName(themeId, isDarkTheme);

    setItem(window, ThemeConstants.LOCAL_STORAGE_KEY, themeDataName);

    const themeResources =
        (await fetchThemeFile(themeDataName, 'sd')) ||
        store.themeData.get(ThemeConstants.BASE_THEME_ID)!;

    if (palette) {
        mergeThemePalette(themeResources, palette);
    }
    addThemeData(themeDataName, themeResources);
    loadTheme(themeId, isDarkTheme, themesAllowed);
}

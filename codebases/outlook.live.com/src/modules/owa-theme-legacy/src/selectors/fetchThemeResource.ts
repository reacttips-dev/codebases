import { store } from '../store/store';
import { addThemeData } from '../mutators/addThemeData';
import { getThemeDataName } from '../utils/getThemeDataName';
import { fetchThemeFile, ThemeResources, ThemeConstants } from 'owa-theme-shared';

export function fetchThemeResource(themeId: string, isDarkTheme: boolean): ThemeResources {
    let themeDataName = getThemeDataName(themeId, isDarkTheme);
    if (store.themeData.has(themeDataName)) {
        return store.themeData.get(themeDataName)!;
    } else {
        fetchThemeFile(themeDataName).then(themeData => {
            addThemeData(themeDataName, themeData);
        });
        // The base theme resources are added to the store at initialization
        return store.themeData.get(ThemeConstants.BASE_THEME_ID)!;
    }
}

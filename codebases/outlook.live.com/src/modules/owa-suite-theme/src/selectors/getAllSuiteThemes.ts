import type { UserTheme } from '@suiteux/suiteux-shell';
import { mutatorAction } from 'satcheljs';
import { getSuiteThemeStore } from '../store/suiteThemeStore';
import { isUserPersonalizationAllowed } from 'owa-theme-common';

export function getAllSuiteThemes(): Readonly<UserTheme[]> | undefined {
    if (!getSuiteThemeStore().allThemes) {
        window.O365Shell?.Theme?.GetAllThemes(themes => {
            (themes as UserTheme[]).sort(({ Order: a }, { Order: b }) => (a || 0) - (b || 0));
            setThemesInStore(themes);
        });
    }

    const userThemesAllowed = isUserPersonalizationAllowed();

    // In the shell response, base theme and contrast themes will be marked with RequiresTenantPermission as false. Other themes do not have this RequiresTenantPermission field.
    return getSuiteThemeStore().allThemes?.filter(
        theme => userThemesAllowed || theme.RequiresTenantPermission === false
    );
}

const setThemesInStore = mutatorAction('loadSuiteThemes', (themes: UserTheme[]) => {
    getSuiteThemeStore().allThemes = themes;
});

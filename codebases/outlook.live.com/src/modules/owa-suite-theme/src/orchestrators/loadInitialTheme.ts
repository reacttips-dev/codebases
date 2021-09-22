import type { OwaPalette } from 'owa-theme-shared';
import type { UserTheme } from '@suiteux/suiteux-shell';
import { setTheme, setDarkMode } from './setTheme';
import { getSuiteThemeStore } from '../store/suiteThemeStore';
import { mutatorAction } from 'satcheljs';

export function loadInitialTheme(
    userTheme: UserTheme,
    darkMode: boolean,
    isOfficeThemePreferred: boolean,
    palette?: OwaPalette
) {
    setDarkMode(darkMode);
    setCustomPaletteInStore(palette);
    setTheme(userTheme, isOfficeThemePreferred, palette);
}

const setCustomPaletteInStore = mutatorAction('setCustomPalette', (palette?: OwaPalette) => {
    getSuiteThemeStore().customPalette = palette;
});

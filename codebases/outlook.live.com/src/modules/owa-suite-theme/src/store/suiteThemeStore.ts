import { createStore } from 'satcheljs';
import type { SuiteThemeStore } from './schema/SuiteThemeStore';
import { generateOwaPaletteFromSuitePalette } from '../utils/generateOwaPaletteFromSuitePalette';
import { BASE_LIGHT_THEME_PALETTE } from 'owa-theme-common';

const initialStore: SuiteThemeStore = {
    currentTheme: { Id: 'base', Primary: BASE_LIGHT_THEME_PALETTE.themePrimary },
    isOfficeThemePreferred: false,
    get currentPalette() {
        return {
            ...generateOwaPaletteFromSuitePalette(getSuiteThemeStore().currentTheme),
            ...getSuiteThemeStore().customPalette,
        };
    },
    customPalette: {},
    allThemes: undefined,
};
export const getSuiteThemeStore = createStore('suiteThemeStore', initialStore);

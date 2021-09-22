import { getCurrentTheme } from '../selectors/getCurrentTheme';
import { getSuiteThemeStore } from '../store/suiteThemeStore';
import { generateOwaPaletteFromSuitePalette } from '../utils/generateOwaPaletteFromSuitePalette';
import type { UserTheme, UserThemeId } from '@suiteux/suiteux-shell';
import { changeTheme as changeFabricTheme, getIsDarkTheme } from 'owa-fabric-theme';
import { setItem } from 'owa-local-storage';
import { onLoadTheme } from 'owa-theme-common';
import type { OwaPalette } from 'owa-theme-shared';
import { mutatorAction } from 'satcheljs';
import {
    LOCAL_STORAGE_THEME_KEY,
    LOCAL_STORAGE_MODE_KEY,
    LOCAL_STORAGE_OFFICE_THEME_PREFERRED_KEY,
} from '../constants';

export function setTheme(
    theme: UserTheme,
    isOfficeThemePreferred: boolean,
    customizedPalette?: OwaPalette
) {
    theme = {
        ...theme,
        // TODO (SuiteThemes)
        // For whatever reason, the image URL returned from the Suite API has a hash value in it that doesn't match the deployed resources
        BackgroundImageUrl: theme.BackgroundImageUrl?.replace(
            /(\w+)\.\w+\.(\w+)$/,
            (match, themeName, extension) => `${themeName}.${extension}`
        ),
    };

    setItem(window, LOCAL_STORAGE_THEME_KEY, JSON.stringify(theme));
    setItem(
        window,
        LOCAL_STORAGE_OFFICE_THEME_PREFERRED_KEY,
        JSON.stringify(isOfficeThemePreferred)
    );

    setThemeInternal(theme, getIsDarkTheme(), customizedPalette || {});

    theme &&
        window.O365Shell?.Theme?.SetUserThemeId(theme.Id as UserThemeId, isOfficeThemePreferred);
    setThemeInStore(theme, isOfficeThemePreferred);
}

export function setDarkMode(isDarkMode: boolean) {
    setItem(window, LOCAL_STORAGE_MODE_KEY, JSON.stringify(isDarkMode));
    setThemeInternal(getCurrentTheme(), isDarkMode, {});
}

function setThemeInternal(theme: UserTheme, isDarkMode: boolean, customizedPalette: OwaPalette) {
    const suitePalette = generateOwaPaletteFromSuitePalette(theme, isDarkMode);
    const fallbackSuitePalette = generateOwaPaletteFromSuitePalette(theme, false);
    const palette = mergePalette(suitePalette, customizedPalette);
    const fallbackPalette = mergePalette(fallbackSuitePalette, customizedPalette);
    changeFabricTheme(palette, isDarkMode);

    Object.keys(palette).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, palette[key]!);
    });

    Object.keys(fallbackPalette).forEach(key => {
        document.documentElement.style.setProperty(`--fallback-${key}`, fallbackPalette[key]!);
    });
    onLoadTheme();
}

function mergePalette(originalPalette: OwaPalette, customizedPalette: OwaPalette): OwaPalette {
    return { ...originalPalette, ...customizedPalette };
}

const setThemeInStore = mutatorAction(
    'setSuiteUserTheme',
    (theme: UserTheme, isOfficeThemePreferred: boolean) => {
        getSuiteThemeStore().currentTheme = theme;
        getSuiteThemeStore().isOfficeThemePreferred = isOfficeThemePreferred;
    }
);

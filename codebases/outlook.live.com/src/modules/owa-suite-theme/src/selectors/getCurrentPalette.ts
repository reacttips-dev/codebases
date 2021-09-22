import type { OwaPalette } from 'owa-theme-shared';
import { getSuiteThemeStore } from '../store/suiteThemeStore';

export function getCurrentPalette(): Readonly<OwaPalette> {
    return getSuiteThemeStore().currentPalette;
}

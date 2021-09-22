import type { OwaPalette } from 'owa-theme-shared';
import { getPalette as getPaletteLegacy } from 'owa-theme-legacy';
import { shouldUseSuiteThemes } from './shouldUseSuiteThemes';
import { getCurrentPalette } from 'owa-suite-theme';
import { isCssVariablesSupported } from 'owa-theme-common';
import { computed } from 'mobx';

const computedCssVariablesPalette = computed(
    (): OwaPalette => {
        const palette = getCurrentPalette();
        const variablesPalette: OwaPalette = {};
        Object.keys(palette).forEach(key => {
            variablesPalette[key] = `var(--${key})`;
        });

        return variablesPalette;
    }
);

export function getPalette(): OwaPalette {
    if (shouldUseSuiteThemes()) {
        if (isCssVariablesSupported()) {
            return computedCssVariablesPalette.get();
        }

        return getCurrentPalette();
    }

    return getPaletteLegacy();
}

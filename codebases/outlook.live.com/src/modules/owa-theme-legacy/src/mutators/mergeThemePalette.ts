import { mutatorAction } from 'satcheljs';
import type { OwaPalette, ThemeResources } from 'owa-theme-shared';

export const mergeThemePalette = mutatorAction(
    'mergeThemePalette',
    (themeData: ThemeResources, palette: OwaPalette) => {
        themeData.themePalette = { ...themeData.themePalette, ...palette };
    }
);

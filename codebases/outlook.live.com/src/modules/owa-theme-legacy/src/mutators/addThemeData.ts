import { mutatorAction } from 'satcheljs';
import type { ThemeResources } from 'owa-theme-shared';
import { store } from '../store/store';

export const addThemeData = mutatorAction(
    'addThemeData',
    (themeDataName: string, themeData: ThemeResources | null) => {
        // don't add the theme if we already have the resources or if the resource are null
        if (!store.themeData.get(themeDataName) && themeData) {
            store.themeData.set(themeDataName, themeData);
        }
    }
);

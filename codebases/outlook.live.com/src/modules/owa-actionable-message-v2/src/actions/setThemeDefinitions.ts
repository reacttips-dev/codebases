import setThemeForKey from './setThemeForKey';
import setThemeLoadStatus from './setThemeLoadStatus';
import ThemeLoadStatus from '../store/schema/ThemeLoadStatus';
import { trace } from 'owa-trace';
import type Theme from '../store/schema/Theme';

/**
 * @function
 * Method used to store the theme json URL mappings in the store.
 * @param { [index: string]: Theme } [themes] Stores the theme json URL mappings in the Theme store.
 * Fetched from getThemeDefinitions {owa-connectors}
 * @returns Nothing
 */

const setThemeDefinitions = (themes: { [index: string]: Theme }): void => {
    if (themes) {
        Object.keys(themes).forEach((key: string) => {
            setThemeForKey(key, themes[key]);
        });
        setThemeLoadStatus(ThemeLoadStatus.Succeeded);
    } else {
        trace.info('Error in getting theme definitions: null value returned');
        setThemeLoadStatus(ThemeLoadStatus.Failed);
    }
};

export default setThemeDefinitions;

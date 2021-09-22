import { getPackageBaseUrl } from 'owa-config';
import type ThemeResources from './ThemeResources';
import { addBottleneck } from 'owa-performance';
import { BASE_THEME_ID } from './themeConstants';

const themeFetchPromises: { [themeName: string]: Promise<ThemeResources> } = {};

export async function fetchThemeFile(
    themeDataName: string,
    themeSource?: string
): Promise<ThemeResources | null> {
    // if the theme is the base theme, we don't need to fetch it since it is already included
    // with the boot javascript
    if (themeDataName == BASE_THEME_ID) {
        return null;
    }

    const fetchAndLoad = async () => {
        try {
            let response = await fetch(
                `${getPackageBaseUrl()}resources/theme/fabric.color.variables.theme.${themeDataName.toLowerCase()}.json`
            );
            // disabling tslint rule as we need to await here
            // for the catch block to work properly
            // https://github.com/palantir/tslint/issues/3933
            // tslint:disable-next-line:no-return-await
            return await response.json();
        } catch (err) {
            return null;
        }
    };

    let resourcePromise = themeFetchPromises[themeDataName];
    if (!resourcePromise) {
        resourcePromise = themeFetchPromises[themeDataName] = fetchAndLoad();
        addBottleneck('tm_s', themeSource || 'n/a');
    }
    return resourcePromise;
}

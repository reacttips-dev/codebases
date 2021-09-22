import { getCurrentLazyDensity } from 'owa-fabric-densities';
import { changeDensity } from 'owa-fabric-theme';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getOpxHostApi } from 'owa-opx';
import type DisplayDensityMode from 'owa-service/lib/contract/DisplayDensityMode';
import { getUserDisplayDensityMode } from 'owa-session-store';

export default async function initializeDensity() {
    const defaultDensityMode = 'Full';
    if (isHostAppFeatureEnabled('loadThemeFromHostApp')) {
        // preserve legacy density behavior in OPX (always Full) instead of referencing user setting,
        // which could lead to unexpected changes that are incompatible with existing host-app expecations
        //
        // host apps can optionally specify a preferred density, which will take precedence over the default
        const opxHostApi = getOpxHostApi();
        opxHostApi.registerThemeChangedHandler(
            (isDarkTheme: boolean, densityMode: DisplayDensityMode | undefined) => {
                internalLoadDensity(densityMode || defaultDensityMode);
            }
        );

        internalLoadDensity((await opxHostApi.getOpxDensityMode()) || defaultDensityMode);
    } else {
        // reference user setting for preferred density
        internalLoadDensity(getUserDisplayDensityMode() || defaultDensityMode);
    }
}

async function internalLoadDensity(selectedDensityMode: DisplayDensityMode) {
    const lazyDensity = getCurrentLazyDensity(selectedDensityMode);
    if (lazyDensity) {
        const density = await lazyDensity.import();
        changeDensity(selectedDensityMode, density);
    }
}

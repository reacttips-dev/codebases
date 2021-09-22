import { lazyFullDensity } from './lazyFullDensity';
import { lazyMediumDensity } from './lazyMediumDensity';
import { lazyCompactDensity } from './lazyCompactDensity';

export function getCurrentDensityWithoutFlight(selectedDensityMode: string | undefined) {
    return selectedDensityMode === 'Compact'
        ? lazyCompactDensity
        : selectedDensityMode === 'Simple'
        ? lazyMediumDensity
        : lazyFullDensity;
}

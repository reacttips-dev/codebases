import { lazyFullDensity } from './lazyFullDensity';

// TODO WI 116002: use getCurrentDensity in the future when we configure the styles for fluent controls
export default function getCurrentLazyDensity(selectedDensityMode?: string | undefined) {
    return lazyFullDensity;
}

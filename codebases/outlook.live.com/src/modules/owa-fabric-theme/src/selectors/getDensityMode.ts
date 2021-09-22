import store from '../store/store';
import type { DensityMode } from '../store/schema/ExtendedTheme';

/**
 * Look up current density mode used to style UX content for the user
 *
 * This is agnostic of backing storage or config, which can vary by runtime context (e.g. OWA, OPX, etc)
 */
export default function getDensityMode(): DensityMode {
    return store().densityMode;
}

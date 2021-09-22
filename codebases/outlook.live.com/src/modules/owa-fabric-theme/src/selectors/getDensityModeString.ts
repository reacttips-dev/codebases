import getDensityMode from './getDensityMode';
import { assertNever } from 'owa-assert';

/**
 * Look up current density mode string used to style UX content for the user
 *
 * This is agnostic of backing storage or config, which can vary by runtime context (e.g. OWA, OPX, etc)
 */
export default function getDensityModeString(): string {
    const densityMode = getDensityMode();

    switch (densityMode) {
        case 'Full':
            return 'full';
        case 'Simple':
            return 'medium';
        case 'Compact':
            return 'compact';
        default:
            assertNever(densityMode);
    }
}

import { action } from 'satcheljs/lib/legacy';
import type {
    default as AmpViewState,
    AMPAvailability,
} from 'owa-mail-amp-store/lib/store/schema/AmpViewState';

export default action('updateAmpAvailability')(function updateAmpAvailability(
    ampViewState: AmpViewState,
    ampAvailability: AMPAvailability
) {
    ampViewState.ampAvailability = ampAvailability;
});

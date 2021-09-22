import { action } from 'satcheljs/lib/legacy';
import type PersonaControlViewState from '../store/schema/PersonaControlViewState';

/**
 * Sets is pending fetch
 * @param personaViewState the persona view state
 * @param isPendingFetch flag indicating whether the fetch is pending
 */
export default action('setIsPendingFetch')(function setIsPendingFetch(
    personaViewState: PersonaControlViewState,
    isPendingFetch: boolean
) {
    personaViewState.personaBlob.isPendingFetch = isPendingFetch;
});

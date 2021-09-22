import { action } from 'satcheljs/lib/legacy';
import store from '../store/Store';
import downloadPersonaPhoto from './downloadPersonaPhoto';

/**
 * Refreshes photos for the persona in question.
 * @param email Email of the persona
 * @param personaId PersonaId of the persona
 */
export default action('refreshPersonaPhoto')((email: string, personaId?: string) => {
    // Find all entries with matching email or personaId
    store.viewStates.forEach(viewState => {
        if (
            (email && viewState.emailAddress === email) ||
            (personaId && viewState.personaId === personaId)
        ) {
            downloadPersonaPhoto(viewState, true);
        }
    });
});

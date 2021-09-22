import substrateSuggestions from '../services/substrateSuggestions';
import { action } from 'satcheljs/lib/legacy';
import { getUserMailboxInfo } from 'owa-client-ids';

export default action('execute3SPrimeCall')(function execute3SPrimeCall() {
    // Execute the 3S prime call
    substrateSuggestions(
        getUserMailboxInfo().userIdentity,
        null /*queryString*/,
        false /*includeDirectory*/
    );
});

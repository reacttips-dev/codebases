import type PersonaType from 'owa-service/lib/contract/PersonaType';
import rcStore from '../store/store';
import { action } from 'satcheljs/lib/legacy';
import getKeyForSuggestion from 'owa-3s-local/lib/actions/getKeyForSuggestion';

export default action('addToCache')(function addToCache(people: PersonaType[]) {
    if (
        !people ||
        people.length == 0 ||
        // Only operate on the recipient cache if it's been initialized
        rcStore.recipientCache === null
    ) {
        return;
    }

    people.forEach(x => {
        // Should not cache LinkedIn results
        if (x.PersonaTypeString != 'LinkedIn') {
            let suggestionKey = getKeyForSuggestion(x);
            if (suggestionKey && !rcStore.allKeys[suggestionKey]) {
                const cachePersona = {
                    ...x,
                    sessionAdd: true,
                };
                rcStore.recipientCache.push(cachePersona);
                rcStore.allKeys[suggestionKey] = true;
            }
        }
    });
});

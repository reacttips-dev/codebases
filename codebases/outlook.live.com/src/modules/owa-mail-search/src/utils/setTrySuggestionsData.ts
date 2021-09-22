import { setItem } from 'owa-local-storage';
import { TRY_SUGGESTION_FIRST_SHOWN } from '../searchConstants';

export function setTrySuggestionFirstShown() {
    setItem(window, TRY_SUGGESTION_FIRST_SHOWN, Date.now().toString());
}

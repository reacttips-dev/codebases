import mailSearchStore from '../store/store';
import type { SearchProvider } from 'owa-search-service';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('setSearchProvider', (provider: SearchProvider): void => {
    mailSearchStore.provider = provider;
});

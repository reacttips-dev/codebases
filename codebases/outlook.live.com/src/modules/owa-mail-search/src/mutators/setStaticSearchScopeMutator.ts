import { setStaticSearchScope } from '../actions/publicActions';
import { getStore } from '../store/store';
import type { SearchScope } from 'owa-search-service';
import { mutator } from 'satcheljs';

export default mutator(setStaticSearchScope, actionMessage => {
    const searchScope: SearchScope = actionMessage.searchScope;
    getStore().staticSearchScope = searchScope;
});

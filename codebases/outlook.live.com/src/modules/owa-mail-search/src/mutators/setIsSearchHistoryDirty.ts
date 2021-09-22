import mailSearchStore from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('setIsSearchHistoryDirty', (isSearchHistoryDirty: boolean): void => {
    mailSearchStore.isSearchHistoryDirty = isSearchHistoryDirty;
});

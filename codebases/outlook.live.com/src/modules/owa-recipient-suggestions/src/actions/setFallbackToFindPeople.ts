import { mutatorAction } from 'satcheljs';
import store from '../store/store';

export default mutatorAction('setFallbackToFindPeople', (didFallbackToFindPeople: boolean) => {
    store.fallbackToFindPeople = didFallbackToFindPeople;
});

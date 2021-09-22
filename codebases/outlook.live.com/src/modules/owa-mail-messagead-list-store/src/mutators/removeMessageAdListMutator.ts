import { mutator } from 'satcheljs';
import store from '../store/store';
import removeMessageAdList from '../actions/removeMessageAdList';

export default mutator(removeMessageAdList, actionMessage => {
    store.showAdCount = actionMessage.remainingShowAdCount;
});

import store from '../store/store';

import { mutatorAction } from 'satcheljs';

export default mutatorAction('updateAllowedSenders', (allowedSenders: string[]) => {
    store.allowedSenders = allowedSenders;
});

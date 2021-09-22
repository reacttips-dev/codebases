import { mutator } from 'satcheljs';
import { cancelPoll } from '../actions/publicActions';
import { store } from '../store/store';

mutator(cancelPoll, actionMessage => {
    const req = store().currentRequest.get(actionMessage.requestIdentifier);
    if (!req) {
        return;
    }

    let timer = req.timer;
    clearTimeout(timer);
    req.timer = null;
});

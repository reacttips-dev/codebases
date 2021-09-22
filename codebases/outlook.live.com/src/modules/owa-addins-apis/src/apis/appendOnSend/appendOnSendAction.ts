import { mutatorAction } from 'satcheljs';
import type { AppendOnSend, AddinViewState } from '../../index';

export default mutatorAction(
    'appendOnSendAction',
    (viewState: AddinViewState, prop: AppendOnSend) => {
        const appendOnSend = viewState.appendOnSend;
        if (!appendOnSend) {
            return;
        }
        let foundAndReplaced = false;
        for (let i = 0; i < appendOnSend.length; i++) {
            if (appendOnSend[i].id === prop.id) {
                viewState.appendOnSend[i] = prop;
                foundAndReplaced = true;
                break;
            }
        }
        if (!foundAndReplaced) {
            viewState.appendOnSend.push(prop);
        }
    }
);

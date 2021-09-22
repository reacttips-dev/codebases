import { mutator } from 'satcheljs';
import { resetComposeItemId } from '../actions/smimeActions';

export default mutator(resetComposeItemId, actionMessage => {
    const { viewState } = actionMessage;
    viewState.itemId = null;
});

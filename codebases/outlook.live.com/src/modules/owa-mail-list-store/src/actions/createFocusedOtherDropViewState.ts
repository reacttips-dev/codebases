import { mutatorAction } from 'satcheljs';
import listViewStore from '../store/Store';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';

export default mutatorAction(
    'createFocusedOtherDropViewState',
    function createFocusedOtherDropViewState() {
        listViewStore.focusedOtherDropViewState = createDropViewState();
    }
);

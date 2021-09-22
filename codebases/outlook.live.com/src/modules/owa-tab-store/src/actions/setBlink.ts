import { mutatorAction } from 'satcheljs';
import type TabViewState from '../store/schema/TabViewState';

export default mutatorAction(
    'setBlink',
    function setBlink(viewState: TabViewState, blink: boolean) {
        viewState.blink = blink;
    }
);

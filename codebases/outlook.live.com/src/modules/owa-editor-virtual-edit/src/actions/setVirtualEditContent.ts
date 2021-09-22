import { mutatorAction } from 'satcheljs';
import type VirtualEditViewState from '../schema/VirtualEditViewState';

const setVirtualEditContent = mutatorAction(
    'setVirtualEditContent',
    (viewState: VirtualEditViewState, content: string | null) => {
        viewState.virtualEditContent = content;
    }
);

export default setVirtualEditContent;

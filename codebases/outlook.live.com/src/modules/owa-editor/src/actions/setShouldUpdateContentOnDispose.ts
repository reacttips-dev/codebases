import { mutatorAction } from 'satcheljs';
import type EditorViewState from '../store/schema/EditorViewState';

const setShouldUpdateContentOnDispose = mutatorAction(
    'SetShouldUpdateContentOnDispose',
    (viewState: EditorViewState, shouldUpdateContentOnDispose: boolean) => {
        viewState.shouldUpdateContentOnDispose = shouldUpdateContentOnDispose;
    }
);

export default setShouldUpdateContentOnDispose;

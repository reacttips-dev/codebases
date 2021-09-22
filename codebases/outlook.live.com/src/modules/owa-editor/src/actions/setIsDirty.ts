import { action } from 'satcheljs/lib/legacy';
import type EditorViewState from '../store/schema/EditorViewState';

export default action('setIsDirty')(function setIsDirty(
    viewState: EditorViewState,
    isDirty: boolean
) {
    viewState.isDirty = isDirty;
});

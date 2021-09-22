import type EditorViewState from '../store/schema/EditorViewState';
import operateContentInternal from './ContentOperator';

export default function triggerContentChangedEvent(
    viewState: EditorViewState,
    changeSource?: string
) {
    operateContentInternal(
        viewState,
        editor => {
            editor.triggerContentChangedEvent(changeSource || '');
        },
        null
    );
}

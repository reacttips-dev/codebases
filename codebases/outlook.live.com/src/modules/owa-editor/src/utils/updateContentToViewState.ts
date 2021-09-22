import operateContentInternal, { ContentOperator } from './ContentOperator';
import updateContent from '../actions/updateContent';
import type EditorViewState from '../store/schema/EditorViewState';

export default function updateContentToViewState(
    viewState: EditorViewState,
    contentOperator?: ContentOperator // TODO: 108089 Remove this parameter when root cause is fixed
) {
    operateContentInternal(
        viewState,
        htmlEditor => {
            updateContent(viewState, htmlEditor.getContent());
        },
        plainTextEditor => {
            updateContent(viewState, plainTextEditor.value);
        },
        false /*alwaysInvokeCallback*/,
        contentOperator
    );
}

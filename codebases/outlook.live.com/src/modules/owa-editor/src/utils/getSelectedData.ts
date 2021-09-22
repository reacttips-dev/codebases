import operateContentInternal from './ContentOperator';
import type EditorViewState from '../store/schema/EditorViewState';

export default function getSelectedData(viewState: EditorViewState) {
    let selectedData = null;

    operateContentInternal(
        viewState,
        htmlEditor => {
            const currentActiveSelectionRange = htmlEditor.getSelectionRange();
            if (currentActiveSelectionRange) {
                const clonedSelection = currentActiveSelectionRange.cloneContents();
                let div = htmlEditor.getDocument().createElement('div');
                div.appendChild(clonedSelection);

                selectedData = {
                    data: div.innerHTML,
                    sourceProperty: 'body',
                    startPosition: currentActiveSelectionRange.startOffset,
                    endPosition: currentActiveSelectionRange.endOffset,
                };
            }
        },
        plainTextEditor => {
            const { value, selectionStart, selectionEnd } = plainTextEditor;

            selectedData = {
                data: value.substring(selectionStart, selectionEnd),
                sourceProperty: 'body',
                startPosition: selectionStart,
                endPosition: selectionEnd,
            };
        }
    );

    return selectedData;
}

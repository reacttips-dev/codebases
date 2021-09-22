import type PasteOptionViewState from '../store/schema/PasteOptionViewState';

export default function createPasteOptionViewState(): PasteOptionViewState {
    return {
        position: null,
        subMenuSelectionIndex: -1,
    };
}

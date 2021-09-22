import type ItemPartViewState from './ItemPartViewState';

export enum FocusedItemArea {
    Item,
    Oof,
    FossilizedText,
    SeeMore,
}

interface FocusedItemPart {
    itemPart: ItemPartViewState;
    focusedItemArea: FocusedItemArea;
    shouldNotGrabFocus?: boolean;
}

export default FocusedItemPart;

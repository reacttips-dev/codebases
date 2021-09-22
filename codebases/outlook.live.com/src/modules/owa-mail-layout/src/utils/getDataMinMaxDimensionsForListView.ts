import { getListViewMaxWidth } from './getMaxWidths';
import {
    MIN_LIST_VIEW_WIDTH,
    MAX_LIST_VIEW_HEIGHT,
    MIN_LIST_VIEW_HEIGHT,
} from '../internalConstants';

interface DataMinMaxWidths {
    dataWidthMin: number;
    dataWidthMax: number;
    dataHeightMin: number;
    dataHeightMax: number;
}

/**
 * Gets the min and max values for the list view for resize purposes
 * User can resize the list view within these bounds.
 */
export function getDataMinMaxDimensionsForListView(): DataMinMaxWidths {
    return {
        dataWidthMin: MIN_LIST_VIEW_WIDTH,
        dataWidthMax: getListViewMaxWidth(),
        dataHeightMin: MIN_LIST_VIEW_HEIGHT,
        dataHeightMax: MAX_LIST_VIEW_HEIGHT,
    };
}

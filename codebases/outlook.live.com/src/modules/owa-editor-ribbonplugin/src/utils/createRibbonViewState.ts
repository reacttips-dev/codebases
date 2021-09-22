import type RibbonViewState from '../store/schema/RibbonViewState';
import createFormatState from './createFormatState';

export default function createRibbonViewState(): RibbonViewState {
    return {
        visibleItemCount: 0, // 0 Means all buttons are visible at beginning
        formatViewState: createFormatState(),
        targetPoint: null,
        buttonWidths: null,
    };
}

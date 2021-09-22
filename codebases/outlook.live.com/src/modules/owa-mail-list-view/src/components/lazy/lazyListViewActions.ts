import { action } from 'satcheljs/lib/legacy';
import { listViewStore } from 'owa-mail-list-store';
import throttle from 'lodash-es/throttle';

// Updates all the necessary information needed for the virtualized list view
export const updateMailItemHeights = action('updateMailItemHeights')(function updateMailItemHeights(
    rowKeys: string[],
    scrollTop: number,
    offsetHeight: number
): void {
    listViewStore.offsetHeight = offsetHeight;
    listViewStore.scrollTop = scrollTop;
    listViewStore.doNotVirtualize = false;
    for (var i = 0; i < rowKeys.length; i++) {
        const rowKey = rowKeys[i];
        const rowKeyElement = document.getElementById(rowKey);
        if (rowKeyElement) {
            listViewStore.rowInfoForVLV.set(rowKey, {
                rowHeight: rowKeyElement.offsetHeight,
                rowOffset: rowKeyElement.offsetTop,
            });
        }
    }
});

export const updateMailItemHeightsThrottled = throttle(
    (rowKeys: string[], scrollTop: number, offsetHeight: number) => {
        updateMailItemHeights(rowKeys, scrollTop, offsetHeight);
    },
    200
);

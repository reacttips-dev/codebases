import * as React from 'react';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { trace } from 'owa-trace';

const DRAG_HINT_CHECK_PERIOD_IN_MILLISECONDS = 3000;

export function useDragHelpers(setDataItemType: (newValue: string | null) => void) {
    // Sometimes the browser has a bug which doesn't send the dragLeave event when the drag is over.
    // So we need to repeatedly check whether to remove the drag hint after a certain time
    // before we receive dragLeave/drop event.
    const pendingDragHintRemover = React.useRef<number | null>();
    const lastDragOverTime = React.useRef<number>();

    const onDragOver = React.useCallback((dragInfo: DragData) => {
        lastDragOverTime.current = Date.now();
        if (!pendingDragHintRemover.current) {
            pendingDragHintRemover.current = window.setInterval(() => {
                trace.info('Check last DragOver time');
                // If we haven't received any dragOver event within the period, let's hide the drag hint.
                if (
                    !lastDragOverTime?.current ||
                    Date.now() - lastDragOverTime.current >= DRAG_HINT_CHECK_PERIOD_IN_MILLISECONDS
                ) {
                    setDataItemType(null);
                    clearPendingDragHintRemover();
                }
            }, DRAG_HINT_CHECK_PERIOD_IN_MILLISECONDS);
        }

        setDataItemType(dragInfo.itemType);
    }, []);

    const onDragLeave = React.useCallback(() => {
        trace.info('onDragLeave');
        setDataItemType(null);
        clearPendingDragHintRemover();
    }, []);

    const onDrop = React.useCallback((dragData: any) => {
        setDataItemType(null);
        clearPendingDragHintRemover();
    }, []);

    const clearPendingDragHintRemover = React.useCallback(() => {
        trace.info('clearPendingDragHintRemover');
        if (pendingDragHintRemover.current) {
            window.clearInterval(pendingDragHintRemover.current);
            pendingDragHintRemover.current = null;
        }
    }, []);

    return { onDragOver, onDragLeave, onDrop };
}

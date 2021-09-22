import { initializeTimePanelDataForDnd } from '../actions/timePanelDndStoreActions';
import { doNothingOnDrop } from '../utils/doNothingOnDrop';
import { observer } from 'mobx-react-lite';
import { DragData, DraggableItemTypes, Droppable } from 'owa-dnd';
import * as React from 'react';
import {
    getTimePanelDropState,
    isTimePanelDataInitialized,
} from '../selectors/timePanelDndStoreSelectors';

import * as styles from './TimePanelDropListener.scss';

export interface TimePanelDropListenerProps {
    children?: React.ReactNode;
}

/**
 * This component handles listening for items being dragged over Time Panel
 * and accordingly modifying the store to show the drop hint.
 */
export default observer(function TimePanelDropListener(props: TimePanelDropListenerProps) {
    const { children } = props;

    return (
        <Droppable
            classNames={styles.timePanelDropListener}
            dropViewState={getTimePanelDropState()}
            onDragEnter={onDragEnter}
            onDrop={doNothingOnDrop}
            canDrop={canDropItemType}
            greedy={true}>
            {children}
        </Droppable>
    );
});

function onDragEnter(dragInfo: DragData) {
    // `initializeTimePanelDataForDnd` takes care of initializing the time panel data for the out of view panel
    // We only need to do this when items are being dragged from outside the panel.
    if (dragInfo.itemType === DraggableItemTypes.MailListRow && !isTimePanelDataInitialized()) {
        initializeTimePanelDataForDnd();
    }
}

/* "global" canDrop for the Time Panel that accepts any DraggableItemType that is consumed by a component within Time Panel */
function canDropItemType(dragInfo: DragData): boolean {
    // If we are dragging an email item, allow drop
    // If we are dragging a task item, allow dragging because otherwise we get the no-drop-allowed effect when reordering tasks.
    // TODO VSO 66844: Remove owa-time-panel-dnd dependency on Todo panel specific information
    return (
        dragInfo.itemType === DraggableItemTypes.MailListRow ||
        dragInfo.itemType === DraggableItemTypes.Todo
    );
}

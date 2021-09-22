import { addDatapointConfig } from 'owa-analytics-actions';
import type { OwaDate } from 'owa-datetime';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import { getCurrentPanelViewType } from 'owa-time-panel-settings';
import { action } from 'satcheljs';
import {
    DropTarget,
    getTimePanelDndCustomData,
    timePanelDndOptions,
    CreateEntityFromMailItemDropCustomData,
} from '../datapoints';

export const createEventFromMailItemDrop = action(
    'createEventFromMailItemDrop',
    (dragData: MailListRowDragData, dropTarget: DropTarget, preFillStartTime?: OwaDate) =>
        addDatapointConfig(
            {
                name: 'timePanelActionCreateEventFromMailItemDrop',
                options: timePanelDndOptions,
                customData: getTimePanelDndCustomData<CreateEntityFromMailItemDropCustomData>({
                    dropTarget: dropTarget,
                    viewType: getCurrentPanelViewType(),
                }),
            },
            {
                dragData,
                dropTarget,
                preFillStartTime,
            }
        )
);

export const createTaskFromMailItemDrop = action(
    'createTaskFromMailItemDrop',
    (dragData: MailListRowDragData, dropTarget: DropTarget, folderId: string) =>
        addDatapointConfig(
            {
                name: 'timePanelActionCreateTaskFromMailItemDrop',
                options: timePanelDndOptions,
                customData: getTimePanelDndCustomData<CreateEntityFromMailItemDropCustomData>({
                    dropTarget: dropTarget,
                    viewType: getCurrentPanelViewType(),
                }),
            },
            {
                dragData,
                dropTarget,
                folderId,
            }
        )
);

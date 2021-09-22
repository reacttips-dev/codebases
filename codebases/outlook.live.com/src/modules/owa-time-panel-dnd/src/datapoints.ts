import { getMailAriaTenantTokens } from 'owa-analytics';
import type { CustomData } from 'owa-analytics-types';
import type { TimePanelSelectedViewType } from 'owa-time-panel-settings';

/* Custom data for dragging and dropping emails into the time panel to create meeting or task entities */
export interface CreateEntityFromMailItemDropCustomData {
    dropTarget: DropTarget;
    viewType: TimePanelSelectedViewType;
}

export type DropTarget =
    | 'TimePanelDropHint'
    | 'AgendaViewDropHint'
    | 'DayViewDropHint'
    | 'DayViewPreviewDropHint';

/** Log unsampled datapoints (i.e. for 100% of users) in the shared OWA tenant */
export const timePanelDndOptions = {
    isCore: true,
    tenantTokens: getMailAriaTenantTokens(),
};

/**
 * Generates custom data for Time Panel DND datapoints
 */
export function getTimePanelDndCustomData<TCustomData>(
    datapointSpecificCustomData?: CustomData & TCustomData
): CustomData & TCustomData {
    return datapointSpecificCustomData;
}

import { getTimePanelSessionId } from './selectors/telemetrySelectors';
import { getMailAriaTenantTokens } from 'owa-analytics';
import type { CustomData } from 'owa-analytics-types';
import type { TimePanelSource } from 'owa-time-panel-bootstrap';
import type { PanelView, TimePanelSelectedViewType } from 'owa-time-panel-settings';

/**
 * Time Panel datapoints are unsampled, so all datapoints are logged for 100% of users.
 *
 * The data is stored in the shared OWA tenant.
 *
 * A Time Panel session is the period of time between a panel open and panel close. Each time the panel opens
 * this is considered a new session, and a Time Panel session ID is created. This ID is logged in the custom
 * data of each datapoint, so each datapoint can be associated with a particular panel session.
 *
 * Custom data properties that end in `_X` (e.g. `source_1`) indicate fields that will be preserved and
 * auto-aggregated by Framework data pipeline.
 */

/** Default data properties included on all datapoints */
export interface TimePanelDefaultCustomData {
    /** Unique ID for the panel session, generated on panel open */
    sessionId: string;
}

/** Custom data properties included on timePanelActionOpen datapoint */
export interface TimePanelOpenCustomData {
    /** Source for starting the panel session */
    source_1: TimePanelSource;
}

/** Custom data properties included on timePanelActionClose datapoint */
export interface TimePanelCloseCustomData {
    /** Length of the panel session in milliseconds, measured from panel open to panel close  */
    sessionDuration: number;
    /** Lower bound of the panel session length when placed into duration bucket  */
    sessionDurationBucketLowerBoundMinutes_1: number;
    /** Upper bound of the panel session length when placed into duration bucket  */
    sessionDurationBucketUpperBoundMinutes_2: number;
}

/** Custom data properties included on timePanelActionChangeView datapoint */
export interface TimePanelChangeViewCustomData {
    /** Length of the panel view in milliseconds, measured from view open to view close */
    previousViewDuration: number;
    /** Panel view previously shown */
    previousView_1: PanelView;
    /** Panel view type previously shown */
    previousViewType_2: TimePanelSelectedViewType;
    /** Lower bound of the panel view length when placed into duration bucket  */
    previousViewDurationBucketLowerBoundMinutes_3: number;
    /** Upper bound of the panel view length when placed into duration bucket  */
    previousViewDurationBucketUpperBoundMinutes_4: number;
    /** Panel view next shown */
    nextView_5: PanelView;
    /** Panel view type next shown */
    nextViewType_6: TimePanelSelectedViewType;
}

/** Custom data properties included on timePanelActionDeeplink datapoint */
export interface TimePanelDeeplinkCustomData {
    /** Target of the deep-link, e.g. module, read form, compose form, etc */
    target_1: TimePanelTarget;
}

/** Possible targets deep-linked from Time Panel */
export type TimePanelTarget =
    | 'CalendarModule'
    | 'CalendarEventDetails'
    | 'TasksModule'
    | 'TaskDetails'
    | 'ComposeForm';

/** Log unsampled datapoints (i.e. for 100% of users) in the shared OWA tenant */
export const timePanelOptions = {
    isCore: true,
    tenantTokens: getMailAriaTenantTokens(),
};

/**
 * Generates custom data for Time Panel datapoints by mixing datapoint-specific custom data with default custom data
 */
export function getTimePanelCustomData<TCustomData>(
    datapointSpecificCustomData?: CustomData & TCustomData
): CustomData & TCustomData & TimePanelDefaultCustomData {
    return {
        ...datapointSpecificCustomData,
        sessionId: getTimePanelSessionId(),
    };
}

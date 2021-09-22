import { action } from 'satcheljs';
import type { SurveyActivityType } from '../schema/SurveyActivityType';

/**
 * Action dispatched so we can log activity to the Floodgate engine
 */
export const logFloodgateActivity = action(
    'LOG_FLOODGATE_ACTIVITY',
    (activityType: SurveyActivityType, searchTraceId: string = null) => ({
        activityType,
        searchTraceId,
    })
);

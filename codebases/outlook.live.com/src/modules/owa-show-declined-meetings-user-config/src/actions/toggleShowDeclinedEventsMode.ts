import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { DateRangeType } from '@fluentui/date-time-utilities/lib/dateValues/dateValues';

// TODO: VSO #89735 Audit boundary between surface and board

export const toggleShowDeclinedEventsMode = action(
    'toggleShowDeclinedEventsMode',
    (isDeclinedEventsMode: boolean, dateRangeType: DateRangeType) =>
        addDatapointConfig(
            {
                name: 'ToggleShowDeclinedEventsMode',
                customData: {
                    CurrentDateRangeType: dateRangeType,
                    ShowDeclinedEventsMode: isDeclinedEventsMode, // log the intended state after toggle
                },
            },
            {
                isDeclinedEventsMode,
                dateRangeType,
            }
        )
);

export default toggleShowDeclinedEventsMode;

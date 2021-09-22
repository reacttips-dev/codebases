import { toggleShowDeclinedEventsMode } from '../actions/toggleShowDeclinedEventsMode';
import { updateUserConfigurationAndService } from 'owa-session-store/lib/utils/updateUserConfigurationAndService';
import { orchestrator } from 'satcheljs';

export const VIEW_STATE_CONFIGURATION = 'OWA.ViewStateConfiguration';

orchestrator(toggleShowDeclinedEventsMode, actionMessage => {
    const { isDeclinedEventsMode } = actionMessage;

    updateUserConfigurationAndService(
        config => {
            config.ViewStateConfiguration.CalendarViewShowDeclinedMeetings = isDeclinedEventsMode;
        },
        [
            {
                key: 'CalendarViewShowDeclinedMeetings',
                valuetype: 'Boolean',
                value: [`${isDeclinedEventsMode}`],
            },
        ],
        VIEW_STATE_CONFIGURATION
    );
});

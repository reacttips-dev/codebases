import { lazyShowCalendarNotification } from 'owa-calendar-notification-bar';
import { ControlIcons } from 'owa-control-icons';
import { getRespondToCalendarEventNotificationMessage } from '../utils/getRespondToCalendarEventNotificationMessage';
import type { ViewType } from 'owa-calendar-actions';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';

export function onRespondToCalendarEventSuccess(
    actionSource: ViewType,
    responseType: ResponseTypeType,
    isProposeNewTime: boolean
) {
    const message = getRespondToCalendarEventNotificationMessage(responseType, isProposeNewTime);
    lazyShowCalendarNotification.import().then(showCalendarNotification => {
        showCalendarNotification('respondToEvent', actionSource, message, {
            icon: ControlIcons.CalendarReply,
        });
    });
}

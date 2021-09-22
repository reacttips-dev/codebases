import { action } from 'satcheljs';
import type MeetingMessageAddToCalendarStatus from '../store/schema/MeetingMessageAddToCalendarStatus';

export default action(
    'meetingMessageAddToCalendarStatusChanged',
    (status: MeetingMessageAddToCalendarStatus, sxsId: string) => ({
        status,
        sxsId,
    })
);

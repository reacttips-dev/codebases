import type AttendeeType from 'owa-service/lib/contract/AttendeeType';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

export default function emailAddressWrapperToAttendeeType(
    items: EmailAddressWrapper[]
): AttendeeType[] {
    let attendeeList: AttendeeType[] = [];

    if (items) {
        attendeeList = items.map(wrapper => {
            return <AttendeeType>{
                Mailbox: wrapper,
            };
        });
    }

    return attendeeList;
}

import createFromViewState from './createFromViewState';
import getFromAddressWrapper from './fromAddressUtils/getFromAddressWrapper';
import type { FromViewState } from 'owa-mail-compose-store';
import shouldAlwaysShowFrom from '../utils/shouldAlwaysShowFrom';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';

export default function getFromViewState(
    from: EmailAddressWrapper,
    meetingRequestItem: Partial<MeetingRequestMessageType>,
    referenceItemId: ItemId,
    isPost?: boolean,
    isFromShownInViewState: boolean = true
): FromViewState {
    // If it's a meeting request, the meeting is owned by a specific user, so we can't allow it to change.
    const isFromReadOnly = !!meetingRequestItem;
    const isFromShown =
        (shouldAlwaysShowFrom() || from != null) && !isFromReadOnly && isFromShownInViewState;
    const fromAddress = from || getFromAddressWrapper(referenceItemId);

    return createFromViewState(isFromShown, fromAddress, isFromReadOnly, isPost);
}

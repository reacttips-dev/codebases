import type { RecipientContainer } from '../types/RecipientContainer';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type AttendeeType from 'owa-service/lib/contract/AttendeeType';

export function recipientContainerIsRecipientWell(
    recipientContainer: RecipientContainer
): recipientContainer is RecipientWellWithFindControlViewState {
    const typeCastRecipientContainer = recipientContainer as RecipientWellWithFindControlViewState;
    return typeCastRecipientContainer.recipients !== undefined;
}

export function recipientContainerIsAttendeeTypeList(
    recipientContainer: RecipientContainer
): recipientContainer is AttendeeType[] {
    const typeCastRecipientContainer = recipientContainer as AttendeeType[];
    return typeCastRecipientContainer.length !== undefined;
}

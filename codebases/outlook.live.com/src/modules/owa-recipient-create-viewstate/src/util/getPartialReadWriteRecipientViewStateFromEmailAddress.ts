import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { RecipientExpansionStatus } from 'owa-recipient-types/lib/types/RecipientExpansionStatus';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import getDisplayTextFromEmailAddress from 'owa-recipient-email-address/lib/utils/getDisplayTextFromEmailAddress';

type ReadWriteRecipientViewStateWithoutPersona = Omit<
    ReadWriteRecipientViewState,
    'persona' | 'isPendingResolution'
>;

export const baseViewState = {
    isContextMenuOpen: false,
    isSelected: false,
    isExpanding: false,
    isEditing: false,
    isFadedOut: false,
    expansionStatus: RecipientExpansionStatus.None,
    members: [],
};

export function getPartialReadWriteRecipientViewStateFromEmailAddress(
    emailAddress: EmailAddressWrapper,
    explicitDisplayName?: string
): ReadWriteRecipientViewStateWithoutPersona {
    return {
        ...baseViewState,
        isValid: true,
        displayText: getDisplayTextFromEmailAddress(emailAddress, explicitDisplayName),
    };
}

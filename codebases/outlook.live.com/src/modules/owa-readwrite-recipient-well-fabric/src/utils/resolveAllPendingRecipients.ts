import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import getEmailWithRoutingType from 'owa-recipient-email-address/lib/utils/getEmailWithRoutingType';
import getDisplayTextFromEmailAddress from 'owa-recipient-email-address/lib/utils/getDisplayTextFromEmailAddress';
import { lazySearchSuggestionsForSinglePersona } from 'owa-recipient-suggestions';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';

export default function resolveAllPendingRecipients(
    recipients: ReadWriteRecipientViewState[],
    findControlViewState: FindControlViewState
): Promise<ReadWriteRecipientViewState[]> {
    return Promise.all(
        recipients.map(async unresolvedRecipient => {
            if (!unresolvedRecipient.isPendingResolution) {
                return unresolvedRecipient;
            }

            const emailWithRouting = getEmailWithRoutingType(
                unresolvedRecipient.persona.EmailAddress
            );
            const singlePersona = await lazySearchSuggestionsForSinglePersona
                .import()
                .then(searchSuggestionsForSinglePersona =>
                    searchSuggestionsForSinglePersona(
                        findControlViewState ? findControlViewState.userIdentity : null,
                        emailWithRouting
                    )
                );

            return singlePersona
                ? {
                      ...unresolvedRecipient,
                      persona: singlePersona,
                      isPendingResolution: false,
                      isValid: true,
                      displayText: getDisplayTextFromEmailAddress(singlePersona.EmailAddress),
                  }
                : {
                      ...unresolvedRecipient,
                      isPendingResolution: false,
                  };
        })
    );
}

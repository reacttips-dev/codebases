import { isStringNullOrWhiteSpace } from 'owa-localize';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type { ISuggestionModel } from '@fluentui/react/lib/Pickers';
import parseOneOffEmailAddressFromString from 'owa-recipient-email-address/lib/utils/parseOneOffEmailAddressFromString';
import getDisplayNameAndAddressFromRecipientString from 'owa-recipient-email-address/lib/utils/getDisplayNameAndAddressFromRecipientString';

export default function createGenericItem(
    name: string,
    currentValidationState: boolean
): ISuggestionModel<FindRecipientPersonaType> {
    if (!isStringNullOrWhiteSpace(name)) {
        let nameAndAddress = getDisplayNameAndAddressFromRecipientString(name);
        const parsedRecipientEmail = parseOneOffEmailAddressFromString(
            nameAndAddress.address,
            nameAndAddress.displayName
        );

        if (!parsedRecipientEmail) {
            return { selected: false, item: null };
        }

        return {
            selected: false,
            item: {
                EmailAddress: parsedRecipientEmail,
            },
        };
    } else {
        return { selected: false, item: null };
    }
}

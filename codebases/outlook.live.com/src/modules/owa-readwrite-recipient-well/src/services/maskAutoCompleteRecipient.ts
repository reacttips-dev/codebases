import { makeGetRequest } from 'owa-ows-gateway';
import maskAutoCompleteRecipientRequest from 'owa-service/lib/factory/maskAutoCompleteRecipientRequest';
import type MaskAutoCompleteRecipientRequest from 'owa-service/lib/contract/MaskAutoCompleteRecipientRequest';
import maskAutoCompleteRecipientOperation from 'owa-service/lib/operation/maskAutoCompleteRecipientOperation';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';

const MASKING_ENDPOINT = '/search/api/v1/Masking?';
const SCENARIO_NAME = 'owa.react.compose';

function configureRequestBody(emailAddress: string): MaskAutoCompleteRecipientRequest {
    return maskAutoCompleteRecipientRequest({
        EmailAddress: emailAddress,
    });
}

export function maskAutoCompleteRecipient(emailAddress: string): void {
    if (shouldUse3SPeopleSuggestions()) {
        const url = `${MASKING_ENDPOINT}MaskedEntities=${encodeURIComponent(
            emailAddress
        )}&scenario=${SCENARIO_NAME}`;
        makeGetRequest(url);
    } else {
        let requestBody = configureRequestBody(emailAddress);
        maskAutoCompleteRecipientOperation(requestBody);
    }
}

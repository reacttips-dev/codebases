import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type {
    RecommendationServiceODataMessage,
    RecommendationServiceODataMessageRecipient,
} from 'owa-attachment-suggestions';
import { getCurrentCulture } from 'owa-localize';

export default function getSuggestedAttachmentMessageFromComposeViewState(
    composeViewState: ComposeViewState
): RecommendationServiceODataMessage {
    return {
        '@odata.type': 'Microsoft.OutlookServices.Message',
        Subject: composeViewState.subject,
        Body: {
            '@odata.type': 'Microsoft.OutlookServices.ItemBody',
            Content: composeViewState.content,
            ContentType: composeViewState.bodyType,
        },
        ToRecipients: convertRecipientWell(composeViewState.toRecipientWell),
        CcRecipients: convertRecipientWell(composeViewState.ccRecipientWell),
        BccRecipients: convertRecipientWell(composeViewState.bccRecipientWell),
        SingleValueExtendedProperties: [
            {
                PropertyId:
                    'String {00062008-0000-0000-c000-000000000046} Name EntityExtraction/ExtractLanguage1.0',
                Value: JSON.stringify([{ Language: { Locale: getCurrentCulture() } }]),
            },
        ],
    };
}

function convertRecipientWell(
    recipientWell: RecipientWellWithFindControlViewState
): RecommendationServiceODataMessageRecipient[] {
    return recipientWell?.recipients?.map(recipient => ({
        '@odata.type': 'Microsoft.OutlookServices.Recipient',
        EmailAddress: {
            '@odata.type': 'Microsoft.OutlookServices.EmailAddress',
            Name: recipient?.displayText || recipient?.persona?.DisplayName,
            Address: recipient?.persona?.EmailAddress?.EmailAddress,
        },
    }));
}

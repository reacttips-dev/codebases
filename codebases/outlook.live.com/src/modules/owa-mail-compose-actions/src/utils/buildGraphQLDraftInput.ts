import type {
    MentionInfoInput,
    DraftInput,
    ConnectedAccountInfo,
    InternetHeadersInput,
} from 'owa-graph-schema';
import { ObservableMap, toJS } from 'mobx';
import { getISOString } from 'owa-datetime';
import { ComposeViewState } from 'owa-mail-compose-store';
import isPrimarySmtp from 'owa-mail-proxy-address/lib/utils/isPrimarySmtp';
import type Message from 'owa-service/lib/contract/Message';
import type SmartResponseType from 'owa-service/lib/contract/SmartResponseType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import {
    computeLabelPropertyValue,
    computeLabelModifyHeader,
} from 'owa-mail-protection/lib/utils/clp/stampCLPLabelInExtendedProperty';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { getOperationMapping, getOperationFromMessageType } from './operationMappingUtils';

export default function buildGraphQLDraftInput(
    messageType: Message | SmartResponseType,
    viewState?: ComposeViewState
): DraftInput {
    const operation = !!viewState
        ? getOperationMapping(viewState.operation)
        : getOperationFromMessageType(messageType);
    const baseGraphQLDraftInput = {
        ToRecipients: messageType.ToRecipients ?? [],
        CcRecipients: messageType.CcRecipients ?? [],
        BccRecipients: messageType.BccRecipients ?? [],
        Subject: messageType.Subject ?? '',
        Body: messageType.Body
            ? {
                  Value: messageType.Body.Value,
                  DataUriCount: messageType.Body.DataUriCount,
                  BodyType: messageType.Body.BodyType,
              }
            : undefined,
        NewBodyContent: (messageType as Partial<SmartResponseType>).NewBodyContent
            ? {
                  Value: (messageType as Partial<SmartResponseType>).NewBodyContent.Value,
                  DataUriCount: (messageType as Partial<SmartResponseType>).NewBodyContent
                      .DataUriCount,
                  BodyType: (messageType as Partial<SmartResponseType>).NewBodyContent.BodyType,
              }
            : undefined,
        Importance: messageType.Importance ?? 'Normal',
        IsReadReceiptRequested: !!messageType.IsReadReceiptRequested,
        IsDeliveryReceiptRequested: !!messageType.IsDeliveryReceiptRequested,
        UpdateResponseItemId: (messageType as Partial<SmartResponseType>).UpdateResponseItemId,
        ReferenceItemId: (messageType as Partial<SmartResponseType>).ReferenceItemId as ItemId,
        ReferenceItemDocumentId: (messageType as Partial<SmartResponseType>)
            .ReferenceItemDocumentId,
        operation: operation,
    };
    if (!!viewState) {
        return {
            ...baseGraphQLDraftInput,
            atMentionedRecipients: createListOfMentionedSMTPs(viewState),
            recipientsAddedViaAtMention: !!viewState.mentionsPicker.mentionsAddedRecipients
                ? toJS(viewState.mentionsPicker.mentionsAddedRecipients)
                : undefined,
            connectedAccountSharingGuid: getConnectedAccountSharingGuid(viewState),
            deferredSendTime: !!viewState.deferredSendTime
                ? getISOString(viewState.deferredSendTime)
                : undefined,
            clpLabelModifificationHeader: computeLabelModifyHeader(
                viewState.protectionViewState.clpViewState
            ),
            clpLabelProperty: computeLabelPropertyValue(viewState.protectionViewState.clpViewState),
            messageClassification: getMessageClassification(viewState),
            originalSmtpFromAddress: getOriginalSmtpFromAddress(viewState),
            sendAs: getSendAs(viewState),
            internetHeaders: !!viewState.addin.internetHeaders
                ? convertInternetHeadersToGraphQLType(viewState.addin.internetHeaders)
                : undefined,
            internetHeadersToRemove: viewState.addin.keysOfInternetHeadersToBeRemoved,
            appendOnSend: viewState.addin.appendOnSend,
            draftComposeType: viewState.addin.draftComposeType,
            DocLinks: messageType.DocLinks,
            isReportedFalsePositive: viewState.policyTipsViewState.isReportedFalsePositive,
            isOverridden: viewState.policyTipsViewState.isOverridden,
            overrideJustification: viewState.policyTipsViewState.overrideJustification,
        };
    } else {
        return baseGraphQLDraftInput;
    }
}

function createListOfMentionedSMTPs(viewState: ComposeViewState): MentionInfoInput[] {
    const { atMentionTuples } = viewState.mentionsPicker;
    const mentionInfos: MentionInfoInput[] = atMentionTuples
        ? Object.keys(atMentionTuples).map(key => {
              const persona = atMentionTuples[key];
              return {
                  key,
                  emailAddress: persona.EmailAddress,
              };
          })
        : [];
    return mentionInfos;
}

function getConnectedAccountSharingGuid(viewState: ComposeViewState): string | undefined {
    const from = viewState.fromViewState?.from?.email?.EmailAddress;
    if (from) {
        const connectAccountInfo = getMatchingConnectedAccountForAddress(from);
        return connectAccountInfo?.SubscriptionGuid;
    }

    return undefined;
}

function getMatchingConnectedAccountForAddress(
    fromAddress: string
): ConnectedAccountInfo | undefined {
    const connectAccountInfos = getUserConfiguration().SessionSettings.ConnectedAccountInfos;
    if (connectAccountInfos) {
        for (let i = 0; i < connectAccountInfos.length; i++) {
            const connectAccountInfo = connectAccountInfos[i];
            if (connectAccountInfo.EmailAddress == fromAddress) {
                return connectAccountInfo;
            }
        }
    }

    return undefined;
}

function getMessageClassification(viewState: ComposeViewState) {
    const classificationViewState = viewState.protectionViewState.classificationViewState;
    return classificationViewState.messageClassification
        ? {
              ...classificationViewState.messageClassification,
              isClassified: true,
          }
        : undefined;
}

function getOriginalSmtpFromAddress(viewState: ComposeViewState) {
    const fromAddress = viewState.fromViewState?.from?.email?.EmailAddress;
    if (fromAddress && !isPrimarySmtp(fromAddress)) {
        return fromAddress;
    }
    return undefined;
}

function getSendAs(viewState: ComposeViewState): EmailAddressWrapper | undefined {
    const fromWrapper = viewState.fromViewState?.from?.email;
    if (fromWrapper) {
        const connectAccountInfo = getMatchingConnectedAccountForAddress(fromWrapper.EmailAddress);
        if (!!connectAccountInfo) {
            return {
                MailboxType: fromWrapper.MailboxType,
                RoutingType: 'SMTP',
                EmailAddress: fromWrapper.EmailAddress,
                Name: connectAccountInfo.DisplayName,
            };
        } else {
            return fromWrapper;
        }
    }
    return undefined;
}

function convertInternetHeadersToGraphQLType(
    internetHeadersMap: ObservableMap<string, string>
): InternetHeadersInput[] {
    return [...internetHeadersMap.keys()].map(key => ({
        headerName: key,
        headerValue: internetHeadersMap.get(key),
    }));
}

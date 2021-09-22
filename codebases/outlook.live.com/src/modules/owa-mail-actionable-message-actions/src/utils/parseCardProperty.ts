import type { CardDetails } from 'owa-actionable-message-v2';
import { HIGHLIGHT_PREFIX, DEFAULT_CONNECTOR_SENDER_GUID } from '../constants';
import { getGuid } from 'owa-guid';
import { Warning } from '../traceConstants';
import hash from 'hash.js';

const parseCardPayloadFromStringOrObject = (
    commonProps: any,
    connectorSenderGuid: string,
    card: string | object,
    cardSignature: string,
    errorMessageList: [string, boolean][],
    isAdaptive?: boolean,
    cardId?: string
): CardDetails => {
    let cardJson: any;
    let cardHash: string;

    try {
        if (typeof card === 'string') {
            cardJson = JSON.parse(card);
            const hashBuffer = hash.sha256().update(card).digest();
            cardHash = btoa(String.fromCharCode.apply(null, new Uint8Array(hashBuffer)));
        } else {
            cardJson = card;
        }
    } catch (ex) {
        errorMessageList.push([Warning.JsonParseIssue, false]);
        return null;
    }

    return {
        ...commonProps,
        connectorSenderGuid: connectorSenderGuid,
        isAdaptiveCard: isAdaptive === undefined ? cardJson.type === 'AdaptiveCard' : isAdaptive,
        cardSignature: cardSignature,
        card: cardJson,
        cardHash: cardHash,
        cardId: cardId || getGuid(),
    };
};

const parseHighlightsSerialized = (
    cardData: any,
    commonProps: any,
    errorMessageList: [string, boolean][]
): CardDetails[] => {
    const cardDetails: CardDetails[] = [];
    Object.keys(cardData).map((key: string): void => {
        if (cardData.hasOwnProperty(key) && key.indexOf(HIGHLIGHT_PREFIX) === 0) {
            const highlightSerialized = cardData[key];
            try {
                const highlightJson = JSON.parse(highlightSerialized);
                const card = parseCardPayloadFromStringOrObject(
                    commonProps,
                    cardData.ConnectorSenderGuid
                        ? cardData.ConnectorSenderGuid
                        : DEFAULT_CONNECTOR_SENDER_GUID,
                    highlightJson.card,
                    null,
                    errorMessageList
                );
                card.isContextual = true;
                card.key = highlightJson.id;
                card.highlightTerm = highlightJson.text;
                cardDetails.push(card);
            } catch (ex) {
                errorMessageList.push([Warning.JsonParseIssue, false]);
            }
        }
    });

    return cardDetails;
};

const parseCardProperty = (
    cardProperty: string,
    errorMessageList: [string, boolean][]
): CardDetails[] => {
    let cardData;
    try {
        cardData = JSON.parse(cardProperty);
    } catch (ex) {
        errorMessageList.push([Warning.JsonParseIssue, false]);
        return [];
    }

    // Get the global properties
    const commonProps = {
        smtpAddressesSerialized: cardData.SmtpAddressesSerialized,
        providerAccountUniqueId: cardData.ProviderAccountUniqueId,
        messageCardExtensionContext: cardData.MessageCardExtensionContext,
    };

    const cardDetails: CardDetails[] = [];

    if (cardData.AdaptiveCardV2Serialized) {
        const card = parseCardPayloadFromStringOrObject(
            commonProps,
            cardData.ConnectorSenderGuidV2
                ? cardData.ConnectorSenderGuidV2
                : DEFAULT_CONNECTOR_SENDER_GUID,
            cardData.AdaptiveCardSerializedV2,
            cardData.AdaptiveCardSignatureV2,
            errorMessageList,
            true
        );
        if (card) {
            cardDetails.push(card);
        }
    }

    if (cardData.AdaptiveCardSerialized) {
        const card = parseCardPayloadFromStringOrObject(
            commonProps,
            cardData.ConnectorSenderGuid
                ? cardData.ConnectorSenderGuid
                : DEFAULT_CONNECTOR_SENDER_GUID,
            cardData.AdaptiveCardSerialized,
            cardData.AdaptiveCardSignature,
            errorMessageList,
            true
        );
        if (card) {
            cardDetails.push(card);
        }
    } else if (cardData.MessageCardSerialized) {
        const card = parseCardPayloadFromStringOrObject(
            commonProps,
            cardData.ConnectorSenderGuid
                ? cardData.ConnectorSenderGuid
                : DEFAULT_CONNECTOR_SENDER_GUID,
            cardData.MessageCardSerialized,
            cardData.MessageCardSignature,
            errorMessageList,
            false
        );

        if (card) {
            cardDetails.push(card);
        }
    } else {
        errorMessageList.push([Warning.NoCardPresent, false]);
        return [];
    }

    return cardDetails.concat(parseHighlightsSerialized(cardData, commonProps, errorMessageList));
};

export default parseCardProperty;

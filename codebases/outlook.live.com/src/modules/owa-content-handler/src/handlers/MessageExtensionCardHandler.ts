import type { ContentHandler } from 'owa-controls-content-handler-base';
import {
    MESSAGE_EXTENSION_CARD_PLACEHOLDER_PREFIX,
    lazyHydrateCard,
    RenderingMode,
} from 'owa-message-extension-cards';
import type { CardDetails } from 'owa-actionable-message-v2';
import type { ClientItem } from 'owa-mail-store';
import {
    PerfMarker,
    LogModules,
    PropertiesType,
    Status,
    logError,
} from 'owa-message-extension-analytics';

export const MESSAGE_EXTENSION_CARD_HANDLER_NAME = 'MessageExtensionCardHandler';
const QUERY_SELECTOR_WITH_REPLY_FORWARD = `div[id*='${MESSAGE_EXTENSION_CARD_PLACEHOLDER_PREFIX}']`;
/**
 * Message extension card handler handles rendering in reading pane.
 */
export class MessageExtensionCardHandler implements ContentHandler {
    // Css selector to match x_messageExtensionCardPlaceholder

    public cssSelector;
    public readonly keywords = null;
    private handlerId: string;
    private readonly cardDetailsFromExProp?: Map<string, CardDetails>;
    private readonly item: ClientItem;
    private containerElements: Map<string, HTMLElement>;

    constructor(item: ClientItem, cardDetails?: CardDetails[]) {
        this.handlerId = item.ItemId?.Id;
        cardDetails?.forEach(cardDetail => {
            if (!this.cardDetailsFromExProp.has(cardDetail.cardId)) {
                this.cardDetailsFromExProp[cardDetail.cardId] = cardDetail;
            }
        });
        this.item = item;
        this.cssSelector = QUERY_SELECTOR_WITH_REPLY_FORWARD;
        this.containerElements = new Map();
    }

    public readonly handler = (cardPlaceHolderDiv: HTMLElement) => {
        const perfMarker = new PerfMarker(
            LogModules.CardRendering,
            'MessageExtensionCardHandler',
            '',
            this.handlerId
        );

        const cardId = cardPlaceHolderDiv.id;
        let cardToRender: CardDetails;
        let isCardDetailsFromExProp = false;

        let metricsData: PropertiesType = {
            cardId: cardId,
        };

        try {
            // Render card from Ex prop.
            if (this.cardDetailsFromExProp && this.cardDetailsFromExProp.has(cardId)) {
                cardToRender = this.cardDetailsFromExProp[cardId];
                isCardDetailsFromExProp = true;
            }
            // If card details are empty, it would mean extended property is missing.
            // In this case, we will load the details from placeholder div
            else {
                cardToRender = JSON.parse(decodeURIComponent(atob(cardPlaceHolderDiv.innerText)));
            }

            metricsData.appId = cardToRender?.connectorSenderGuid;
            metricsData.isCardDetailsFromExProp = isCardDetailsFromExProp;

            lazyHydrateCard.import().then(hydrateCard => {
                const containerElement = cardPlaceHolderDiv.ownerDocument.createElement('div');
                cardPlaceHolderDiv.parentNode?.insertBefore(
                    containerElement,
                    cardPlaceHolderDiv.nextSibling
                );

                // Hydrate the card.
                hydrateCard(
                    containerElement,
                    cardPlaceHolderDiv.ownerDocument,
                    cardToRender,
                    RenderingMode.MailReadingPane,
                    this.item,
                    this.handlerId
                );
                this.containerElements.set(cardId, containerElement);
                perfMarker.logMetricEnd(metricsData);
            });
        } catch (err) {
            perfMarker.logMetricEndWithError(Status.ClientError, err.errorMessage, metricsData);
        }
    };

    public readonly undoHandler = (elements: HTMLElement[]) => {
        const perfMarker = new PerfMarker(
            LogModules.CardRendering,
            'MessageExtensionUndoHandler',
            '',
            this.handlerId
        );
        try {
            elements?.forEach(element => {
                if (this.containerElements?.has(element.id)) {
                    element.parentNode?.removeChild(element);
                }
            });
            perfMarker.logMetricEnd();
        } catch (err) {
            perfMarker.logMetricEndWithError(Status.ClientError, err.errorMessage);
            logError(
                LogModules.CardRendering,
                `MessageExtensionCardHandler_UndoHandler - Error: ${err.errorMessage}`,
                '',
                this.handlerId
            );
        } finally {
            this.containerElements = null;
        }
    };
}

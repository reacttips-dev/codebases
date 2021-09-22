import getImmutableEntryId from '../utils/getImmutableEntryId';
import { lazyLogSigsDatapoint, logUsage } from 'owa-analytics';
import type { ContentHandler } from 'owa-controls-content-handler-base';
import { userMailInteractionAction } from 'owa-mail-actions';
import { lazyLogToSigsWithLinkCustomProperties } from 'owa-mail-extracted-url';
import { getSelectedTableView } from 'owa-mail-list-store';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import type { ClientItem } from 'owa-mail-store';
import isYammerEnabled from 'owa-mail-store-actions/lib/utils/isYammerEnabled';
import { YammerCopyOfMessageScenario } from 'owa-yammer-thread/lib/store/schema/YammerCopyOfMessageScenario';

const CLICK_EVENT_NAME = 'click';
const LINK_HANDLER_SELECTOR = 'a';
const LINK_INDEX_DATA_ATTRIBUTE = 'data-linkIndex';
export const LINK_HANDLER_NAME = 'linkHandler';

export class LinkHandler implements ContentHandler {
    public readonly cssSelector = LINK_HANDLER_SELECTOR;
    public readonly keywords = null;

    private boundElements: {
        element: HTMLElement;
        handler: (clickEvent: MouseEvent) => void;
    }[];
    private item: ClientItem;

    constructor(item: ClientItem) {
        this.boundElements = [];
        this.item = item;
    }

    public readonly handler = (element: HTMLElement, keyword?: string) => {
        const clickHandler = (item: ClientItem) => (evt: MouseEvent) => {
            const tableView = getSelectedTableView();
            const selectedRowKeys = tableView ? [...tableView.selectedRowKeys.keys()] : [];
            if (selectedRowKeys.length === 1) {
                const instrumentationContext = getInstrumentationContextsFromTableView(
                    selectedRowKeys,
                    tableView
                )[0];

                userMailInteractionAction('LinkClicked', [instrumentationContext]);
            }

            if (item) {
                getImmutableEntryId(item).then(immutableEntryId => {
                    if (immutableEntryId) {
                        logUsage('RPMessageBodyLinkClicked', [], {
                            cosmosOnlyData: immutableEntryId,
                        });
                    }

                    let linkIndex: number = element.hasAttribute(LINK_INDEX_DATA_ATTRIBUTE)
                        ? parseInt(element.getAttribute(LINK_INDEX_DATA_ATTRIBUTE))
                        : -1;
                    if (linkIndex > -1) {
                        lazyLogToSigsWithLinkCustomProperties
                            .import()
                            .then(logToSigsWithLinkCustomProperties =>
                                logToSigsWithLinkCustomProperties(
                                    element.getAttribute('href'),
                                    item,
                                    immutableEntryId,
                                    linkIndex
                                )
                            );
                    } else {
                        lazyLogSigsDatapoint.importAndExecute('LinkClicked', {
                            itemId: immutableEntryId,
                        });
                    }
                });

                this.tryLogYammerLinkClicked(item, evt);
            }
        };

        element.addEventListener(CLICK_EVENT_NAME, clickHandler(this.item));
        this.boundElements.push({ element: element, handler: clickHandler(this.item) });
    };

    public readonly doneHandlingMatchedElements = (
        elements: HTMLElement[],
        htmlContentRef?: HTMLElement
    ) => {
        if (elements && elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                // Add data-linkIndex attribute to keep track of the link sequencing in the message
                elements[i].setAttribute(LINK_INDEX_DATA_ATTRIBUTE, i.toString());
            }
        }
    };

    public readonly undoHandler = (elements: HTMLElement[]) => {
        this.boundElements.forEach(boundElement =>
            boundElement.element.removeEventListener(CLICK_EVENT_NAME, boundElement.handler)
        );
        this.boundElements = [];
    };

    private tryLogYammerLinkClicked(item: ClientItem, evt: MouseEvent) {
        if (item.YammerNotification || item.ExtensibleContentData) {
            let yammerData = item.YammerData;

            // YammerData will not be set if the rp-yammer flight is disabled
            if (!yammerData && (item.ExtensibleContentData || item.YammerNotification)) {
                yammerData = new YammerCopyOfMessageScenario(
                    item.ExtensibleContentData,
                    item.YammerNotification
                );
            }

            const anchorElement = evt.target as HTMLAnchorElement;
            yammerData = yammerData as YammerCopyOfMessageScenario;
            if (
                yammerData.isValid() &&
                anchorElement &&
                anchorElement.href.indexOf(yammerData.getScenarioData()) > -1
            ) {
                logUsage('YammerViewConversationClicked', {
                    yammerEnabled: isYammerEnabled(),
                });
            }
        }
    }
}

import type { ContentHandler } from 'owa-controls-content-handler-base';
import { lazyCreateLinkPreview, lazyRehydrateLinkPreview } from 'owa-link-preview';
import { lazyAddInteractiveElementsForReadingPane } from 'owa-link-preview-read';
import { trace } from 'owa-trace';

export const LINK_PREVIEW_HANDLER_NAME = 'linkPreviewHandler';
const LINK_PREVIEW_HANDLER_SELECTOR = 'a,[id^=LPBorder]';
const NO_LINK_PREVIEW_ANCHOR_ID = 'LPNoLP';
const AT_MENTION_ELEMENT_ID_PREFIX = 'OWAAM';
const ANCHOR_TAG_NAME = 'a';
const DIV_TAG_NAME = 'div';

function processElement(element: HTMLElement) {
    // Look for div tags associated with link previews to rehydrate.
    // We don't want to process anchor tags here because we don't want to process anchors if there
    // are more than one, so wait until all of the elements have been discovered and process the anchors
    // in doneHandlingMatchedElements
    if (element.tagName.toLowerCase() === DIV_TAG_NAME) {
        lazyRehydrateLinkPreview.import().then(rehydrateLinkPreview => {
            rehydrateLinkPreview(<HTMLDivElement>element).then(linkPreviewObject => {
                if (linkPreviewObject) {
                    lazyAddInteractiveElementsForReadingPane.importAndExecute(linkPreviewObject);
                }
            });
        });
    }
}

function doneHandlingMatchedElements(elements: HTMLElement[]) {
    // VSO 32592: In IE and Edge, this method triggers a component error in rare instances.
    // In React 16, component errors will cause the entire app to unmount.
    // Likely this error stems from URLs that contain unusual characters. Since it is difficult to repro,
    // for now we just try and catch to hopefully avoid a component error.
    try {
        // Get a list of all of the anchors, and then only process them if there is exactly one eligible anchor found
        let anchorsToProcess = [];
        elements.forEach(element => {
            if (
                element.tagName.toLowerCase() === ANCHOR_TAG_NAME &&
                (!element.id ||
                    (element.id.indexOf(NO_LINK_PREVIEW_ANCHOR_ID) !== 0 &&
                        element.id.indexOf(AT_MENTION_ELEMENT_ID_PREFIX) !== 0))
            ) {
                if (!isChildOfSignature(<HTMLAnchorElement>element)) {
                    anchorsToProcess.push(element);
                }
            }
        });

        if (anchorsToProcess.length === 1) {
            anchorsToProcess.forEach(element => {
                if (hrefMatchesLinkText(<HTMLAnchorElement>element)) {
                    lazyCreateLinkPreview.import().then(createLinkPreview => {
                        createLinkPreview(<HTMLAnchorElement>element, false /*inCompose*/).then(
                            linkPreviewObject => {
                                if (linkPreviewObject) {
                                    element.insertAdjacentElement(
                                        'afterend',
                                        linkPreviewObject.border
                                    );
                                    lazyAddInteractiveElementsForReadingPane.importAndExecute(
                                        linkPreviewObject
                                    );
                                }
                            }
                        );
                    });
                }
            });
        }
    } catch (e) {
        trace.warn('doneHandlingMatchedElements: Exception occured: ' + e.message);
    }
}

function isChildOfSignature(element: HTMLElement): boolean {
    let isChild: boolean = false;
    while (element) {
        // The capital 'S' is important to match jsMVVM
        // TODO:45086 Move away from ID and use class to have properly formatted HTML.
        if (element.id.indexOf('Signature') >= 0) {
            isChild = true;
            break;
        }

        element = element.parentElement;
    }

    return isChild;
}

function hrefMatchesLinkText(element: HTMLAnchorElement): boolean {
    return element.text.indexOf(element.hostname) >= 0;
}

let linkPreviewHandler: ContentHandler = {
    cssSelector: LINK_PREVIEW_HANDLER_SELECTOR,
    keywords: null,
    handler: processElement,
    doneHandlingMatchedElements: doneHandlingMatchedElements,
};

export default linkPreviewHandler;

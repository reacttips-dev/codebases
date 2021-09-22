import type { ContentHandler } from 'owa-controls-content-handler-base';
import { logUsage } from 'owa-analytics';

const CLICK_EVENT_NAME = 'click';
const FRAGMENT_IDENTIFIER_HANDLER_SELECTOR = "a[href^='#']";
const HREF_ATTRIBUTE_NAME = 'href';
const QUERY_SELECTOR_PREFIX = "[name^='";
const QUERY_SELECTOR_SUFFIX = "']";
export const FRAGMENT_IDENTIFIER_HANDLER_NAME = 'fragmentIdentifierHandler';

export class FragmentIdentifierHandler implements ContentHandler {
    public readonly cssSelector = FRAGMENT_IDENTIFIER_HANDLER_SELECTOR;
    public readonly keywords = null;

    private boundElements: {
        element: HTMLElement;
        handler: (clickEvent: MouseEvent) => void;
    }[];

    constructor() {
        this.boundElements = [];
    }

    public readonly handler = (element: HTMLElement, keyword?: string) => {
        // Get the link and remove the leading '#'
        let href = element.getAttribute(HREF_ATTRIBUTE_NAME);
        href = href.substr(1);

        // First get the target by id. If we don't find one, try querying by name.
        // Swallow exceptions so we don't break on malformed identifiers. Logging will indicate that we didn't find the target.
        let targetElement = document.getElementById(href) as Element;
        if (!targetElement) {
            try {
                targetElement = document.querySelector(
                    QUERY_SELECTOR_PREFIX + href + QUERY_SELECTOR_SUFFIX
                );
            } catch (e) {}
        }

        // Log the fragment identifier processing occurrence.
        logUsage('FragmentIdentifierProcessed', [targetElement != null]);

        const clickHandler = (evt: MouseEvent) => {
            // Prevent default regardless.
            evt.preventDefault();

            // Log the user click event.
            logUsage('FragmentIdentifierClicked', [targetElement != null /* targetFound */]);

            // If we found a targetElement, scroll it into view.
            if (targetElement) {
                targetElement.scrollIntoView();
            }
        };

        element.addEventListener(CLICK_EVENT_NAME, clickHandler);
        this.boundElements.push({ element: element, handler: clickHandler });
    };

    public readonly undoHandler = (elements: HTMLElement[]) => {
        this.boundElements.forEach(boundElement =>
            boundElement.element.removeEventListener(CLICK_EVENT_NAME, boundElement.handler)
        );
        this.boundElements = [];
    };
}

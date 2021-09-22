import type { ContentHandler } from 'owa-controls-content-handler-base';
import type Item from 'owa-service/lib/contract/Item';
import { getReadHostItemIndex, lazyOpenContextualCallout } from 'owa-addins-core';
import { VerboseDatapoint } from 'owa-analytics';
import styles from './ContextualAddinHighlightStyle.scss';

export const CLICK_EVENT_NAME = 'click';
export const KEYUP_EVENT_NAME = 'keyup';
export const ENTER_KEY_CODE = 13;
export const CONTEXTUAL_ADDINS_HANDLER_NAME = 'contextualAddinHandler';
export const EVENT_ADDED_DATA_NAME = 'eventAdded';

export let openContextualCallout: (terms: string[], index: string, anchor: HTMLElement) => void;

export class ContextualAddinContentHandler implements ContentHandler {
    public readonly cssSelector = null;
    public readonly useRegExp = true;

    private highlightedKeywords = 0;
    private foundKeywords = 0;
    private activeKeywords = [];
    private readonly datapoint: VerboseDatapoint;
    private readonly hostItemIndex: string;

    constructor(public readonly keywords: string[], item: Item) {
        this.hostItemIndex = getReadHostItemIndex(item.ItemId.Id);
        this.datapoint = new VerboseDatapoint('ExtContextualHighlightTime');

        if (!openContextualCallout) {
            lazyOpenContextualCallout.import().then(openContextualCalloutFn => {
                openContextualCallout = openContextualCalloutFn;
            });
        }
    }

    public handler(element: HTMLElement, keyword?: string) {
        this.foundKeywords++;
        if (!isElementValid(element)) {
            return;
        }

        this.highlightedKeywords++;
        element.className = styles.contextualAddinHighlight;
        element.tabIndex = 0;
        element.setAttribute('role', 'link');

        this.findAndAddClickHandlerToFirstNonSpanParent(element);

        const onSelect = (evt: KeyboardEvent) => {
            evt.preventDefault();
            if (evt.keyCode != undefined && evt.keyCode != ENTER_KEY_CODE) {
                return;
            }

            this.activeKeywords.push(keyword);

            openContextualCallout?.(this.activeKeywords, this.hostItemIndex, element);
        };

        element.addEventListener(CLICK_EVENT_NAME, onSelect);
        element.addEventListener(KEYUP_EVENT_NAME, onSelect);
    }

    public doneHandlingMatchedElements() {
        this.datapoint.addCustomData([
            this.keywords.length,
            this.foundKeywords,
            this.highlightedKeywords,
        ]);
        this.datapoint.end();
    }

    private findAndAddClickHandlerToFirstNonSpanParent(element: HTMLElement) {
        if (!element.parentElement) {
            return;
        }

        while ((element = element.parentElement) && element.nodeName.toLowerCase() === 'span') {}

        if (!element.dataset[EVENT_ADDED_DATA_NAME]) {
            element.dataset[EVENT_ADDED_DATA_NAME] = '1';

            const onSelect = () => (this.activeKeywords = []);

            element.addEventListener(CLICK_EVENT_NAME, onSelect);
            element.addEventListener(KEYUP_EVENT_NAME, onSelect);
        }
    }
}

function isElementValid(element: HTMLElement) {
    return (
        !element.parentElement ||
        (element.parentElement.nodeName.toLowerCase() != 'a' &&
            element.parentElement.nodeName.toLowerCase() != 'img')
    );
}

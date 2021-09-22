import type { ContentHandler } from 'owa-controls-content-handler-base';
import { transformElementForDarkMode, AlteredElement } from 'owa-dark-mode-utilities';
import {
    ATTR_COLOR,
    ATTR_BGCOLOR,
    DATA_OG_STYLE_COLOR,
    DATA_OG_ATTR_COLOR,
    DATA_OG_STYLE_BACKGROUNDCOLOR,
    DATA_OG_ATTR_BGCOLOR,
} from 'owa-content-colors-constants';

export const DARK_MODE_HANDLER_NAME = 'darkModeHandler';

type BaseColor = string | undefined;
interface GetBaseColor {
    (): BaseColor;
}

const DARK_MODE_SELECTOR = '*';
const EMPTY_STRING = '';

interface IsExcludedElement {
    (element: HTMLElement): boolean;
}

export class DarkModeHandler implements ContentHandler {
    public readonly cssSelector = DARK_MODE_SELECTOR;
    public readonly keywords = null;

    private alteredElements: AlteredElement[];
    private getBaseColor: GetBaseColor;
    private isExcludedElement: IsExcludedElement | undefined;

    constructor(getBaseColor: GetBaseColor, isExcludedElement?: IsExcludedElement) {
        this.alteredElements = [];
        this.getBaseColor = getBaseColor;
        this.isExcludedElement = isExcludedElement;
    }

    public readonly handler = (element: HTMLElement, keyword?: string) => {
        if (this.isExcludedElement && this.isExcludedElement(element)) {
            return;
        }

        const alteredElement = transformElementForDarkMode(
            element,
            this.getBaseColor(),
            false /* useSimpleMethod */
        );
        if (alteredElement) {
            this.alteredElements.push(alteredElement);
        }
    };

    public readonly undoHandler = (elements: HTMLElement[]) => {
        this.alteredElements.forEach(alteredElement => {
            const { element, styleColor, attrColor, styleBGColor, attrBGColor } = alteredElement;

            // It's possible we set an attribute based on default assumptions, and don't have a cached value to return to.
            // Therefore, reset all attributes to their cached values or empty strings.
            element.style.color = styleColor ? styleColor : EMPTY_STRING;
            attrColor && element.setAttribute(ATTR_COLOR, attrColor);
            element.style.backgroundColor = styleBGColor ? styleBGColor : EMPTY_STRING;
            attrBGColor && element.setAttribute(ATTR_BGCOLOR, attrBGColor);

            // Clean up our custom attr from DOM
            element.removeAttribute(DATA_OG_STYLE_COLOR);
            element.removeAttribute(DATA_OG_ATTR_COLOR);
            element.removeAttribute(DATA_OG_STYLE_BACKGROUNDCOLOR);
            element.removeAttribute(DATA_OG_ATTR_BGCOLOR);
        });
        this.alteredElements = [];
    };
}

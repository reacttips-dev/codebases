import {
    ATTR_COLOR,
    ATTR_BGCOLOR,
    DATA_OG_STYLE_COLOR,
    DATA_OG_ATTR_COLOR,
    DATA_OG_STYLE_BACKGROUNDCOLOR,
    DATA_OG_ATTR_BGCOLOR,
} from 'owa-content-colors-constants';

export type ElementColors = {
    attrColor: string;
    attrBgColor: string;
    styleColor: string;
    styleBgColor: string;
};

export function getElementColors(element: HTMLElement): ElementColors {
    return {
        attrColor: element.getAttribute(ATTR_COLOR) || null,
        attrBgColor: element.getAttribute(ATTR_BGCOLOR) || null,
        styleColor: element.style.getPropertyValue('color'),
        styleBgColor: element.style.getPropertyValue('background-color'),
    };
}

/**
 * Gets the value of an element's attribute.
 * returns undefined if the attribute is not set, null if it is set with no value.
 */
function getAttr(element: Element, attributeName: string) {
    return !element.hasAttribute(attributeName)
        ? undefined
        : element.getAttribute(attributeName) || null;
}

export function getElementOgColors(element: HTMLElement): ElementColors {
    return {
        attrColor: getAttr(element, DATA_OG_ATTR_COLOR),
        attrBgColor: getAttr(element, DATA_OG_ATTR_BGCOLOR),
        styleColor: getAttr(element, DATA_OG_STYLE_COLOR),
        styleBgColor: getAttr(element, DATA_OG_STYLE_BACKGROUNDCOLOR),
    };
}

export function setElementOgColorsIfUnset(element: HTMLElement, colors: ElementColors) {
    colors.attrColor !== undefined &&
        !element.hasAttribute(DATA_OG_ATTR_COLOR) &&
        element.setAttribute(DATA_OG_ATTR_COLOR, colors.attrColor || '');
    colors.attrBgColor !== undefined &&
        !element.hasAttribute(DATA_OG_ATTR_BGCOLOR) &&
        element.setAttribute(DATA_OG_ATTR_BGCOLOR, colors.attrBgColor || '');
    colors.styleColor !== undefined &&
        !element.hasAttribute(DATA_OG_STYLE_COLOR) &&
        element.setAttribute(DATA_OG_STYLE_COLOR, colors.styleColor || '');
    colors.styleBgColor !== undefined &&
        !element.hasAttribute(DATA_OG_STYLE_BACKGROUNDCOLOR) &&
        element.setAttribute(DATA_OG_STYLE_BACKGROUNDCOLOR, colors.styleBgColor || '');
}

export function setElementColors(element: HTMLElement, colors: ElementColors) {
    colors.attrColor !== undefined &&
        (colors.attrColor === null
            ? element.removeAttribute(ATTR_COLOR)
            : element.setAttribute(ATTR_COLOR, colors.attrColor || ''));
    colors.attrBgColor !== undefined &&
        (colors.attrBgColor === null
            ? element.removeAttribute(ATTR_BGCOLOR)
            : element.setAttribute(ATTR_BGCOLOR, colors.attrBgColor || ''));
    colors.styleColor !== undefined && element.style.setProperty('color', colors.styleColor || '');
    colors.styleBgColor !== undefined &&
        element.style.setProperty('background-color', colors.styleBgColor || '');
}

export default ElementColors;

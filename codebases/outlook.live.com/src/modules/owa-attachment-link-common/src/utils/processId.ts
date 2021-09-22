import { isBeautifulLinkBasedOnId } from './isBeautifulLinkBasedOnId';
import {
    OUTLOOK_BEAUTIFUL_LINK_ATTRIBUTE,
    OUTLOOK_BEAUTIFUL_LINK_ATTRIBUTE_VALUE,
} from './constants';

export function processId(value: string, element: HTMLElement, context: Object) {
    if (isBeautifulLinkBasedOnId(element)) {
        element.setAttribute(
            OUTLOOK_BEAUTIFUL_LINK_ATTRIBUTE,
            OUTLOOK_BEAUTIFUL_LINK_ATTRIBUTE_VALUE
        );
    }
    return null;
}

import { OUTLOOK_BEAUTIFIED_PREFIX } from './constants';

export function isBeautifulLinkBasedOnId(element: HTMLElement): boolean {
    return (
        element.tagName.toLowerCase() === 'a' &&
        element.id?.indexOf(OUTLOOK_BEAUTIFIED_PREFIX) === 0
    );
}

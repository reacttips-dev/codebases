import { getMarkJS, SPAN_ELEMENT_NAME, UNMARK_ELEMENT_LABEL } from './constants';
import createMarkId from './createMarkId';

export type EachElementCallback = (
    keyword: string
) => (element: HTMLElement, instance?: number) => void;
export type Accuracy = 'partially' | 'prefix' | 'exactly';

// used to bypass loading markjs if no
// search terms are ever passed in
let hasEverMarked = false;

export default async function markElements(
    element: HTMLElement,
    keywords: string[],
    eachCallback: EachElementCallback,
    useRegExp: boolean,
    accuracy: Accuracy
) {
    if (keywords.length || hasEverMarked) {
        hasEverMarked = true;
        const MarkJS = await getMarkJS();
        const marker = MarkJS.call(MarkJS, element);

        keywords.forEach(keyword => {
            let count = 0;
            let options = {
                element: SPAN_ELEMENT_NAME,
                className: createMarkId(),
                // Each element belonging to the same keyword should have the same identifier
                // This is needed for unmarking user highlights on keywords across elements (VSO20847)
                acrossElements: true,
                separateWordSearch: false,
                accuracy: accuracy,
                each: (matchedElement: HTMLElement) => {
                    if (!isEmptyElement(matchedElement)) {
                        eachCallback(keyword)(matchedElement, count);
                        count++;
                    }
                },
            };

            if (useRegExp) {
                let str = '';
                for (let i = 0; i < keyword.length; i++) {
                    if (isStartingWithSpecialChar(keyword[i])) {
                        str += '\\';
                    }
                    str += keyword[i];
                }
                marker.markRegExp(new RegExp(str), options);
            } else {
                marker.mark(keyword, options);
            }
        });

        marker.unmark({ className: UNMARK_ELEMENT_LABEL });
    }
}

export interface Range {
    start: number;
    length: number;
}

export type EachElementRangesCallback = (
    range: Range
) => (element: HTMLElement, instance?: number) => void;

export async function markRanges(
    element: HTMLElement,
    ranges: Range[],
    eachRangeCallback: EachElementRangesCallback,
    accuracy: Accuracy
) {
    if (ranges.length || hasEverMarked) {
        hasEverMarked = true;
        const MarkJS = await getMarkJS();
        const marker = MarkJS.call(MarkJS, element);

        ranges.forEach(range => {
            let count = 0;
            let options = {
                element: SPAN_ELEMENT_NAME,
                className: createMarkId(),
                // Each element belonging to the same keyword should have the same identifier
                // This is needed for unmarking user highlights on keywords across elements (VSO20847)
                acrossElements: true,
                separateWordSearch: false,
                accuracy: accuracy,
                each: (matchedElement: HTMLElement) => {
                    if (!isEmptyElement(matchedElement)) {
                        eachRangeCallback(range)(matchedElement, count);
                        count++;
                    }
                },
            };
            marker.markRanges([range], options);
        });

        marker.unmark({ className: UNMARK_ELEMENT_LABEL });
    }
}

function isEmptyElement(element: HTMLElement): boolean {
    let content = element.innerHTML.replace(/&nbsp;/gi, '').trim();
    if (!content) {
        // Elements whose content is blank (i.e. breaks, empty table elements,
        // or spans whose content just include whitespace) should not be highlighted
        // Add class name denoting should be removed later
        element.classList.add(UNMARK_ELEMENT_LABEL);
        return true;
    }

    return false;
}

function isStartingWithSpecialChar(regex: string): boolean {
    const regex_char = regex[0];
    if (
        regex_char == '+' ||
        regex_char == '\\' ||
        regex_char == '*' ||
        regex_char == '.' ||
        regex_char == '[' ||
        regex_char == ']' ||
        regex_char == '-' ||
        regex_char == '(' ||
        regex_char == ')' ||
        regex_char == '{' ||
        regex_char == '}' ||
        regex_char == '?' ||
        regex_char == '^' ||
        regex_char == '$'
    ) {
        return true;
    }
    return false;
}

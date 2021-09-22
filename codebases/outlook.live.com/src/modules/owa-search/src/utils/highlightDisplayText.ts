import {
    SPACE_REGEX,
    NONBREAKING_SPACE_CHAR,
    START_MATCH_DELIMITER,
    START_MATCH_DELIMITER_REGEXP,
    END_MATCH_DELIMITER_REGEXP,
    END_MATCH_DELIMITER,
} from 'owa-search-constants';

export interface HighlightedTextRegion {
    isHighlighted: boolean;
    text: string;
}

export default function highlightDisplayText(displayText: string): HighlightedTextRegion[] {
    if (!displayText) {
        return [];
    }

    // Split the string into substrings that have exactly one highlighted area
    const highlightSubstrings = displayText
        .replace(SPACE_REGEX, NONBREAKING_SPACE_CHAR)
        .split(START_MATCH_DELIMITER);

    // Build an array of highlighted and unhighlighted regions
    const highlightTextRegions = highlightSubstrings.reduce(
        (arr, current) =>
            arr.concat(
                // Split the current substring into a highlighted region and an unhighlighted region
                current.split(END_MATCH_DELIMITER).map((substr, i, subArr) => {
                    return {
                        // if there are two sections, then the first one came before
                        // the highlight end mark, and the second came after. If there
                        // is only one section, then there was no highlighting to begin with.
                        isHighlighted: i == 0 && subArr.length == 2,
                        text: substr,
                    };
                })
            ),
        []
    );

    return highlightTextRegions;
}

export function dehighlightDisplayText(displayText: string): string {
    return displayText
        .replace(START_MATCH_DELIMITER_REGEXP, '')
        .replace(END_MATCH_DELIMITER_REGEXP, '');
}

import type { HighlightedTextRegion } from './highlightDisplayText';

export default function highlightDisplayTextWithQuery(
    displayText: string,
    query: string
): HighlightedTextRegion[] {
    const highlightTextRegions: HighlightedTextRegion[] = [];

    const indexOfMatch = displayText.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());

    if (indexOfMatch < 0) {
        highlightTextRegions.push({ text: displayText, isHighlighted: false });
    } else {
        highlightTextRegions.push({
            text: displayText.substr(0, indexOfMatch),
            isHighlighted: false,
        });

        highlightTextRegions.push({
            text: displayText.substr(indexOfMatch, query.length),
            isHighlighted: true,
        });

        highlightTextRegions.push({
            text: displayText.substr(indexOfMatch + query.length),
            isHighlighted: false,
        });
    }

    return highlightTextRegions;
}

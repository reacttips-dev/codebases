import * as React from 'react';
import type { HighlightedTextRegion } from './highlightDisplayText';
import searchSuggestionStyles from '../components/suggestions/searchSuggestion/SearchSuggestion.scss';

export default function getHighlightedTextForSuggestion(regions: HighlightedTextRegion[]) {
    return regions
        .filter(e => e.text.length > 0)
        .map((e, i) => {
            const className = e.isHighlighted
                ? searchSuggestionStyles.keywordMatchSuggestion
                : searchSuggestionStyles.keywordNonMatchSuggestion;
            return (
                <div className={className} key={i}>
                    {e.text}
                </div>
            );
        });
}

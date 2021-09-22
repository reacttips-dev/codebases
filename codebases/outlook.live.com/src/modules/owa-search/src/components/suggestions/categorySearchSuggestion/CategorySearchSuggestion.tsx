import * as React from 'react';
import SearchSuggestion from '../searchSuggestion/SearchSuggestion';
import type { CategorySearchSuggestion as CategorySuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { observer } from 'mobx-react-lite';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { SMALL_SUGGESTION_HEIGHT } from 'owa-search-constants';
import { CategoryIcon, getMasterCategoryList } from 'owa-categories';
import getHighlightedTextForSuggestion from '../../../utils/getHighlightedTextForSuggestion';
import highlightDisplayTextWithQuery from '../../../utils/highlightDisplayTextWithQuery';

import styles from './CategorySearchSuggestion.scss';

export interface CategorySearchSuggestionProps {
    index: number;
    scenarioId: SearchScenarioId;
    suggestion: CategorySuggestion;
    suggestionSetTraceId: string;
}

const CategorySearchSuggestion = observer(function CategorySearchSuggestion(
    props: CategorySearchSuggestionProps
) {
    const { index, scenarioId, suggestion, suggestionSetTraceId } = props;

    const categoryName = suggestion.Name;

    const highlightedDisplayText = highlightDisplayTextWithQuery(
        suggestion.Name,
        getScenarioStore(scenarioId).searchTextForSuggestion
    );

    const style: React.CSSProperties = {
        lineHeight: `${SMALL_SUGGESTION_HEIGHT}px`,
    };

    return (
        <SearchSuggestion
            ariaLabel={categoryName}
            content={
                <div className={styles.container} style={style}>
                    <CategoryIcon
                        categoryName={categoryName}
                        iconClassName={styles.icon}
                        categoryList={getMasterCategoryList()}
                    />
                    {getHighlightedTextForSuggestion(highlightedDisplayText)}
                </div>
            }
            suggestion={suggestion}
            suggestionSetTraceId={suggestionSetTraceId}
            scenarioId={scenarioId}
            index={index}
        />
    );
});
export default CategorySearchSuggestion;

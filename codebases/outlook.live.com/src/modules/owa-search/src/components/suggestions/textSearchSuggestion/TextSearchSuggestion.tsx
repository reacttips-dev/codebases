import * as React from 'react';
import getHighlightedTextForSuggestion from '../../../utils/getHighlightedTextForSuggestion';
import highlightDisplayText from '../../../utils/highlightDisplayText';
import SearchSuggestion from '../searchSuggestion/SearchSuggestion';
import { ControlIcons } from 'owa-control-icons';
import { Icon } from '@fluentui/react/lib/Icon';
import type { KeywordSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { observer } from 'mobx-react-lite';
import type { SearchScenarioId } from 'owa-search-store';
import { SMALL_SUGGESTION_HEIGHT } from 'owa-search-constants';

import searchSuggestionStyles from '../searchSuggestion/SearchSuggestion.scss';
import styles from './TextSearchSuggestion.scss';

export interface TextSearchSuggestionProps {
    index: number;
    scenarioId: SearchScenarioId;
    suggestion: KeywordSuggestion;
    suggestionSetTraceId: string;
}

const TextSearchSuggestion = observer(function TextSearchSuggestion(
    props: TextSearchSuggestionProps
) {
    const { index, scenarioId, suggestion, suggestionSetTraceId } = props;

    const highlightTextRegions = highlightDisplayText(suggestion.DisplayText);

    const style: React.CSSProperties = {
        lineHeight: `${SMALL_SUGGESTION_HEIGHT}px`,
    };

    return (
        <SearchSuggestion
            ariaLabel={suggestion.QueryText}
            content={
                <div className={styles.container} style={style}>
                    <Icon
                        className={searchSuggestionStyles.icon}
                        iconName={
                            suggestion.Attributes?.IsHistory
                                ? ControlIcons.History
                                : ControlIcons.Search
                        }
                    />
                    {getHighlightedTextForSuggestion(highlightTextRegions)}
                </div>
            }
            suggestion={suggestion}
            scenarioId={scenarioId}
            suggestionSetTraceId={suggestionSetTraceId}
            index={index}
        />
    );
});
export default TextSearchSuggestion;

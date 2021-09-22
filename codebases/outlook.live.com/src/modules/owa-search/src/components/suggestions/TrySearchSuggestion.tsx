import * as React from 'react';
import getHighlightedTextForSuggestion from '../../utils/getHighlightedTextForSuggestion';
import SearchSuggestion from './searchSuggestion/SearchSuggestion';
import { ControlIcons } from 'owa-control-icons';
import { Icon } from '@fluentui/react/lib/Icon';
import { observer } from 'mobx-react-lite';
import type { SearchScenarioId } from 'owa-search-store';
import highlightDisplayText from '../../utils/highlightDisplayText';
import { SMALL_SUGGESTION_HEIGHT } from 'owa-search-constants';
import type { TrySearchSuggestion as TrySearchSuggestionType } from 'owa-search-service/lib/data/schema/SuggestionSet';

import searchSuggestionStyles from './searchSuggestion/SearchSuggestion.scss';
import styles from './textSearchSuggestion/TextSearchSuggestion.scss';

export interface TrySearchSuggestionProps {
    index: number;
    scenarioId: SearchScenarioId;
    suggestion: TrySearchSuggestionType;
    suggestionSetTraceId: string;
}

const TrySearchSuggestion = observer(function TrySearchSuggestion(props: TrySearchSuggestionProps) {
    const { index, scenarioId, suggestion, suggestionSetTraceId } = props;

    const hitHighlightedDisplayText = highlightDisplayText(suggestion.QueryText);
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
                        iconName={ControlIcons.Lightbulb}
                    />
                    {getHighlightedTextForSuggestion(hitHighlightedDisplayText)}
                </div>
            }
            suggestion={suggestion}
            scenarioId={scenarioId}
            suggestionSetTraceId={suggestionSetTraceId}
            index={index}
        />
    );
});

export default TrySearchSuggestion;

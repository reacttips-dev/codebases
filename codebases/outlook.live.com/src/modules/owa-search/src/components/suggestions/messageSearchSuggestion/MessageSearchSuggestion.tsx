import * as React from 'react';
import { formatRelativeDate } from 'owa-observable-datetime';
import getHighlightedTextForSuggestion from '../../../utils/getHighlightedTextForSuggestion';
import SearchSuggestion from '../searchSuggestion/SearchSuggestion';
import { ControlIcons } from 'owa-control-icons';
import { Icon } from '@fluentui/react/lib/Icon';
import { LARGE_SUGGESTION_HEIGHT, SMALL_SUGGESTION_HEIGHT } from 'owa-search-constants';
import type { MessageSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { observer } from 'mobx-react-lite';
import type { SearchScenarioId } from 'owa-search-store';
import highlightDisplayText from '../../../utils/highlightDisplayText';

import searchSuggestionStyles from '../searchSuggestion/SearchSuggestion.scss';
import styles from './MessageSearchSuggestion.scss';

export interface MessageSearchSuggestionProps {
    index: number;
    scenarioId: SearchScenarioId;
    suggestion: MessageSuggestion;
    suggestionSetTraceId: string;
}

const MessageSearchSuggestion = observer(function MessageSearchSuggestion(
    props: MessageSearchSuggestionProps
) {
    const { index, scenarioId, suggestion, suggestionSetTraceId } = props;

    const highlightSubjectRegions = highlightDisplayText(suggestion.Subject);
    const highlightDisplayNameRegions = highlightDisplayText(suggestion.DisplayName);

    const contentContainerStyle: React.CSSProperties = {
        lineHeight: `${LARGE_SUGGESTION_HEIGHT}px`,
    };

    const messageContentContainerStyle: React.CSSProperties = {
        lineHeight: `${SMALL_SUGGESTION_HEIGHT / 2}px`,
    };

    return (
        <SearchSuggestion
            ariaLabel={suggestion.Subject}
            content={
                <div className={styles.container} style={contentContainerStyle}>
                    <Icon className={searchSuggestionStyles.icon} iconName={ControlIcons.Mail} />
                    <div
                        className={styles.messageContentContainer}
                        style={messageContentContainerStyle}>
                        <div className={styles.messageSubject}>
                            {getHighlightedTextForSuggestion(highlightSubjectRegions)}
                        </div>
                        <div className={styles.messageSender}>
                            {getHighlightedTextForSuggestion(highlightDisplayNameRegions)}
                        </div>
                    </div>
                    <div
                        className={styles.messageSecondaryContainer}
                        style={messageContentContainerStyle}>
                        {suggestion.HasAttachments && (
                            <Icon
                                className={styles.messageSecondaryAttachment}
                                iconName={ControlIcons.Attach}
                            />
                        )}
                        <div className={styles.messageSecondaryContent}>
                            {formatRelativeDate(suggestion.DateTimeReceived)}
                        </div>
                    </div>
                </div>
            }
            suggestion={suggestion}
            scenarioId={scenarioId}
            suggestionSetTraceId={suggestionSetTraceId}
            index={index}
        />
    );
});
export default MessageSearchSuggestion;

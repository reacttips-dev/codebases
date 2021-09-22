import * as React from 'react';
import getHighlightedTextForSuggestion from '../../../utils/getHighlightedTextForSuggestion';
import SearchSuggestion from '../searchSuggestion/SearchSuggestion';
import { ControlIcons } from 'owa-control-icons';
import { Icon } from '@fluentui/react/lib/Icon';
import {
    CLICK_ACTION_SOURCE,
    LARGE_SUGGESTION_HEIGHT,
    SMALL_SUGGESTION_HEIGHT,
} from 'owa-search-constants';
import formatMeetingTimeSpan from 'owa-timeformat/lib/utils/formatMeetingTimeSpan';
import type { EventSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { observer } from 'mobx-react-lite';
import type { SearchScenarioId } from 'owa-search-store';
import highlightDisplayText from '../../../utils/highlightDisplayText';
import { IButtonStyles, IconButton } from '@fluentui/react/lib/Button';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import universalSuggestionStyles from '../searchSuggestion/SearchSuggestion.scss';
import { exitSearch, suggestionSecondaryActionSelected } from 'owa-search-actions';
import { shouldShowJoinQuickAction } from '../../../utils/shouldShowJoinQuickAction';
import loc from 'owa-localize';
import { eventJoinMeetingQuickAction } from './EventSearchSuggestion.locstring.json';
import styles from './EventSearchSuggestion.scss';

export interface EventSearchSuggestionProps {
    index: number;
    scenarioId: SearchScenarioId;
    suggestion: EventSuggestion;
    suggestionSetTraceId: string;
}

const EventSearchSuggestion = observer(function EventSearchSuggestion(
    props: EventSearchSuggestionProps
) {
    const { index, scenarioId, suggestion, suggestionSetTraceId } = props;

    const highlightText = highlightDisplayText(suggestion.Text);

    const contentContainerStyle: React.CSSProperties = {
        lineHeight: `${LARGE_SUGGESTION_HEIGHT}px`,
    };

    const eventContentContainerStyle: React.CSSProperties = {
        lineHeight: `${SMALL_SUGGESTION_HEIGHT / 2}px`,
    };

    const secondaryData: string[] = [];

    if (suggestion.Start) {
        secondaryData.push(formatMeetingTimeSpan(suggestion.Start, suggestion.End));
    }

    if (suggestion.Location && suggestion.Location !== '') {
        secondaryData.push(suggestion.Location);
    }

    const secondaryDataString = secondaryData.join(', ');

    const getQuickActions = () => {
        const { suggestion, scenarioId, index, suggestionSetTraceId } = props;
        const joinSuggestedMeeting = ev => {
            ev.stopPropagation();
            suggestionSecondaryActionSelected(
                suggestion,
                index,
                CLICK_ACTION_SOURCE,
                scenarioId,
                suggestionSetTraceId,
                'JoinMeeting' /*EntityActionTakenType*/
            );
            window.open(suggestion.OnlineMeetingUrl || suggestion.SkypeTeamsMeetingUrl, '_blank');
            exitSearch('SearchBoxSuggestionDropDown', scenarioId);
        };

        const quickActionButtonStyles: IButtonStyles = {
            root: {
                height: LARGE_SUGGESTION_HEIGHT,
            },
        };

        const quickActions = [];

        // Add the "Join meeting" button if the event is online, upcoming/ongoing, and not all day or cancelled
        if (shouldShowJoinQuickAction(suggestion)) {
            quickActions.push(
                <TooltipHost
                    content={loc(eventJoinMeetingQuickAction)}
                    directionalHint={DirectionalHint.topCenter}
                    id={`joinOnlineMeetingButton-${index}`}>
                    <IconButton
                        iconProps={{
                            iconName: ControlIcons.Video,
                        }}
                        className={universalSuggestionStyles.suggestionIconButton}
                        onClick={joinSuggestedMeeting}
                        aria-describedby={`joinOnlineMeetingButton-${index}`}
                        styles={quickActionButtonStyles}
                        aria-label={loc(eventJoinMeetingQuickAction)}
                    />
                </TooltipHost>
            );
        }

        return quickActions;
    };

    return (
        <SearchSuggestion
            ariaLabel={suggestion.Subject}
            content={
                <div className={styles.container} style={contentContainerStyle}>
                    <Icon
                        className={universalSuggestionStyles.icon}
                        iconName={ControlIcons.Calendar}
                    />
                    <div
                        className={styles.eventContentContainer}
                        style={eventContentContainerStyle}>
                        <div className={styles.eventSubject}>
                            {getHighlightedTextForSuggestion(highlightText)}
                        </div>
                        {secondaryDataString && (
                            <div className={styles.secondaryText}>
                                <span>{secondaryDataString}</span>
                            </div>
                        )}
                    </div>
                </div>
            }
            suggestion={suggestion}
            scenarioId={scenarioId}
            suggestionSetTraceId={suggestionSetTraceId}
            index={index}
            quickActions={getQuickActions()}
        />
    );
});

export default EventSearchSuggestion;

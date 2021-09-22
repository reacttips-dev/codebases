import { peopleContactCardQuickAction } from './PeopleSearchSuggestion.locstring.json';
import PeopleSuggestionPersonaCard from './PeopleSuggestionPersonaCard';
import type { SearchScenarioId } from 'owa-search-store';
import getHighlightedTextForSuggestion from '../../../utils/getHighlightedTextForSuggestion';
import highlightDisplayText from '../../../utils/highlightDisplayText';
import SearchSuggestion from '../searchSuggestion/SearchSuggestion';
import { IPersonaProps, PersonaSize } from '@fluentui/react/lib/Persona';
import { TooltipHost, TooltipOverflowMode } from '@fluentui/react/lib/Tooltip';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { observer } from 'mobx-react-lite';
import loc from 'owa-localize';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import type { PeopleSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import * as React from 'react';

import styles from './PeopleSearchSuggestion.scss';

export interface PeopleSuggestionProps {
    index: number;
    scenarioId: SearchScenarioId;
    suggestion: PeopleSuggestion;
    suggestionSetTraceId: string;
}

export const PeopleSearchSuggestion = observer(function PeopleSearchSuggestion(
    props: PeopleSuggestionProps
) {
    const onRenderPrimaryText = (hitHighlightedDisplayText: JSX.Element[]) => {
        return (props: IPersonaProps): JSX.Element => {
            return (
                <TooltipHost
                    content={props.primaryText}
                    directionalHint={DirectionalHint.topLeftEdge}
                    overflowMode={TooltipOverflowMode.Parent}>
                    {hitHighlightedDisplayText}
                </TooltipHost>
            );
        };
    };
    const getQuickActions = () => {
        const { suggestion, scenarioId, index, suggestionSetTraceId } = props;
        const quickActions = [];

        // Add the "View profile" button for enterprise users.
        if (!isConsumer()) {
            quickActions.push(
                <TooltipHost
                    content={loc(peopleContactCardQuickAction)}
                    directionalHint={DirectionalHint.topCenter}
                    id={`personaCardButton-${index}`}>
                    <PeopleSuggestionPersonaCard
                        name={suggestion.DisplayName}
                        emailAddress={suggestion.EmailAddresses[0]}
                        disableHover={true}
                        locationToOpen={'ExpandedView'}
                        aria-describedby={`personaCardButton-${index}`}
                        scenarioId={scenarioId}
                        clientScenario={'PersonaSuggestionLPC'}
                        suggestionIndex={index}
                        suggestion={suggestion}
                        suggestionSetTraceId={suggestionSetTraceId}
                    />
                </TooltipHost>
            );
        }

        return quickActions;
    };
    const { index, scenarioId, suggestion, suggestionSetTraceId } = props;
    /**
     * This calculation is here (instead of inside of onRenderPrimaryText
     * where it is used) so the render function takes a dependency on
     * suggesiton.HighlightedDisplayName and re-renders properly. See VSTS
     * #33079 for more details.
     */
    const hitHighlightedDisplayText = getHighlightedTextForSuggestion(
        highlightDisplayText(suggestion.HighlightedDisplayName)
    );

    const emailAddress = suggestion.EmailAddresses[0];

    const displayEmailAddress = suggestion.EmailAddressDisplayText
        ? suggestion.EmailAddressDisplayText
        : suggestion.EmailAddresses[0];

    return (
        <SearchSuggestion
            ariaLabel={suggestion.DisplayName}
            content={
                <PersonaControl
                    className={styles.personaControl}
                    emailAddress={emailAddress}
                    name={suggestion.DisplayName}
                    secondaryText={displayEmailAddress}
                    showSecondaryText={true}
                    showPersonaDetails={true}
                    showPresence={false}
                    size={PersonaSize.size28}
                    onRenderPrimaryText={onRenderPrimaryText(hitHighlightedDisplayText)}
                    mailboxType={suggestion.MailboxType}
                />
            }
            quickActions={getQuickActions()}
            suggestion={suggestion}
            scenarioId={scenarioId}
            suggestionSetTraceId={suggestionSetTraceId}
            index={index}
        />
    );
});

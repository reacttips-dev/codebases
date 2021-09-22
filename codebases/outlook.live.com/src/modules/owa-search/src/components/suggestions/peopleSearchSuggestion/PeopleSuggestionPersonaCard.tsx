import { CLICK_ACTION_SOURCE } from 'owa-search-constants';
import type { SearchScenarioId } from 'owa-search-store';
import { observer } from 'mobx-react-lite';
import { IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import { suggestionSecondaryActionSelected } from 'owa-search-actions';
import type { Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import * as React from 'react';
import {
    useLivePersonaCard,
    PersonaCardBehaviorProps,
} from 'owa-persona/lib/components/PersonaCardBehavior';
import { lazyPersonaControlStore } from '../../../lazyFunctions';

import universalSuggestionStyles from '../searchSuggestion/SearchSuggestion.scss';

interface PeopleSuggestionPersonaCardProps extends PersonaCardBehaviorProps {
    scenarioId: SearchScenarioId;
    suggestion: Suggestion;
    suggestionSetTraceId: string;
    suggestionIndex: number;
}

export default observer(function PeopleSuggestionPersonaCard(
    props: PeopleSuggestionPersonaCardProps
) {
    let personaControlStore = lazyPersonaControlStore.tryImportForRender();
    const PersonaCardBehavior = useLivePersonaCard(props);

    const { scenarioId, suggestionIndex, suggestion, suggestionSetTraceId } = props;

    const onClick = React.useCallback(() => {
        suggestionSecondaryActionSelected(
            suggestion,
            suggestionIndex,
            CLICK_ACTION_SOURCE,
            scenarioId,
            suggestionSetTraceId,
            'OpenContactCard' /*EntityActionTakenType*/
        );
    }, [suggestion, suggestionSetTraceId, suggestionIndex]);

    return (
        <PersonaCardBehavior>
            <IconButton
                role={'presentation'}
                iconProps={{
                    iconName: ControlIcons.ContactCard,
                }}
                className={universalSuggestionStyles.suggestionIconButton}
                onClick={onClick}
                disabled={!personaControlStore?.isLivePersonaCardInitialized}
            />
        </PersonaCardBehavior>
    );
});

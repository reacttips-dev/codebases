import type FlaggedToken from 'owa-search-service/lib/data/schema/FlaggedToken';
import { getScenarioStore, SearchScenarioId } from 'owa-search-store';
import { mutatorAction } from 'satcheljs';
import type { QueryAlterationType } from 'owa-search-service/lib/data/schema/SubstrateSearchResponse';

export default mutatorAction(
    'setSpellerData',
    function setAlteredQuery(
        alteredQuery: string,
        suggestedSearchTerm: string,
        suggestedSearchTermReferenceId: string,
        flaggedTokens: FlaggedToken[],
        recourseQuery: string,
        scenarioId: SearchScenarioId,
        queryAlterationType: QueryAlterationType,
        providerId: string,
        queryAlterationLogicalId: string,
        alterationDisplayText: string
    ) {
        const store = getScenarioStore(scenarioId);

        store.alteredQuery = alteredQuery;
        store.suggestedSearchTerm = suggestedSearchTerm;
        store.suggestedSearchTermReferenceId = suggestedSearchTermReferenceId;
        store.flaggedTokens = flaggedTokens;
        store.recourseQuery = recourseQuery;
        store.queryAlterationType = queryAlterationType;
        store.alterationProviderId = providerId;
        store.queryAlterationLogicalId = queryAlterationLogicalId;
        store.alterationDisplayText = alterationDisplayText;
    }
);

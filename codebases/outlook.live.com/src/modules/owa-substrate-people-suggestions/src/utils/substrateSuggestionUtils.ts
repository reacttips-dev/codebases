import { isTrieCacheEnabled } from './isTrieCacheEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';

const BASE_SUGGESTION_FIELDS = [
    'Id',
    'ADObjectId',
    'DisplayName',
    'EmailAddresses',
    'PeopleSubtype',
    'PeopleType',
    'PDLItemId',
    'PersonaId',
    'ImAddress',
    'JobTitle',
];

const SUGGESTION_FIELDS_TOPN = BASE_SUGGESTION_FIELDS.concat([
    'FeatureData',
    'GivenName',
    'Surname',
    'Alias',
    'AdditionalNames',
]);
const SUGGESTION_FIELDS_SEARCH = BASE_SUGGESTION_FIELDS.concat(['FeatureData']);
const SUGGESTION_FIELDS_PEOPLE_CARD = BASE_SUGGESTION_FIELDS.concat([
    'Phones',
    'OfficeLocation',
    'Department',
]);

export function getSubstrateSuggestionFields(
    scenario: SubstrateScenario,
    isCachePopulated: boolean = true
): string[] {
    return scenario === SubstrateScenario.PeopleCard
        ? SUGGESTION_FIELDS_PEOPLE_CARD
        : isTrieCacheEnabled() && isCachePopulated
        ? getTrieCacheEnabledSuggestionFields(scenario)
        : BASE_SUGGESTION_FIELDS;
}

function getTrieCacheEnabledSuggestionFields(scenario: SubstrateScenario): string[] {
    let suggestionsField =
        scenario == SubstrateScenario.TopN
            ? [...SUGGESTION_FIELDS_TOPN]
            : [...SUGGESTION_FIELDS_SEARCH];

    if (isFeatureEnabled('rp-enableCsrFvlJoin')) {
        // Enable logging of compliant PersonId
        suggestionsField.push('PersonId');
    }

    return suggestionsField;
}

export const enum SubstrateScenario {
    TopN,
    Search,
    PeopleCard,
}

import type ContextProperty from 'owa-service/lib/contract/ContextProperty';
import type FindPeopleRequest from 'owa-service/lib/contract/FindPeopleRequest';
import type FindPeopleResponseMessage from 'owa-service/lib/contract/FindPeopleResponseMessage';
import type IndexedPageView from 'owa-service/lib/contract/IndexedPageView';
import type PersonaResponseShape from 'owa-service/lib/contract/PersonaResponseShape';
import contextProperty from 'owa-service/lib/factory/contextProperty';
import findPeopleJsonRequest from 'owa-service/lib/factory/findPeopleJsonRequest';
import findPeopleRequest from 'owa-service/lib/factory/findPeopleRequest';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import personaResponseShape from 'owa-service/lib/factory/personaResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import findPeopleOperation from 'owa-service/lib/operation/findPeopleOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

const INITIAL_CACHE_SIZE = 500;
const OWA_COMPOSE_SCENARIO_STRING = 'owa.react.compose';

function configureIndexedPageView(): IndexedPageView {
    return indexedPageView({
        BasePoint: 'Beginning',
        Offset: 0,
        MaxEntriesReturned: INITIAL_CACHE_SIZE,
    });
}

function configureRequestBody(): FindPeopleRequest {
    return findPeopleRequest({
        IndexedPageItemView: configureIndexedPageView(),
        PersonaShape: configurePersonaShape(),
        QuerySources: ['Mailbox'],
        QueryString: '',
        SearchPeopleSuggestionIndex: true,
        ShouldResolveOneOffEmailAddress: false,
        Context: configureContext(),
    });
}

function configureContext(): ContextProperty[] {
    return [
        contextProperty({ Key: 'AppName', Value: 'OWA' }),
        contextProperty({ Key: 'AppScenario', Value: OWA_COMPOSE_SCENARIO_STRING }),
    ];
}

function configurePersonaShape(): PersonaResponseShape {
    let personaShape = personaResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [
            propertyUri({ FieldURI: 'PersonaEmailAddress' }),
            propertyUri({ FieldURI: 'EmailAddresses' }),
            propertyUri({ FieldURI: 'PersonaDisplayName' }),
            propertyUri({ FieldURI: 'PersonaDisplayNames' }),
            propertyUri({ FieldURI: 'PersonaId' }),
            propertyUri({ FieldURI: 'PersonaType' }),
            propertyUri({ FieldURI: 'PersonaImAddress' }),
            propertyUri({ FieldURI: 'PersonaTitle' }),
        ],
    });

    return personaShape;
}

export function findPeople(): Promise<FindPeopleResponseMessage> {
    let requestBody = configureRequestBody();
    return findPeopleOperation(
        findPeopleJsonRequest({
            Header: getJsonRequestHeader(),
            Body: requestBody,
        })
    ).then(response => {
        let responseMessage: FindPeopleResponseMessage = response.Body;
        return responseMessage;
    });
}

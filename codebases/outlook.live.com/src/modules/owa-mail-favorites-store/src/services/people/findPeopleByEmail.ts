import type FindPeopleRequest from 'owa-service/lib/contract/FindPeopleRequest';
import type FindPeopleResponseMessage from 'owa-service/lib/contract/FindPeopleResponseMessage';
import type IndexedPageView from 'owa-service/lib/contract/IndexedPageView';
import type PersonaResponseShape from 'owa-service/lib/contract/PersonaResponseShape';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import findPeopleJsonRequest from 'owa-service/lib/factory/findPeopleJsonRequest';
import findPeopleRequest from 'owa-service/lib/factory/findPeopleRequest';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import personaResponseShape from 'owa-service/lib/factory/personaResponseShape';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import findPeopleOperation from 'owa-service/lib/operation/findPeopleOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type ContextProperty from 'owa-service/lib/contract/ContextProperty';
import contextProperty from 'owa-service/lib/factory/contextProperty';

export type FindPeopleResultWithRequestId = {
    personas: PersonaType[];
    requestId?: string;
};

const defaultPageView: IndexedPageView = {
    BasePoint: 'Beginning',
    Offset: 0,
    MaxEntriesReturned: 10,
};

const defaultShape: PersonaResponseShape = {
    BaseShape: 'Default',
};

function configureContext(): ContextProperty[] {
    return [contextProperty({ Key: 'AppName', Value: 'OWA' })];
}

// Setting SearchPeopleSuggestionIndex to true will resolve the displayName correctly for non-contacts
function createFindPeopleRequest(queryString: string): FindPeopleRequest {
    return findPeopleRequest({
        IndexedPageItemView: indexedPageView(defaultPageView),
        PersonaShape: personaResponseShape(defaultShape),
        QuerySources: ['Mailbox', 'Directory'],
        QueryString: queryString,
        SearchPeopleSuggestionIndex: true,
        ShouldResolveOneOffEmailAddress: true,
        Context: configureContext(),
    });
}

// Setting SearchPeopleSuggestionIndex to false will return also contacts
// Contacts will be searched in the root folder 'MyContacts'
function createFindContactsRequest(queryString: string): FindPeopleRequest {
    return findPeopleRequest({
        IndexedPageItemView: indexedPageView(defaultPageView),
        PersonaShape: personaResponseShape(defaultShape),
        QuerySources: ['Mailbox'],
        QueryString: queryString,
        ParentFolderId: targetFolderId({
            BaseFolderId: distinguishedFolderId({
                Id: 'mycontacts',
            }),
        }),
        Context: configureContext(),
    });
}

function processResponseMessage(
    responseMessage: FindPeopleResponseMessage,
    isContact: boolean
): FindPeopleResultWithRequestId {
    if (responseMessage.ResponseClass == 'Success') {
        return { personas: responseMessage.ResultSet, requestId: responseMessage.TransactionId };
    }

    throw new Error(
        `FindPeople failed (${responseMessage.ResponseCode} ${responseMessage.MessageText} ${isContact})`
    );
}

export function findPeopleByEmail(queryString: string): Promise<FindPeopleResultWithRequestId> {
    return findPeopleOperation(
        findPeopleJsonRequest({
            Header: getJsonRequestHeader(),
            Body: createFindPeopleRequest(queryString),
        })
    ).then(response => {
        return processResponseMessage(response.Body, false);
    });
}

export function findContactsByEmail(queryString: string): Promise<FindPeopleResultWithRequestId> {
    return findPeopleOperation(
        findPeopleJsonRequest({
            Header: getJsonRequestHeader(),
            Body: createFindContactsRequest(queryString),
        })
    ).then(response => {
        return processResponseMessage(response.Body, true);
    });
}

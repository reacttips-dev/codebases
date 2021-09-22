import type FindPeopleJsonRequest from 'owa-service/lib/contract/FindPeopleJsonRequest';
import type FindPeopleRequest from 'owa-service/lib/contract/FindPeopleRequest';
import type IndexedPageView from 'owa-service/lib/contract/IndexedPageView';
import type PersonaResponseShape from 'owa-service/lib/contract/PersonaResponseShape';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import findPeopleJsonRequest from 'owa-service/lib/factory/findPeopleJsonRequest';
import findPeopleRequest from 'owa-service/lib/factory/findPeopleRequest';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import personaResponseShape from 'owa-service/lib/factory/personaResponseShape';
import findPeopleOperation from 'owa-service/lib/operation/findPeopleOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

const defaultShape: PersonaResponseShape = {
    BaseShape: 'Default',
};

export default function getPeopleSuggestionsService(
    searchText: string,
    searchSessionGuid: string,
    maxResults: number
): Promise<PersonaType[]> {
    return findPeopleOperation(
        findPeopleJsonRequest(<FindPeopleJsonRequest>{
            Header: getJsonRequestHeader(),
            Body: findPeopleRequest(<FindPeopleRequest>{
                IndexedPageItemView: indexedPageView(<IndexedPageView>{
                    BasePoint: 'Beginning',
                    Offset: 0,
                    MaxEntriesReturned: maxResults,
                }),
                PersonaShape: personaResponseShape(defaultShape),
                QuerySources: ['Mailbox', 'Directory'],
                QueryString: searchText,
                SearchPeopleSuggestionIndex: true,
                ShouldResolveOneOffEmailAddress: false,
            }),
        })
    ).then(
        response => {
            // If request is successful, return results.
            if (
                response?.Body &&
                response.Body.ResponseClass == 'Success' &&
                response.Body.ResultSet
            ) {
                return response.Body.ResultSet;
            }

            // Return empty array if response is not successful.
            return [];
        },
        reason => {
            // Return empty array if request is not successful.
            return [];
        }
    );
}

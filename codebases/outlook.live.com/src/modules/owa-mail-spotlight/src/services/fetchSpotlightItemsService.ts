import { getGuid } from 'owa-guid';
import { isConversationView, TableView } from 'owa-mail-list-store';
import { getDefaultAnchorMailboxCookie } from 'owa-ows-gateway/lib/anchormailbox';
import buildQueryParams from 'owa-search-service/lib/helpers/buildQueryParams';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getAccessTokenforResourceAsLazy } from 'owa-tokenprovider';
import { getUrlWithAddedQueryParameters } from 'owa-url';

const RECOMMENDATIONS_ENDPOINT = '/search/api/v1/recommendations';

const fetchSpotlightItemsService = async (inboxTableView: TableView): Promise<Response> => {
    const token: string = await getTokenForRecommendationsApi();

    const requestInit = createRequestInit(
        getGuid() /* clientRequestId */,
        token,
        isConversationView(inboxTableView)
    );

    const response: Response = await fetch(
        getUrlWithAddedQueryParameters(RECOMMENDATIONS_ENDPOINT, buildQueryParams()),
        requestInit
    );

    return response;
};

const getTokenForRecommendationsApi = async (): Promise<string> => {
    let [token, tokenPromise] = getAccessTokenforResourceAsLazy(
        window.location.origin,
        'OwaMailSpotlight'
    );

    // If token is not returned synchronously, we need to await on the tokenPromise
    if (!token) {
        token = (await tokenPromise) as string;
    }

    return (token as string) || '';
};

const createRequestInit = (
    clientRequestId: string,
    token: string,
    isConversationView: boolean
): RequestInit => {
    const requestInit: RequestInit = {};
    requestInit.method = 'POST';

    requestInit.headers = new Headers();
    (<Headers>requestInit.headers).set('Authorization', `Bearer ${token}`);
    (<Headers>requestInit.headers).set('Content-Type', 'application/json;charset=utf-8');
    (<Headers>requestInit.headers).set('X-Client-LocalTime', new Date().toISOString());
    (<Headers>requestInit.headers).set('client-request-id', clientRequestId);

    const defaultAnchorMailbox = getDefaultAnchorMailboxCookie();
    if (defaultAnchorMailbox) {
        (<Headers>requestInit.headers).append('X-AnchorMailbox', defaultAnchorMailbox);
    }

    /**
     * Remove this check when 3S supports conversation view.
     * Work Item 79778: Request appropriate entity type when 3S supports "Conversation"
     */
    const isConversationViewSupported = false;

    const data = {
        EntityRequests: [
            {
                EntityType:
                    isConversationView && isConversationViewSupported ? 'Conversation' : 'Message',
                Context: {
                    EntityContext: [
                        {
                            '@type': 'Microsoft.OutlookServices.MailFolder',
                            id: folderNameToId('inbox'),
                        },
                    ],
                },
            },
        ],
        Scenario: {
            Name: 'ContextualInsights',
        },
    };
    requestInit.body = JSON.stringify(data);

    return requestInit;
};

export default fetchSpotlightItemsService;

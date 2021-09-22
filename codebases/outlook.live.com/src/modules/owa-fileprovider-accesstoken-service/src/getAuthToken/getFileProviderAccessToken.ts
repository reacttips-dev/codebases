import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type TokenResponse from 'owa-service/lib/contract/TokenResponse';
import getAccessTokenForDataProviderOperation from 'owa-service/lib/operation/getAccessTokenforDataProviderOperation';
import getAccessTokenForDataProviderRequest from 'owa-service/lib/factory/getAccessTokenForDataProviderRequest';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export interface FileProviderAccessTokenResponse {
    token: TokenResponse;
    response: Response;
}

export default async function getFileProviderAccessTokenRequest(
    fileProviderType: AttachmentDataProviderType,
    resourceUrl: string,
    actionSource?: string,
    claimsChallenge?: string
): Promise<FileProviderAccessTokenResponse> {
    // If the SharePoint call returns status 401 with a claims challenge, we need to send the claims challenge
    // to request another access token.
    const request = getAccessTokenForDataProviderRequest({
        DataProviderType: fileProviderType,
        ResourceUrl: resourceUrl,
        IsGroupRequest: false,
        ClaimsChallenge: claimsChallenge ? atob(claimsChallenge) : null,
    });

    let actionName;
    if (actionSource) {
        actionName = 'getAccessTokenForDataProvider_' + actionSource;
    } else {
        actionName = 'getAccessTokenForDataProvider';
    }
    let headers = new Headers();
    headers.append('X-OWA-ActionName', actionName);
    const options: RequestOptions = {
        headers,
        datapoint: {
            customData: {
                actionSource,
            },
            headersCustomData: (headers: Headers) => {
                return {
                    tokenResultDetails: headers.get('x-tokenresult'),
                };
            },
            jsonCustomData: (json: TokenResponse) => {
                return {
                    tokenStatus: json.TokenResultCode.toString(),
                };
            },
        },
        // We are setting this flag to get the full Response object back from owa-service.
        returnFullResponseOnSuccess: true,
    };

    const response = await (getAccessTokenForDataProviderOperation(
        request,
        options
    ) as Promise<Response>);

    const tokenResponse = (await response.json()) as TokenResponse;

    return {
        token: tokenResponse,
        response: response,
    };
}

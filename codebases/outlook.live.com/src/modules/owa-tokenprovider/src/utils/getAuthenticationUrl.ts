import getAuthenticationUrlOperation from 'owa-service/lib/operation/getAuthenticationUrlOperation';
import AuthenticationUrlResponseCode from 'owa-service/lib/contract/AuthenticationUrlResponseCode';

export default async function getAuthenticationUrl(): Promise<string> {
    const defaultAuthUrl = 'https://login.microsoftonline.com/'; //Set Prod login Url as default
    const response = await getAuthenticationUrlOperation({});
    let authUrl;

    if (
        response?.ResultCode === AuthenticationUrlResponseCode.Success &&
        response?.AuthenticationUrl
    ) {
        // Sample success response- {"ResultCode":0,"WebSessionType":0,"AuthenticationUrl":"https://login.microsoftonline.com/common/oauth2/authorize?client_id={clientId}&redirect_uri={redirectUri}&resource={resource}&response_mode=form_post&response_type=code+id_token&scope=openid&msafed=0&prompt=none&client-request-id={clientRequestId}&protectedtoken=true&claims={claims}&nonce={nonce}&state={state}","ImplicitGrantAuthorizationUrl":""}
        const arr = response.AuthenticationUrl.split('/');
        authUrl = arr[0] + '//' + arr[2] + '/';
    }

    return authUrl ? authUrl : defaultAuthUrl;
}

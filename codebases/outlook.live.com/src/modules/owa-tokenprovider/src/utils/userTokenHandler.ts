import type UserTokenCallback from '../schema/UserTokenCallback';
import { getOrigin } from 'owa-url/lib/getOrigin';
import { lazyGetAuthTokenFromMetaOsHub } from 'owa-metaos-app-bootstrap';
import { shouldGetTokenFromMetaOSHub } from 'owa-metaos-utils';

let userTokenCallback: UserTokenCallback | undefined;

export function setUserTokenCallback(callback?: UserTokenCallback) {
    userTokenCallback = callback;
}

export async function getUserToken(): Promise<string | undefined> {
    // get user token from metaOS hub
    if (shouldGetTokenFromMetaOSHub()) {
        return lazyGetAuthTokenFromMetaOsHub.importAndExecute(getOrigin());
    }

    // get user token from opx host app
    const token = userTokenCallback && (await userTokenCallback());

    if (token && token.length > 0) {
        if (token?.split(' ')[0]?.toLowerCase() === 'bearer') {
            return token.split(' ')[1]; // drop bearer prefix and just return the token value for JWT tokens
        } else if (token?.split(' ')[0]?.toLowerCase() === 'msauth1.0') {
            return token; // return the token value with auth scheme for MSA tokens
        }
    }
    return undefined;
}

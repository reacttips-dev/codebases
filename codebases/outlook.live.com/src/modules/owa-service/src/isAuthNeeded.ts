import type { RequestOptions } from './RequestOptions';
import isExplicitLogonRequest from './isExplicitLogonRequest';

export function isAuthNeeded(requestOptions: RequestOptions): boolean {
    if (!requestOptions) {
        return true;
    }

    return (
        !isExplicitLogonRequest(requestOptions) && requestOptions.authNeededOnUnAuthorized !== false
    );
}

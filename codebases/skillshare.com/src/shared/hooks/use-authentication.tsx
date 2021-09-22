import { useContext } from 'react';
import cookies from 'js-cookie';
import { AuthenticationContext } from '../../components/providers';
import { useEnvironment } from './use-environment';
export var useAuthentication = function () {
    var authCookie = useEnvironment().authCookie;
    var initialState = useContext(AuthenticationContext);
    var isAuthCookieSet = function () {
        if (typeof process === 'undefined' && authCookie) {
            return cookies.get(authCookie) !== undefined;
        }
        return false;
    };
    var localState = {
        isAuthenticated: isAuthCookieSet(),
    };
    return {
        isAuthenticated: initialState.isAuthenticated || localState.isAuthenticated,
    };
};
//# sourceMappingURL=use-authentication.js.map
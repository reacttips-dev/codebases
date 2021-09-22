import { useApple } from '../../shared/hooks';
export function useAppleLogin(redirectUrl) {
    var appleSignIn = useApple(redirectUrl).appleSignIn;
    var appleLogin = function () {
        appleSignIn();
    };
    var appleSignUp = function () {
        appleSignIn();
    };
    return {
        appleLogin: appleLogin,
        appleSignUp: appleSignUp,
    };
}
//# sourceMappingURL=use-apple-login.js.map
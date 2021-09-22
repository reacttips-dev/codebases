import { useAntiBotTokens, useCookies, useRecaptcha, useRequest, } from '../shared/hooks';
export function useAuthFormState() {
    var tokens = useAntiBotTokens().tokens;
    var cookies = useCookies().cookies;
    var csrfToken = cookies && cookies.YII_CSRF_TOKEN ? cookies.YII_CSRF_TOKEN : '';
    var request = useRequest({ isAjaxRequest: true });
    var recaptchaOptions = useRecaptcha();
    return {
        tokens: tokens,
        csrfToken: csrfToken,
        recaptcha: recaptchaOptions,
        request: request,
    };
}
//# sourceMappingURL=useAuthFormState.js.map
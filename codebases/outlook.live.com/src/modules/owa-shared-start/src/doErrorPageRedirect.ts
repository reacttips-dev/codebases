import { redirectTo } from './redirect';

const ERROR_PAGE = '/owa/auth/frowny.aspx';
export function doErrorPageRedirect(query: string) {
    let redirectUrl = query != null ? `${ERROR_PAGE}?${query}` : ERROR_PAGE;
    redirectTo(redirectUrl);
}

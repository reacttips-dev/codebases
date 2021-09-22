import { lazyGetParsedQueryStringFromUrl } from 'owa-sharepoint-link-detector';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import { stringify } from 'querystring';

export async function getSharingLinkSpecialParamsFromUrl(url: string): Promise<string> {
    const getParsedQueryStringFromUrl = await lazyGetParsedQueryStringFromUrl.import();
    const parsed = getParsedQueryStringFromUrl(url);
    return getSharingLinkSpecialParams(parsed);
}

function getSharingLinkSpecialParams(parsed: any): string | null {
    if (!isNullOrWhiteSpace(parsed?.nav)) {
        const navParam = { nav: parsed.nav };
        return stringify(navParam);
    }

    return null;
}

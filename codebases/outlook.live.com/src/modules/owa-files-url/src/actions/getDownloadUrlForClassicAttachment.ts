import { format } from 'owa-localize';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import { OWA_ROOT_PREFIX } from '../constants';
import { Browser, getBrowserInfo, isBrowserIE } from 'owa-user-agent';
import { getClientVersion } from 'owa-config';
import getScopedPath from 'owa-url/lib/getScopedPath';
import { getUrlDataForUserIdentity } from '../utils/getUrlDataForUserIdentity';
import type { ClientAttachmentId } from 'owa-client-ids';
import { getRoutingKeyForMailboxInfo } from '../utils/getRoutingKeyForMailboxInfo';

export default function getDownloadUrlForClassicAttachment(
    id: ClientAttachmentId,
    relativeUrlTemplate: string,
    includeDownloadToken: boolean,
    isPrint: boolean = false,
    attachmentUrl: string = null
): string {
    if (!id || !id.Id || !id.mailboxInfo) {
        return null;
    }
    const filesUrlData = getUrlDataForUserIdentity(id.mailboxInfo);
    const downloadUrlBase = filesUrlData?.downloadUrlBase;
    const routingKey = getRoutingKeyForMailboxInfo(id.mailboxInfo);

    attachmentUrl = attachmentUrl || format(relativeUrlTemplate, encodeURIComponent(id.Id));
    if (!downloadUrlBase || (isPrint && getBrowserInfo().browser === Browser.FIREFOX)) {
        const legacyUrl = OWA_ROOT_PREFIX + attachmentUrl + '&X-OWA-CANARY=' + getOwaCanaryCookie();
        return getScopedPath(legacyUrl);
    }

    let formatString: string = '{0}{1}/{2}';
    if (isConsumer()) {
        formatString += '&isc=1';
    }

    // This default value will appear in gulp deployments, but in production
    //  the actual version will be used instead.
    let result: string = format(formatString, downloadUrlBase, routingKey, attachmentUrl);

    if (includeDownloadToken) {
        result += '&token=' + filesUrlData?.downloadToken;
        result += '&X-OWA-CANARY=' + getOwaCanaryCookie();
    }

    // Those two parameters are for troubleshooting. Since the whole download URL is close to IE's limit (2048 charactors),
    // they will not be added on IE to avoid download failure due to URL length limit.
    if (!isBrowserIE()) {
        result += '&owa=' + window.location.hostname;
        result += '&scriptVer=' + getClientVersion() || 'unofficial';
    }

    return result;
}

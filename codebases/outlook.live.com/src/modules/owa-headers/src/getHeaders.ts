import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import setExplicitLogonHeaders from './setExplicitLogonHeaders';

export default function getHeaders(
    smtp?: string,
    clientActionName?: string,
    addCanary?: boolean,
    prefixedId?: string
): Headers {
    let headers = new Headers();
    if (addCanary) {
        headers.set('X-OWA-CANARY', getOwaCanaryCookie());
    }
    if (clientActionName) {
        headers.set('X-OWA-ActionName', clientActionName);
    }
    if (smtp || prefixedId) {
        if (prefixedId) {
            setExplicitLogonHeaders(smtp, headers, prefixedId);
        } else {
            setExplicitLogonHeaders(smtp, headers);
        }
    }

    return headers;
}

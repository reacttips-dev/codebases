import type { ODSDiagnosticsRequest } from '../schema/ODSDiagnosticsRequest';
import * as HelpCharmConstants from '../utils/HelpCharmConstants';

export default function sendDiagnosticsToODS(
    diagnosticsInfo: ODSDiagnosticsRequest
): Promise<Response> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'text/plain');
    headers.append('X-MS-SARA-API-Version', 'schema-v1');
    headers.append('Host', 'api.diagnostics.office.com');
    headers.append('SaraSessionId', diagnosticsInfo.SessionId);

    let requestInit: RequestInit = {
        method: 'POST',
        credentials: 'same-origin',
    };

    requestInit.body = JSON.stringify(diagnosticsInfo);
    requestInit.headers = headers;

    let odsPromise = fetch(HelpCharmConstants.ODSServiceEndpoint, requestInit);

    return odsPromise;
}

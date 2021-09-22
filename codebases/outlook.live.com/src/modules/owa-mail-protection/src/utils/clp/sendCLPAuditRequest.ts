import type CLPViewState from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';
import CLPAuditAction, {
    CLPAuditActionRequestBody,
    CLPAuditPlatform,
    CLPAuditTargetLocation,
} from 'owa-mail-protection-types/lib/schema/clp/CLPAuditAction';
import { getAccessTokenforResource } from 'owa-tokenprovider';

const GRAPH_RESOURCE = 'https://graph.microsoft.com';

export default function sendCLPAuditRequest(viewState: CLPViewState) {
    const { auditActionStack } = viewState;
    const tokenPromise = getAccessTokenforResource(GRAPH_RESOURCE, 'CLPAuditRequest');
    tokenPromise.then(token => {
        auditActionStack.forEach((auditAction: CLPAuditAction) => {
            const requestBody = constructRequestBody(auditAction);
            const endpoint = `${GRAPH_RESOURCE}/beta/AuditLogs/${
                auditAction.logType as string
            }Logs`;
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });
        });
    });
}

function constructRequestBody(auditAction: CLPAuditAction): CLPAuditActionRequestBody {
    return {
        ...auditAction,
        application: 'Outlook',
        platform: CLPAuditPlatform.WebBrowser, // This is a server side enum, 5 is web browser, so it's always 5 for us.
        deviceName: window.location.host, // For OWA device name is host name.
        targetLocation: CLPAuditTargetLocation.Cloud,
    };
}

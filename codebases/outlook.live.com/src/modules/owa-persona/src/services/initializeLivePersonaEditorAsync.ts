import { getClientVersion, getSessionId } from 'owa-config';
import { getGuid } from 'owa-guid';
import {
    getLokiBootstrapperConfig,
    initializeLivePersonaEditorAsync as initLPE,
    BootstrapperConfig,
} from 'owa-people-loki';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';

const OwaContactsAPI = () =>
    import(/* webpackChunkName: "OwaContactsAPI"*/ 'owa-contacts-api').then(m => m.default);

function getAndLogClientCorrelationId(): string {
    const sessionId = getSessionId() || getGuid();

    return sessionId;
}

export default async function initializeLivePersonaEditorAsync(): Promise<Boolean> {
    const ContactsAPIClient = await OwaContactsAPI();

    if (!ContactsAPIClient.isEnabled()) {
        return false;
    }

    const bootstrapperConfig = getLokiBootstrapperConfig();
    const workload = getOwaWorkload() === OwaWorkload.Mail ? 'OwaMail' : 'OwaCalendar';
    const lpeBootstrapperConfig: BootstrapperConfig = {
        ...bootstrapperConfig,
        clientCorrelationId: getAndLogClientCorrelationId(),
        clientType: workload,
    };

    try {
        const lokiConfig = await initLPE(lpeBootstrapperConfig);
        const loadedLPEModule = window['LPE'];

        await loadedLPEModule.initialize({
            ...bootstrapperConfig,
            refreshAuthToken: (
                callback: (
                    token: string | undefined,
                    error: string | undefined,
                    authRequestCorrelationId: string | undefined,
                    tokenTtlInSeconds: number | undefined
                ) => void
            ) =>
                lpeBootstrapperConfig.getAuthToken(
                    (token: string, authRequestCorrelationId: string) =>
                        callback(token, undefined, authRequestCorrelationId, undefined),
                    (errorMessage: string, authRequestCorrelationId: string) =>
                        callback(undefined, errorMessage, authRequestCorrelationId, undefined)
                ),
            clientType: lpeBootstrapperConfig.clientType,
            cultureName: lpeBootstrapperConfig.culture || '',
            hostAppRing: lpeBootstrapperConfig.region,
            hostAppName: lpeBootstrapperConfig.clientType,
            hostAppVersion: getClientVersion(),
            lokiUrl: lokiConfig.LokiUrl || '',
            clientCorrelationId: getAndLogClientCorrelationId(),
            region: lokiConfig.LokiUrl,
            accountType: lpeBootstrapperConfig.isConsumer ? 'Consumer' : 'Business',
            complianceEnvironment: lpeBootstrapperConfig.complianceEnvironment,
            lokiConfig,
        });
        return true;
    } catch {
        return false;
    }
}

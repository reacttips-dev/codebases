import type ExtensibilityContext from 'owa-service/lib/contract/ExtensibilityContext';
import FormFactor from 'owa-service/lib/contract/FormFactor';
import { getExtensibilityContext } from 'owa-addins-apis';
import { getCurrentLanguage } from 'owa-localize';

export const EXTENSIBILITY_CONTEXT_MAX_RETRY_COUNT: number = 3;
let EXTENSIBILITY_CONTEXT_MAX_RETRY_INTERVAL: number = 3000;

const Layout = FormFactor.Desktop;
const IncludeDisabledExtensions = true;
const ApiVersionSupported = '1.10';
const ClientOverrideVersion = '1.1';

/**
 * Update extensibility retry interval. For test only now.
 */
export function updateInterval(interval: number) {
    if (interval >= 0) {
        EXTENSIBILITY_CONTEXT_MAX_RETRY_INTERVAL = interval;
    }
}

function timeOut(interval: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

async function loadExtensibilityContextWithRetry(
    retryCount: number
): Promise<ExtensibilityContext> {
    try {
        await timeOut(
            retryCount == EXTENSIBILITY_CONTEXT_MAX_RETRY_COUNT
                ? 0
                : EXTENSIBILITY_CONTEXT_MAX_RETRY_INTERVAL
        );
        const context = await getExtensibilityContext(
            Layout,
            getCurrentLanguage(),
            IncludeDisabledExtensions,
            ApiVersionSupported,
            ClientOverrideVersion
        );
        return context;
    } catch (error) {
        if (retryCount == 0) {
            throw error;
        }
    }
    return loadExtensibilityContextWithRetry(--retryCount);
}

export default function loadExtensibilityContext(): Promise<ExtensibilityContext> {
    return loadExtensibilityContextWithRetry(EXTENSIBILITY_CONTEXT_MAX_RETRY_COUNT);
}

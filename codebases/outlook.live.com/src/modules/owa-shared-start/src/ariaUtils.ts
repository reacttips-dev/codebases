import { AWT, AWTEventData, AWT_COLLECTOR_URL_EUROPE } from '@aria/webjs-compact-sdk';
import { hasQueryStringParameter, isGulpOrBranchingValue } from 'owa-querystring';
import { getVariantEnvironment, getAriaUrl, getCompactAriaUrl, AriaUrlSuffix } from 'owa-metatags';

const THREE_SECONDS_IN_MS = 3000;
let ariaTenantToken: string | undefined;
const datapointQueryStringParam = 'dp';

export function setAriaTenantToken(token: string | undefined) {
    ariaTenantToken = token;

    if (ariaTenantToken) {
        try {
            const collectorUrl = getCollectorUrl();
            if (collectorUrl) {
                AWT.initialize(ariaTenantToken, { collectorUrl });
            } else {
                AWT.initialize(ariaTenantToken);
            }
        } catch {
            // ignore instrumentation errors
        }
    }
}

function logEventToConsole(event: AWTEventData) {
    /* tslint:enable:no-console */
    // This is a debugging tool that developers use to test if there datapoints are getting logged
    // tslint:disable:no-console
    const eventGroupDescription =
        `${event.name}, ` +
        `${safeStringify(event?.properties?.ErrorSource || '')}, ` +
        `${safeStringify(event?.properties?.ErrorType || '')}`;
    console.group('BootEvent: ' + eventGroupDescription);
    console.log('Properties:' + safeStringify(event.properties));
    console.groupEnd();
    /* tslint:disable:no-console */
}

export function postSignal(
    lazyEvents: Promise<AWTEventData[]>,
    customTimeout?: number
): Promise<any> {
    if (!ariaTenantToken) {
        return Promise.resolve();
    }

    const shouldLogToConsole = hasQueryStringParameter(datapointQueryStringParam);

    const shouldLogToAria = !isGulpOrBranchingValue;

    return new Promise<void>(async resolve => {
        let postTimeout = window.setTimeout(resolve, customTimeout || THREE_SECONDS_IN_MS);

        try {
            const events = await lazyEvents;
            if (events) {
                for (const event of events) {
                    /*
                     * It's important to log to console after event is sent because `logEvent` modifies
                     * properties of the event.
                     * Logging after sending will allow to see exact data how it was sent to Aria
                     */
                    if (shouldLogToAria) {
                        AWT.logEvent(event);
                    }
                    if (shouldLogToConsole) {
                        logEventToConsole(event);
                    }
                }
                await flush();
            }
        } catch {
            // drop instrumentation errors
        } finally {
            window.clearTimeout(postTimeout);
            resolve();
        }
    });
}

function getCollectorUrl(): string | undefined {
    const ariaUrl = getAriaUrl();
    const compactAriaUrl = getCompactAriaUrl();

    // In AG08 and AG09 URLs are the same for compact SDK and normal one. To avoid a duplication in ECS config,
    // we check for compact URL first and if it's not there we fallback to normal URL
    if (compactAriaUrl || ariaUrl) {
        return compactAriaUrl || ariaUrl;
    }

    const environment = getVariantEnvironment();
    // The gcc high and Dod environment variables are not available in the compact sdk. So hard coding the strings for now
    switch (environment) {
        case 'BlackForest':
            return AWT_COLLECTOR_URL_EUROPE;
        case 'GccHigh':
            return 'https://tb.pipe.aria.microsoft.com/' + AriaUrlSuffix;
        case 'DoD':
            return 'https://pf.pipe.aria.microsoft.com/' + AriaUrlSuffix;
        case 'AG08':
            return 'https://office.collector.azure.eaglex.ic.gov/' + AriaUrlSuffix;
        case 'AG09':
            return 'https://office.collector.azure.microsoft.scloud/' + AriaUrlSuffix;
        default:
            return undefined;
    }
}

function safeStringify(input: any): string {
    try {
        return JSON.stringify(input);
    } catch (e) {
        return e.message;
    }
}

function flush(): Promise<void> {
    return new Promise(resolve => {
        AWT.flush(() => resolve());
    });
}

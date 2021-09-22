import { AWT } from '@aria/webjs-compact-sdk';
import { swVersion, cacheVersion } from '../settings';
import type SWError from '../types/SWError';
import { isNetworkError } from '../utils/isOneOf';

let initialized: boolean = false;
declare var self: ServiceWorkerGlobalScope;

type DatapointProperties = { [index: string]: string | number };
type Diagnostics = { [index: string]: string | number };

export function logDatapoint(
    EventName: string,
    miscData: { [index: string]: string },
    source?: string,
    duration?: number,
    status?: string,
    error?: SWError
): Promise<void> {
    const properties: DatapointProperties = {
        EventName,
        MiscData: JSON.stringify(miscData),
    };
    addProp(properties, 'E2ETimeElapsed', duration);
    addProp(properties, 'Status', status);
    const diagnostics: Diagnostics = {};
    addProp(diagnostics, 'source', source);
    if (error) {
        addProp(properties, 'ErrorMessage', error.message);
        addProp(properties, 'ErrorDetails', error.stack);
        addErrorDiagnostics(diagnostics, error);
    }

    return internalLogEvent('client_event', properties, diagnostics);
}

export function logTracing(EventName: string, message: string) {
    const properties: DatapointProperties = {
        EventName,
        message,
    };
    return internalLogEvent('client_trace', properties);
}

export function logErrorEvent(e: ErrorEvent, source?: string) {
    logError(
        e.error || {
            message: e.message,
            stack: e.filename + ':colno=' + e.colno + ':lineno=' + e.lineno,
        },
        source
    );
}

export function logError(e: SWError | string, source?: string) {
    const error = typeof e == 'string' ? new Error(e) : e;
    if (isNetworkError(error.message)) {
        return Promise.resolve();
    }
    const properties: DatapointProperties = {
        name: error.name,
        message: error.message,
    };
    const diagnostics: Diagnostics = {
        source: source || 'unknown',
    };
    addProp(properties, 'stack', error.stack);
    addErrorDiagnostics(diagnostics, error);
    return internalLogEvent('client_error', properties, diagnostics);
}

export function flush(): Promise<void> {
    return new Promise(resolve => {
        AWT.flush(resolve);
    });
}

let clientId: string | undefined;
export function setClientId(c: string | undefined) {
    clientId = c;
}

async function internalLogEvent(
    name: string,
    props: DatapointProperties | undefined,
    initialDiagnostics?: Diagnostics
): Promise<void> {
    // don't log datapoint on branch service workers
    if (self.location.search?.indexOf('branch') != -1) {
        return Promise.resolve();
    }

    if (!initialized) {
        initialized = true;
        // Outlook Web
        AWT.initialize(
            '56468f6991c348029c6bba403b444607-7f5d6cd1-7fbe-4ab1-be03-3b2b6aeb3eb4-7696'
        );
    }
    const clients = await self.clients.matchAll();
    const properties = props || {};
    properties.Host = 'SW';
    properties.Sampled = 100;
    if (clientId) {
        properties.ClientId = clientId;
    }
    const diagnostics: Diagnostics = initialDiagnostics || {};
    diagnostics.search = self.location.search;
    diagnostics.clients = clients?.length;
    diagnostics.swVersion = swVersion;
    diagnostics.cacheVersion = cacheVersion;
    properties.diagnostics = JSON.stringify(diagnostics);
    AWT.logEvent({ name, properties });
}

function addErrorDiagnostics(diagnostics: Diagnostics, error: SWError) {
    addProp(diagnostics, 'status', error.status);
    addProp(diagnostics, 'resource', error.resource);
}

function addProp(props: DatapointProperties, key: string, value: string | number | undefined) {
    if (typeof value != 'undefined') {
        props[key] = value;
    }
}

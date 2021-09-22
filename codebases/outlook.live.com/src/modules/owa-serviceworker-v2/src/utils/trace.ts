import { SWTracing } from 'owa-serviceworker-common';
import { logTracing } from '../analytics/logDatapoint';

const prefix = '[SW]';

let tracing: SWTracing = SWTracing.None;
export function tracingToggle(value: SWTracing) {
    tracing = value;
    if (isLoggingEnabled()) {
        log('Tracing enabled');
    }
}

export function log(message: string, data?: any) {
    internalLog('log', message, data);
}

export function warn(message: string, data?: any) {
    internalLog('warn', message, data);
}

export function group(group: string): () => void {
    internalLog('groupCollapsed', group);
    return () => internalLog('groupEnd', group);
}

// tslint:disable:no-console
// Store the console as a variable so terser doesn't remove it
const c = console;
function internalLog(consoleType: keyof Console, message: string, data?: any) {
    if (isLoggingEnabled()) {
        c[consoleType](prefix + message);
        if (data) {
            // can't call console.log directly as it will be stripped by webpack
            c['log'](data);
        }
    }
    if (tracing == SWTracing.Telemetry || tracing == SWTracing.All) {
        logTracing(consoleType, message);
    }
}
// tslint:enable:no-console

function isLoggingEnabled(): boolean {
    return tracing == SWTracing.Logging || tracing == SWTracing.All;
}

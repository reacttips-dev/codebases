import type { BootResult } from './interfaces/BootResult';
import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';
import type { AWTEventData } from '@aria/webjs-compact-sdk';
import { getBootTimings, getBottlenecks } from 'owa-performance';
import { setPlt } from 'owa-plt-data';
import type BootError from './interfaces/BootError';
import { getBootType, getOpxHostData, scrubForPii, OpxSessionInfo } from 'owa-config';
import { createBaseEvent } from './createBaseEvent';
import { getMiscData } from './miscData';

const resultToEventNameMapping: { [P in BootResult]?: string } = {
    ok: 'clientstartupsuccess',
    fail: 'clientstartuperror',
    transient: 'clientstartuperror',
};

export async function createBootReliabilityAriaEvent(
    bootResult: BootResult,
    errorDiagnostics?: ErrorDiagnostics,
    timings?: {
        start: number | undefined;
        plt: number;
    },
    bootError?: BootError
): Promise<AWTEventData[]> {
    let bootType: string | undefined;
    let opxSessionInfo: OpxSessionInfo | undefined;
    try {
        bootType = await getBootType();
        const lazyOpxSessionInfo = getOpxHostData();
        if (lazyOpxSessionInfo) {
            opxSessionInfo = await lazyOpxSessionInfo;
        }
    } catch {
        // ignore the error if we can't get the boot type or opx data
    }

    let events: AWTEventData[] = [
        createBootBaseEvent(
            resultToEventNameMapping[bootResult] || 'clientstartupother',
            bootResult,
            errorDiagnostics,
            bootType,
            opxSessionInfo
        ),
    ];

    if (window.owaBackfilledErrors) {
        for (let ii = 0; ii < window.owaBackfilledErrors.length; ii++) {
            events.push(
                createBootBaseEvent(
                    'bootevalerror',
                    bootResult,
                    errorDiagnostics,
                    bootType,
                    opxSessionInfo
                )
            );
        }
    }

    let diagnostics = '';
    if (bootError) {
        if (bootError.diagnosticInfo) {
            diagnostics += bootError.diagnosticInfo;
        }
    }
    if (window.owaBackfilledErrors && window.owaBackfilledErrors.length > 0) {
        diagnostics += '|' + window.owaBackfilledErrors.map(formatBackfilledErrors).join('|');
    }
    if (diagnostics) {
        setEventProperty(events[0], 'Diagnostics', diagnostics);
    }
    const navigation = window.performance?.navigation;
    if (navigation) {
        setEventProperty(events[0], 'RedirectCount', navigation.redirectCount);
    }

    setPlt(timings?.plt);

    if (timings) {
        if (timings.start) {
            setEventProperty(events[0], 'StartTime', Date.now() - timings.start);
        }
        setEventProperty(events[0], 'LoadTime', timings.plt);
    }

    setEventProperty(events[0], 'MiscData', getMiscData(errorDiagnostics, bootError?.response));
    setEventProperty(events[0], 'Timings', getBootTimings());

    return events;
}

function formatBackfilledErrors(a: IArguments) {
    let res = 'null';
    if (a) {
        // The first argument should be the error message
        res = a[0];
        if (typeof a.callee == 'function') {
            res += ':' + a.callee();
        }
    }
    return res;
}

function createBootBaseEvent(
    name: string,
    bootResult: BootResult,
    errorDiagnostics: ErrorDiagnostics | undefined,
    bootType: string | undefined,
    opxSessionInfo: OpxSessionInfo | undefined
) {
    let event = createBaseEvent(name, errorDiagnostics);
    event.properties.BootResult = bootResult;
    event.properties.Bottlenecks = getBottlenecks();
    setEventProperty(event, 'BootType', bootType);
    if (opxSessionInfo) {
        setEventProperty(event, 'HostedScenario', opxSessionInfo.hostedScenario);
        setEventProperty(event, 'HostTelemetry', scrubForPii(opxSessionInfo.hostTelemetry));
    }
    return event;
}

function setEventProperty(
    event: AWTEventData,
    key: string,
    value: string | number | boolean | undefined
) {
    if (value != null && value != undefined) {
        event.properties[key] = value;
    }
}

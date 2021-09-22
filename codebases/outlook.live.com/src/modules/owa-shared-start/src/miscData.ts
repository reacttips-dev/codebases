import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';
import { findMetatag } from 'owa-metatags';
import { concatValidMetrics } from './concatValidMetrics';
import { getScriptProcessTime } from './getScriptProcessTime';
import getHeader from './getHeader';
import { getScriptPath } from 'owa-config/lib/bootstrapOptions';

const headersToAddToMiscData: string[] = [
    'X-CalculatedBETarget',
    'X-OWA-CorrelationId',
    'X-MSEdge-Ref',
    'content-encoding',
    'content-length',
    'content-type',
    'X-OWA-Version',
    'X-OWAErrorMessageID',
    'x-diaginfo',
    'x-besku',
    'x-owa-diagnosticsinfo',
];

let extraMiscData = '';

export function getMiscData(
    errorDiagnostics: ErrorDiagnostics | undefined,
    response: Response | undefined
): string {
    let miscData: string = `&vm=true&sp=${getScriptPath()}`;
    if (errorDiagnostics) {
        miscData += `&ehk=${errorDiagnostics.ehk}&msg=${errorDiagnostics.emsg}`;
    }

    if (process.env.__HX_Version__) {
        miscData += '&hx=' + process.env.__HX_Version__;
    }

    const bootFlights = findMetatag('bootFlights');
    if (bootFlights) {
        miscData += '&bf=' + bootFlights;
    }

    if (response) {
        miscData += '&req=' + encodeURIComponent(response.url);
        for (let ii = 0; ii < headersToAddToMiscData.length; ii++) {
            const headerKey = headersToAddToMiscData[ii];
            const headerValue = getHeader(response, headerKey);
            if (headerValue) {
                miscData += `&${headerKey}=${headerValue}`;
            }
        }
        miscData += '&rt=' + response.type;
    }

    const navigation = window.performance?.navigation;
    if (navigation) {
        miscData += `&nt=${navigation.type}`;
    }

    let scriptProcessTime: { [index: string]: number } = getScriptProcessTime();
    const processKeys = Object.keys(scriptProcessTime);
    for (let ii = 0; ii < processKeys.length; ii++) {
        let key = processKeys[ii];
        miscData = concatValidMetrics(miscData, key, scriptProcessTime);
    }
    return miscData + extraMiscData;
}

export function appendMiscData(key: string, value: string | number): void {
    extraMiscData += `&${key}=${value}`;
}

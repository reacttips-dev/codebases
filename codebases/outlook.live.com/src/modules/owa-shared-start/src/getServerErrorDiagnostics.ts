import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';
import type BootError from './interfaces/BootError';
import getHeader from './getHeader';
import { scrubForPii } from 'owa-config';
import { appendMiscData } from './miscData';

const errorHeaders = ['X-OWA-Error', 'X-Auth-Error', 'X-Redir-Error', 'X-JIT-Error'];

export function getServerErrorDiagnostics(error: BootError): ErrorDiagnostics {
    let diagnostics: ErrorDiagnostics = {
        err: 'Unknown',
        esrc: 'Runtime',
    };

    if (error) {
        diagnostics.et = error.url ? 'ServerError' : 'ClientError';
        if (error.source) {
            diagnostics.esrc = error.source;
        }
        if (error.name || error.message) {
            diagnostics.err = `${error.name}: ${error.message}`;
        }

        const response = error?.response;
        diagnostics.estack = getHeader(response, 'X-InnerException') || error.stack;
        diagnostics.st = <any>response?.status || error?.status;

        // calculate the error message
        for (let ii = 0; ii < errorHeaders.length; ii++) {
            let key = errorHeaders[ii];
            let value = getHeader(response, key);
            if (value) {
                diagnostics.ehk = key;
                diagnostics.err = scrubForPii(value);
                break;
            }
        }

        const msDiagnosticsHeader = getHeader(response, 'x-ms-diagnostics');
        if (msDiagnosticsHeader) {
            appendMiscData('x-ms-diagnostics', msDiagnosticsHeader);
        }

        // basic information of failed response
        diagnostics.efe = getHeader(response, 'X-FEServer');
        diagnostics.ebe = getHeader(response, 'X-BEServer');
        diagnostics.ewsver = getHeader(response, 'X-OWA-Version');
        diagnostics.reqid = getHeader(response, 'response-id');
        diagnostics.emsg = getHeader(response, 'X-OWAErrorMessageID');

        if (diagnostics.estack) {
            // first let's check if we are recursively calling the same function over and over
            if (diagnostics.estack.length > 1024) {
                diagnostics.estack = removeTopIdenticalLines(diagnostics.estack);
            }

            // if the stack is still too long, let's trim it
            if (diagnostics.estack.length > 1024) {
                // Trim the url in case it's too long to be handled by iis or browser
                // Get the reference from http://boutell.com/newfaq/misc/urllength.html
                diagnostics.estack = diagnostics.estack.substring(0, 1024);
            }
        }
    }

    return diagnostics;
}

export function removeTopIdenticalLines(stack: string): string {
    const lines = stack.split('\n');
    for (let ii = 1; ii < lines.length; ii++) {
        if (lines[0] != lines[ii]) {
            return lines.slice(ii - 1).join('\n');
        }
    }
    return stack;
}

import { doErrorPageRedirect } from './doErrorPageRedirect';
import { getApp, getClientId } from 'owa-config';
import { redirectToOwa } from './redirectToOwa';
import { redirect, redirectTo } from './redirect';
import getHeader from './getHeader';
import type { BootResult } from './interfaces/BootResult';
import type BootError from './interfaces/BootError';
import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';
import { isBootFeatureEnabled } from 'owa-metatags';
import handleErrorLocally from './handleErrorLocally';

export function handleBootError(
    bootResult: BootResult,
    error: BootError,
    errorDiagnostics: ErrorDiagnostics,
    onFatalBootError?: () => void
): void {
    // Check if we need retry before render error page
    let didRedirect: boolean = false;
    const expectedVdir = getHeader(error?.response, 'X-Js-ClientVdir');
    if (expectedVdir && bootResult == 'optin') {
        didRedirect = redirectToOwa(expectedVdir, getApp());
    } else if (bootResult == 'langtz') {
        didRedirect = redirectToOwa('owa', getApp());
    } else if (bootResult == 'errorfe' && error.response?.url) {
        didRedirect = redirectTo(error.response.url);
    } else if (bootResult == 'auth') {
        didRedirect = redirect(location, 'authRedirect', 'true', undefined, true);
    }

    if (!didRedirect) {
        // No retry is needed, redirect to error page
        let query = `app=${getApp()}&st=${errorDiagnostics.st}&ru=${
            window?.location?.pathname
        }&msg=${errorDiagnostics.emsg}&et=${errorDiagnostics.et}&esrc=${
            errorDiagnostics.esrc
        }&err=${encodeURIComponent(<any>errorDiagnostics.err)}&wsver=${
            errorDiagnostics.ewsver
        }&ebe=${errorDiagnostics.ebe}&efe=${errorDiagnostics.efe}&reqid=${
            errorDiagnostics.reqid
        }&cId=${getClientId()}&estack=${encodeURIComponent(errorDiagnostics.estack || '')}`;

        // Await this because once we redirect further async stuff won't happen
        onFatalBootError?.();

        if (isBootFeatureEnabled('localBootError')) {
            handleErrorLocally(bootResult, error, errorDiagnostics);
        } else {
            doErrorPageRedirect(query);
        }
    }
}

import * as AriaUtils from './ariaUtils';
import type { AWTEventData } from '@aria/webjs-compact-sdk';
import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';
import { createBaseEvent } from './createBaseEvent';
import createBootError from './createBootError';
import type BootError from './interfaces/BootError';
import { postLanguageTimeZone } from './postLanguageTimeZone';
import { getServerErrorDiagnostics } from './getServerErrorDiagnostics';
import { createStatusErrorMessage } from './createStatusErrorMessage';

export async function languagePostOnBootError(): Promise<void> {
    try {
        let response = await postLanguageTimeZone();
        const owaError = response.headers.get('X-OWA-Error');

        if (owaError) {
            throw new Error(owaError);
        } else if (response.status >= 400) {
            throw createStatusErrorMessage(response);
        }

        // Log success event to Aria
        await AriaUtils.postSignal(createLangPostEvent('langpost_success'));
    } catch (e) {
        // Log failed event to Aria
        const langPostError: BootError = createBootError(
            e,
            'LangPost',
            window.location.pathname,
            e.status
        );
        await AriaUtils.postSignal(
            createLangPostEvent('langpost_error', getServerErrorDiagnostics(langPostError))
        );
    }
}

function createLangPostEvent(
    eventName: string,
    errorDiagnostics?: ErrorDiagnostics
): Promise<AWTEventData[]> {
    return Promise.resolve([createBaseEvent(eventName, errorDiagnostics)]);
}

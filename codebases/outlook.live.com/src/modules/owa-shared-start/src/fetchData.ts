import { updateDiagnosticsOnReponse } from 'owa-config/lib/envDiagnostics';
import createBootError from './createBootError';
import { makeServiceRequest } from 'owa-service/lib/ServiceRequest';
import { HttpStatusCode } from 'owa-service/lib/HttpStatusCode';
import type { HeadersWithoutIterator } from 'owa-service/lib/RequestOptions';
import { createStatusErrorMessage } from './createStatusErrorMessage';
import { getOwsPath } from 'owa-config';
import getScopedPath from 'owa-url/lib/getScopedPath';
import type BootError from './interfaces/BootError';
import type StartConfig from './interfaces/StartConfig';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { onBeforeRetry } from './onBeforeRetry';

export function overrideIsRetriableStatus(status: number): boolean {
    return (
        status == HttpStatusCode.NoContent ||
        status == HttpStatusCode.NotFound ||
        status >= HttpStatusCode.InternalServerError
    );
}

export function fetchData(
    config: StartConfig | undefined,
    headers: HeadersWithoutIterator,
    postProcessFunction: (json: SessionData) => SessionData,
    processHeaders: (headers: HeadersWithoutIterator) => void
): Promise<SessionData> {
    const endpoint = getScopedPath(getOwsPath()) + '/startupdata.ashx';
    return makeServiceRequest<Response>('StartupData', undefined, {
        endpoint: endpoint,
        headers,
        returnFullResponseOnSuccess: true,
        shouldRetry: overrideIsRetriableStatus,
        onBeforeRetry: response => onBeforeRetry(config, endpoint, response),
        authNeededOnUnAuthorized: false,
        retryCount: 5,
    })
        .then(
            (response: Response) => {
                updateDiagnosticsOnReponse(response);
                if (!response) {
                    throw new Error('NoResponse');
                }
                // it is important that we check for not a status of 200 instead of !response.ok since
                // OwaInvalidUserLanguageException returns with a status of 204
                if (response.status != 200) {
                    throw createStatusErrorMessage(response);
                }

                processHeaders(response.headers);

                return response.json().catch(e => {
                    const invalidJsonError: BootError = new Error('InvalidJson');
                    if (e) {
                        e.diagnosticInfo = e.message;
                    }
                    throw invalidJsonError;
                });
            },
            response => {
                throw createStatusErrorMessage(response);
            }
        )
        .then(postProcessFunction)
        .catch(e => Promise.reject(createBootError(e, 'StartupData', endpoint, 0)));
}

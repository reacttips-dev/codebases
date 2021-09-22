import type { AriaDatapoint } from '../datapoints/AriaDatapoint';
import { getServerErrorName } from '../utils/getServerErrorName';
import type { TraceErrorObject } from 'owa-trace';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import { scrubForPii } from 'owa-config';
import { getActionStack } from '../DatapointMiddleware';

export async function addErrorToDatapoint(
    datapoint: AriaDatapoint,
    error: TraceErrorObject | string
): Promise<string> {
    let errorMessage;
    if (error) {
        if (typeof error == 'string') {
            error = new Error(error);
        }
        errorMessage = error.message;
        let errorDetails = error.stack;
        const errorResponse = error.response;
        let responseCode = error.responseCode;
        if (errorResponse) {
            const responseMessage = await getResponseMessage(errorResponse);
            if (responseMessage) {
                responseCode = responseMessage.ResponseCode;
                errorMessage = responseMessage.ResponseClass + ':' + responseMessage.ResponseCode;
                errorDetails = responseMessage.StackTrace;
            } else {
                errorMessage = getServerErrorName(errorResponse);
                errorDetails = `Server InnerException: ${getServerInnerError(
                    errorResponse
                )}; client stack: ${error.stack}`;
            }

            addErrorHeaders(datapoint, errorResponse.headers);
            datapoint.properties.ErrorRequestUrl = scrubForPii(errorResponse.url);
        } else if (error.headers) {
            addErrorHeaders(datapoint, error.headers);
        }

        if (responseCode) {
            datapoint.addCustomProperty('ResponseCode', responseCode);
        }

        if (error.fetchErrorType) {
            datapoint.addCustomProperty('FetchErrorType', error.fetchErrorType);
        }
        if (typeof error.retriable == 'boolean') {
            datapoint.addCustomProperty('Retriable', error.retriable);
        }

        let diagnosticInfo = error.diagnosticInfo || '';
        const actionStack = getActionStack();
        if (actionStack.length > 0) {
            diagnosticInfo += '|' + actionStack;
        }
        datapoint.addCustomProperty('Diagnostics', scrubForPii(diagnosticInfo));

        if (typeof error.httpStatus == 'number') {
            datapoint.addCustomProperty('ErrorStatusCode', error.httpStatus);
        }
        datapoint.properties.ErrorMessage = scrubForPii(errorMessage);
        if (errorDetails) {
            datapoint.properties.ErrorDetails = scrubForPii(errorDetails);
        }
    }
    return errorMessage;
}

async function getResponseMessage(
    errorResponse: Response
): Promise<SingleResponseMessage | undefined> {
    if (errorResponse) {
        try {
            const errorJson = await errorResponse.clone().json();
            const body = errorJson?.Body;
            if (body?.ResponseMessages?.Items?.[0]) {
                return body.ResponseMessages.Items[0];
            }
            return body;
        } catch {}
    }
    return undefined;
}

function addErrorHeaders(datapoint: AriaDatapoint, headers: Headers) {
    if (headers && typeof headers.get == 'function') {
        datapoint.addCustomProperty('FEServer', headers.get('x-feserver'));
        datapoint.addCustomProperty('BEServer', headers.get('x-beserver'));
        datapoint.addCustomProperty('BEStatus', headers.get('x-backendhttpstatus'));
        datapoint.addCustomProperty('ServerVersion', headers.get('x-owa-version'));
        datapoint.addCustomProperty('ErrorRequestId', headers.get('request-id'));
        datapoint.addCustomProperty('ErrorAFDRef', headers.get('x-msedge-ref'));
        datapoint.addCustomProperty('ErrorMessageId', headers.get('x-owaerrormessageid'));
    }
}

function getServerInnerError(errorResponse: Response) {
    return errorResponse?.headers && errorResponse.headers.get('x-innerexception');
}

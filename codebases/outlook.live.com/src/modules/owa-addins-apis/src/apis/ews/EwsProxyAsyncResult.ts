import type EwsProxyResponse from 'owa-service/lib/contract/EwsProxyResponse';

export interface EwsProxyAsyncResult {
    wasProxySuccessful?: boolean;
    errorMessage?: string;
    statusCode?: number;
    statusDescription?: string;
    body?: string;
}

export function convertProxyResponseIntoAsyncResult(
    response: EwsProxyResponse
): EwsProxyAsyncResult {
    return {
        wasProxySuccessful: response.WasProxySuccessful,
        errorMessage: response.ErrorMessage,
        statusCode: response.StatusCode,
        statusDescription: response.StatusDescription,
        body: response.Body,
    };
}

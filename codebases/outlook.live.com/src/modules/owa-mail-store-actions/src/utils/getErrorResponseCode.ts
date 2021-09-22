import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';

/**
 * Get error response code from the response message
 */
export default function getErrorResponseCode(
    responseMessage: SingleResponseMessage
): [string, string] {
    if (responseMessage && responseMessage.ResponseClass != 'Success') {
        return [responseMessage.ResponseCode, responseMessage.StackTrace];
    } else {
        return [null, null];
    }
}

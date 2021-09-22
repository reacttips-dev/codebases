import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';

const NoError: string = 'NoError';
const Success: string = 'Success';
const LogSeparator: string = '|';

export function isSuccess(responseMessage: SingleResponseMessage) {
    return (
        responseMessage.ResponseCode &&
        responseMessage.ResponseCode.toString() === NoError &&
        responseMessage.ResponseClass &&
        responseMessage.ResponseClass.toString() === Success
    );
}

export function tryGetErrorFromBody(response: any) {
    let error = '';
    if (!response || !response.Body) {
        return error;
    }

    let responseMessage: SingleResponseMessage = response.Body;
    if (responseMessage.ResponseCode) {
        error += responseMessage.ResponseCode.toString();
    }

    if (responseMessage.ResponseClass) {
        error += LogSeparator;
        error += responseMessage.ResponseClass.toString();
    }

    return error;
}

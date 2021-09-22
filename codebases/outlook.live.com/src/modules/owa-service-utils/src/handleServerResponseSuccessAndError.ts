import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import createServiceFetchError from './createServiceFetchError';
import checkIfResponseSuccess from './checkIfResponseSuccess';

export default function handleServerResponseSuccessAndError(
    response: SingleResponseMessage | SingleResponseMessage[] | undefined | null
): Promise<void> {
    if (!response) {
        return Promise.reject(
            createServiceFetchError('500', 'Server returned a null response!', null)
        );
    }

    const responseItems = Array.isArray(response) ? response : [response];
    for (const responseItem of responseItems) {
        if (responseItem && !checkIfResponseSuccess(responseItem)) {
            return Promise.reject(
                createServiceFetchError(
                    responseItem.ResponseCode,
                    responseItem.StackTrace,
                    responseItem.MessageText
                )
            );
        }
    }

    return Promise.resolve();
}

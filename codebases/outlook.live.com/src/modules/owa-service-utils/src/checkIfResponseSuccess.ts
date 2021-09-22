import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';

const successClass = 'Success';

export default function checkIfResponseSuccess(response: SingleResponseMessage) {
    return response && response.ResponseClass == successClass;
}

import { mutator } from 'satcheljs';
import { onAfterUnsubscribe } from '../actions/publicActions';
import { default as UnsubscribeResponseType } from '../store/schema/unsubscribeResponseType';

export default mutator(onAfterUnsubscribe, actionMessage => {
    const { unsubscribeSourceType, responseType, debugMessage, completedCallback } = actionMessage;
    // The completeCallback is handled by brands card and it has its own error handling
    if (unsubscribeSourceType === 'BrandCard' && completedCallback) {
        completedCallback(
            responseType === UnsubscribeResponseType.Success /* isSuccess */,
            debugMessage
        );
    }
});

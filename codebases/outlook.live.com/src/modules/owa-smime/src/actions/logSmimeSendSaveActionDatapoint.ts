import type SmimeType from 'owa-smime-adapter/lib/store/schema/SmimeType';
import type SmimeCustomError from '../utils/SmimeCustomError';
import { action } from 'satcheljs';
/**
 * Action dispatched when we log datapoint on success/error of send/save of S/MIME message
 */
export default action(
    'logSmimeSendSaveActionDatapoint',
    (composeId: string, isSend: boolean, smimeType: SmimeType, error?: SmimeCustomError) => ({
        composeId,
        isSend,
        smimeType,
        error,
    })
);

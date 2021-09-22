import { FLOODGATE_API_ROOT, FloodgateSettingDataType } from './constants';
import { makePatchRequest } from 'owa-ows-gateway';
import prefetch from 'owa-service/lib/prefetch';

let previousTime = null;
let backoffTime = 0;

/*
    Floodgate SDK makes these requests in "for loops", so we need to backoff to
    avoid SDS throwing errors due to conflicts, since the keys of the SDS entry might
    be the same.
*/
export default function upsertSettings(request: FloodgateSettingDataType) {
    const currentTime = new Date().getTime();
    if (previousTime) {
        // If the time passed since the last request is less than a second, we will add 1.5s, otherwise no backoff
        backoffTime = currentTime - previousTime < 1000 ? backoffTime + 1500 : 0;
    }

    previousTime = currentTime;

    setTimeout(() => {
        prefetch(() => {
            makePatchRequest(
                FLOODGATE_API_ROOT,
                request,
                undefined /* correlationId */,
                true /* returnFullResponse */,
                undefined /* customHeaders */,
                undefined /* throwServiceError */,
                true /* isThrottled */
            );
        });
    }, backoffTime);
}

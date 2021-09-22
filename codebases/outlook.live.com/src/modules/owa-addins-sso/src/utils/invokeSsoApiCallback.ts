import { getActiveSsoCallback } from '../storage/ActiveSsoApiCallback';
import type { SsoErrorCode } from '../schema/SsoErrorCode';

function invokeSsoApiCallback(error: SsoErrorCode, token?: string): void {
    const callback = getActiveSsoCallback();
    if (callback) {
        callback(error, token);
    }
}

export default invokeSsoApiCallback;

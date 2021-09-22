import type SsoApiMethodCallback from '../schema/SsoApiMethodCallback';
import { setActiveSsoCallback } from '../storage/ActiveSsoApiCallback';

export default function saveSsoApiCallback(callback: SsoApiMethodCallback) {
    setActiveSsoCallback(callback);
}

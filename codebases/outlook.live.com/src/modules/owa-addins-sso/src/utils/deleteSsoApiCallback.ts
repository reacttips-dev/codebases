import { setActiveSsoCallback } from '../storage/ActiveSsoApiCallback';

export default function deleteSsoApiCallback() {
    setActiveSsoCallback(null);
}

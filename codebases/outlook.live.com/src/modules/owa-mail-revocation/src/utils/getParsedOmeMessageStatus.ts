import OmeMessageState, {
    OmeMessageResponseStatus,
    RevokeExpirePermissions,
} from '../store/schema/OmeMessageState';
import { getTimestamp, owaDate } from 'owa-datetime';

export default function getParsedOmeMessageStatus(stampedOmeMessageState: string): OmeMessageState {
    if (stampedOmeMessageState) {
        let omeMessageState = {
            permissions: RevokeExpirePermissions.None,
            revoked: false,
            expired: false,
            revocationDate: null,
            revokedBy: null,
            responseState: OmeMessageResponseStatus.None,
        };

        try {
            const messageStateObject = JSON.parse(stampedOmeMessageState);
            if (messageStateObject.Permissions == 1 /*User has revoke permission*/) {
                omeMessageState.permissions = RevokeExpirePermissions.Revocable;
            }
            if (messageStateObject.Permissions == 2 /*User has expire permission*/) {
                omeMessageState.permissions = RevokeExpirePermissions.Expirable;
            }
            omeMessageState.revoked = messageStateObject.IsRevoked;
            omeMessageState.expired = messageStateObject.IsExpired;
            if (messageStateObject.RevocationDate) {
                const owadateObject = owaDate('UTC', messageStateObject.RevocationDate);
                omeMessageState.revocationDate = new Date(getTimestamp(owadateObject));
            }
            omeMessageState.revokedBy = messageStateObject.RevokedBy;
        } catch (e) {
            // Invalid response string. Failed to parse JSON.
            return null;
        }

        return omeMessageState;
    }

    return null;
}

import { AdalErrorCode } from 'owa-tokenprovider';
import { SsoErrorCode } from '../schema/SsoErrorCode';

export default function mapAdalErrorToSsoApiError(errorMessage: string): SsoErrorCode {
    let errorCode = SsoErrorCode.ClientError;

    if (errorMessage) {
        if (errorMessage.indexOf(AdalErrorCode.NoUserLogin) >= 0) {
            errorCode = SsoErrorCode.UserNotSignedIn;
        } else if (errorMessage.indexOf(AdalErrorCode.InvalidResourceUrl) >= 0) {
            errorCode = SsoErrorCode.InvalidResourceUrl;
        } else if (
            errorMessage.indexOf(AdalErrorCode.NoPreAuth) >= 0 ||
            errorMessage.indexOf(AdalErrorCode.NotConsent) >= 0
        ) {
            errorCode = SsoErrorCode.InvalidGrant;
        } else if (errorMessage.indexOf(AdalErrorCode.UserAborted) >= 0) {
            errorCode = SsoErrorCode.UserAborted;
        }
    }

    return errorCode;
}

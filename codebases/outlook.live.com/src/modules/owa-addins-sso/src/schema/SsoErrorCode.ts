// Please keep in sync with AppsForOfficeSingleSignOnErrorCode in devmain
export enum SsoErrorCode {
    Success = 0,

    OperationNotSupported = 5000, // This API code is not used for SSO but is used in multiple other APIs. Need to replace SsoErrorCode.OperationNotSupported with already defined ApiErrorCode.OperationNotSupported

    InternalError = 5001,

    NotSsoAgave = 13000,

    UserNotSignedIn = 13001,

    UserAborted = 13002,

    InvalidResourceUrl = 13004,

    InvalidGrant = 13005,

    ClientError = 13006,

    AddinIsAlreadyRequestingToken = 13008,

    SSOUnsupportedPlatform = 13012,
}

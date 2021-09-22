//This corresponds to permissions stating whether the email is revocable/expirable/none
export enum RevokeExpirePermissions {
    None, // Not set or encrypted email
    Revocable, // Can be revoked
    Expirable, // Can apply expiration
}

//This corresponds to SetOMEMessageStatusResponseStatus in substrate
export enum OmeMessageResponseStatus {
    None,
    SuccessOrNoChange,
    FailedOrMessageNotFound,
    PartialFailed,
}

/* This is same as the interface OmeMessageStateData in Substrate*/
interface OmeMessageState {
    permissions: RevokeExpirePermissions;
    revoked: boolean;
    expired: boolean;
    revocationDate: Date;
    revokedBy: string;
    responseState: OmeMessageResponseStatus;
}
export default OmeMessageState;

/* Recipient permission info we get from OneDrive.
   We can also add errorMessage if we want to display it to users
*/
export enum GetPermissionInfoStatus {
    InProgress,
    Failed,
    Succeeded,
}

export interface RecipientPermissionInfo {
    emailAddress: string;
    name?: string;
    hasAccess?: boolean;
    canHaveAccess?: boolean;
    getPermissionInfoStatus: GetPermissionInfoStatus;
}

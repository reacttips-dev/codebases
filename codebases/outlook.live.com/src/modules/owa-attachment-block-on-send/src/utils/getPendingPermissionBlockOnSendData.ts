import CheckPermissionStatus from '../store/schema/CheckPermissionStatus';
import loc from 'owa-localize';
import {
    pendingPermissionSubTitleCheckingPermissions,
    pendingPermissionCheckingTitle,
    pendingPermissionSubTitleDontHaveAccess,
    checkingPermissionsTitle,
    pendingPermissionCompleteTitle,
    sendAnywayText,
    sendButton,
    doNotSendButton,
    cancelSendButtonText,
} from './getHasPendingPermssionString.locstring.json';

export default function getPendingPermissionBlockOnSendData(
    checkPermissionStatus: CheckPermissionStatus
) {
    switch (checkPermissionStatus) {
        case CheckPermissionStatus.InProcess:
        default:
            return {
                issueString: loc(pendingPermissionSubTitleCheckingPermissions),
                okButton: loc(sendAnywayText),
                title: loc(checkingPermissionsTitle),
                cancelText: loc(doNotSendButton),
            };
        case CheckPermissionStatus.NoAccess:
            return {
                issueString: loc(pendingPermissionSubTitleDontHaveAccess),
                okButton: loc(sendAnywayText),
                title: loc(checkingPermissionsTitle),
                cancelText: loc(doNotSendButton),
            };
        case CheckPermissionStatus.HasAccess:
            return {
                issueString: loc(pendingPermissionCheckingTitle),
                okButton: loc(sendButton),
                title: loc(pendingPermissionCompleteTitle),
                cancelText: loc(cancelSendButtonText),
            };
    }
}

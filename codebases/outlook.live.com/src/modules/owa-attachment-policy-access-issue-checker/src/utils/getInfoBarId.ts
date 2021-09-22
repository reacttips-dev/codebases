import { AttachmentPolicyInfoBarId } from '../schema/AttachmentPolicyInfoBarId';
import AccessIssue from '../schema/AccessIssue';
import { assertNever } from 'owa-assert';

export function getInfoBarId(issue: AccessIssue): AttachmentPolicyInfoBarId {
    switch (issue) {
        case AccessIssue.ReadOnly:
            return AttachmentPolicyInfoBarId.ReadOnlyAccess;
        case AccessIssue.ReadOnlyPlusAttachmentsBlocked:
            return AttachmentPolicyInfoBarId.ReadOnlyPlusAttachmentsBlockedAccess;
        case AccessIssue.None:
            return null;
        default:
            return assertNever(issue);
    }
}

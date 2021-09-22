/**
 * Describes the conditional nature of accessing attachments.
 *
 * Admins typically apply access policies at the org/tenant level for security purposes.
 * See https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/overview.
 *
 * @enum {number}
 * @property {number} ReadOnly - Users can't download attachments to their local computer, and can't enable Offline Mode on non-compliant computers. They can still view attachments in the browser.
 * @property {number} ReadOnlyPlusAttachmentsBlocked - All restrictions from ReadOnly apply, but users can't view attachments in the browser.
 * @property {number} None - No conditional access policy is applied.
 */
const enum AccessIssue {
    ReadOnly,
    ReadOnlyPlusAttachmentsBlocked,
    None,
}
export default AccessIssue;

export const AccessIssues = [AccessIssue.ReadOnly, AccessIssue.ReadOnlyPlusAttachmentsBlocked];

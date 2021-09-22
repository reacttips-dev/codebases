/**
 * This index contains any moudle that is not lazy loaded.
 */
export { getPendingAttachmentString } from './utils/getPendingAttachmentString';
export {
    getSharingLinkCountInBody,
    getHasSharingIssues,
    getSharingIssuesString,
    preloadLazyImports,
    hasLinkSharingIssue,
} from './utils/getHasSharingIssues';
export { getPendingPermissionString } from './utils/getPendingPermissionString';
export { getPendingPermissionErrorCode } from './utils/getPendingPermissionErrorCode';
export {
    newSharingIssueSubTitle,
    newSharingIssueTitle,
} from './components/SharingIssueBlockDialog.locstring.json';
import './mutators/pendingPermissionsMutators';

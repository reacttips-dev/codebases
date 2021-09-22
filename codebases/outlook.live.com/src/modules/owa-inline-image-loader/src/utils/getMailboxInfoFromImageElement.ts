import { isStringNullOrWhiteSpace } from 'owa-localize';
import { getGroupMailboxInfo } from 'owa-group-common';
import { getUserMailboxInfo, MailboxInfo } from 'owa-client-ids';

import safeGetAttribute from './safeGetAttribute';

const ATTRIBUTE_EXPLICIT_LOGON = 'explicitlogon';

/**
 * Get mailbox info from an html image element
 * @param img the image element
 */
export default function getMailboxInfo(img: HTMLImageElement, userIdentity: string): MailboxInfo {
    const explicitLogon = safeGetAttribute(img, ATTRIBUTE_EXPLICIT_LOGON);
    return !isStringNullOrWhiteSpace(explicitLogon)
        ? getGroupMailboxInfo(explicitLogon)
        : getUserMailboxInfo(userIdentity);
}

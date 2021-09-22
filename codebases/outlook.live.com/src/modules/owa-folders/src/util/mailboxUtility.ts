import * as strings from 'owa-localize';
import { extractMailboxGuidFromEwsIdBytes } from './idConverter';
import * as trace from 'owa-trace';

/**
 * Utility to extract mailbox guid from a given ews id
 * @param ewsId
 * @returns the mailbox guid
 */
export function getMailboxGuidFromEwsId(ewsId: string): string {
    try {
        if (!ewsId) {
            return null;
        }
        const decoded = atob(ewsId);
        const decodedLength = decoded.length;
        const array = new Uint8Array(new ArrayBuffer(decodedLength));

        for (let i = 0; i < decodedLength; i++) {
            array[i] = decoded.charCodeAt(i);
        }
        return extractMailboxGuidFromEwsIdBytes(array);
    } catch (e) {
        trace.errorThatWillCauseAlert(
            'getMailboxGuidFromEwsId : conversion failed for id ' + ewsId + ' with error ' + e
        );
        return null;
    }
}

/**
 * Generates the  mailbox smtp address
 * @param mailboxGuid - mailbox guid
 * @param orgDomain - domain of the user's organization
 * @returns the mailbox header
 */
export function generateMailboxSmtpAddress(mailboxGuid: string, orgDomain: string): string {
    if (!mailboxGuid || !orgDomain) {
        return null;
    }
    const mailboxHeaderFormat = '{0}@{1}';
    return strings.format(mailboxHeaderFormat, mailboxGuid, orgDomain);
}

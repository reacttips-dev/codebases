import type MailTipsInformation from './MailTipsInformation';
import { MruCacheEntry } from 'owa-nested-mru-cache';

/**
 * Wrapper class over MruCacheEntry which stores MailTipsInformation in each cache entry
 */
export default class MailTipsCacheEntry extends MruCacheEntry {
    public value: MailTipsInformation;

    constructor(
        mailTipsInformation: MailTipsInformation,
        sendAsEmailAddress: string,
        recipientEmailAddress: string
    ) {
        super(sendAsEmailAddress, recipientEmailAddress);
        this.value = mailTipsInformation;
    }
}

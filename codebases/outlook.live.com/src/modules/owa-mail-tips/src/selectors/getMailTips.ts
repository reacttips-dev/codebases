import { getStore } from '../store/store';
import type MailTipsCacheEntry from '../store/schema/MailTipsCacheEntry';
import type { NestedMruCache } from 'owa-nested-mru-cache';

/**
 * Gets mailTips property from the composeStore
 */
export default function getMailTips(): NestedMruCache<MailTipsCacheEntry> {
    return getStore().mailTips;
}

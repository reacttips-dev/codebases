import { createStore } from 'satcheljs';
import type MailTipsCacheStore from './schema/MailTipsCacheStore';
import MailTipsCacheEntry from './schema/MailTipsCacheEntry';
import { NestedMruCache } from 'owa-nested-mru-cache';
import '../orchestrators/updateMailtipsOrchestrator';

const mailTipsCacheStore: MailTipsCacheStore = {
    mailTips: new NestedMruCache<MailTipsCacheEntry>(MailTipsCacheEntry.compareEntryCacheTime),
};
export const getStore = createStore<MailTipsCacheStore>('mailTipsCacheStore', mailTipsCacheStore);

const store = getStore();
export default store;

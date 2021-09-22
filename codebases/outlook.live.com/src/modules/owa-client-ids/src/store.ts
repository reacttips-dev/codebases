import type MailboxInfo from './schema/MailboxInfo';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

export default createStore('OWAClientIdStore', {
    userMailboxInfoMap: new ObservableMap<string, MailboxInfo>(),
});

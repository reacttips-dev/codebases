import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { MailboxInfo } from 'owa-client-ids';

const getStore = createStore<ObservableMap<string, MailboxInfo>>(
    'publicFolderUtilsStore',
    new ObservableMap()
);

export default getStore;

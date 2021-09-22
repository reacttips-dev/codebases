import type MailListFilterViewStore from './schema/MailListFilterViewStore';
import { createStore } from 'satcheljs';

const mailListFilterViewStoreData: MailListFilterViewStore = {
    filterContextMenuDisplayState: false,
};

export let getStore = createStore<MailListFilterViewStore>(
    'mailListFilterView',
    mailListFilterViewStoreData
);
export let store = getStore();

import type MailFaviconStore from './schema/MailFaviconStore';
import { createStore } from 'satcheljs';

const mailFaviconStoreData: MailFaviconStore = {
    unseenMessages: 0,
};

const mailFavIconStore = createStore<MailFaviconStore>('mailFaviconStore', mailFaviconStoreData);
export default mailFavIconStore;

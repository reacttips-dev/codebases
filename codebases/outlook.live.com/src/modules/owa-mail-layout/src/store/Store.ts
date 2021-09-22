import { createStore } from 'satcheljs';
import type MailLayoutStore from './schema/MailLayoutStore';

const mailLayoutStore: MailLayoutStore = {
    clientReadingPanePosition: null,
    showReadingPane: false,
    showListPane: true,
    showFolderPane: true,
    senderColumnWidth: null,
    subjectColumnWidth: null,
    receivedColumnWidth: null,
};

export let getStore = createStore<MailLayoutStore>('maillayout', mailLayoutStore);

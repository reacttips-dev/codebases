import getStore from '../store/store';
import {
    FilesTreeLoadState,
    onAttachmentLoadFailed,
    onAttachmentsRetrieved,
} from 'owa-mail-attachment-folder';
import { mutator } from 'satcheljs';

mutator(onAttachmentLoadFailed, actionMessage => {
    const store = getStore();
    store.loadState = FilesTreeLoadState.loadFailed;
});

mutator(onAttachmentsRetrieved, actionMessage => {
    const store = getStore();
    store.loadState = FilesTreeLoadState.loaded;
});

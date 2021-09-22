import type { MailFolder } from 'owa-graph-schema';
import {
    PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import { isFolderUnderDeletedItemsFolder } from '../index';

/**
 * Utility to check whether a folder is under the deleted items folder for any mailbox
 * @param folder
 */
export default function isUnderDeletedItemsFolderFromAnyMailbox(folder: MailFolder) {
    return (
        folder &&
        (isFolderUnderDeletedItemsFolder(folder, PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID) ||
            isFolderUnderDeletedItemsFolder(folder, ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID))
    );
}

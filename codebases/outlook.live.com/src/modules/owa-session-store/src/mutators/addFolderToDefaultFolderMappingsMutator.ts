import addFolderToDefaultFolderMappings from '../actions/addFolderToDefaultFolderMappings';
import { mutator } from 'satcheljs';
import store from '../store/store';

/**
 * Mutator for adding mapping of default folders and folder ids in store maps
 */
export default mutator(addFolderToDefaultFolderMappings, actionMessage => {
    const defaultFolderName = actionMessage.defaultFolderName;
    const folderId = actionMessage.folderId;

    if (!defaultFolderName) {
        throw new Error('Input parameter defaultFolderName while setting in map must not be null.');
    }

    if (!folderId) {
        throw new Error('Input parameter to folderId while setting in map must not be null.');
    }

    store.defaultFolderNameToIdMap.set(defaultFolderName, folderId);
    store.defaultFolderIdToNameMap.set(folderId, defaultFolderName);
});

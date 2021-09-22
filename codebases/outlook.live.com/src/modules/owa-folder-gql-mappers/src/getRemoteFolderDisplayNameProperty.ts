import getExtendedProperty from './getExtendedProperty';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';

const REMOTE_FOLDER_DISPLAY_NAME_EXTENDED_PROPERTY_TAG = '0x7018';

// VSO - 89534 - Move to web resolver package
const getRemoteFolderDisplayNameProperty = (folderItem: BaseFolderType): string | null =>
    getExtendedProperty(folderItem, REMOTE_FOLDER_DISPLAY_NAME_EXTENDED_PROPERTY_TAG) || null;

export default getRemoteFolderDisplayNameProperty;

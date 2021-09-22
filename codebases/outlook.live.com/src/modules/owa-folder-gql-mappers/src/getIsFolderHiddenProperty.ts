import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import getExtendedProperty from './getExtendedProperty';

const HIDDEN_FOLDER_EXTENDED_PROPERTY_TAG = '0x10f4';

let getIsFolderHiddenProperty = (folderItem: BaseFolderType): boolean =>
    getExtendedProperty(folderItem, HIDDEN_FOLDER_EXTENDED_PROPERTY_TAG) !== 'false';

export default getIsFolderHiddenProperty;

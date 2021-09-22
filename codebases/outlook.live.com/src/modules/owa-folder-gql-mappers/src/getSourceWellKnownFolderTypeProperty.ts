import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import getExtendedProperty from './getExtendedProperty';

const SOURCE_WELLKNOWN_FOLDER_TYPE_PROPERTY_NAME = 'SourceWellKnownFolderType';

let getSourceWellKnownFolderTypeProperty = (folderItem: BaseFolderType) => {
    const value = getExtendedProperty(folderItem, SOURCE_WELLKNOWN_FOLDER_TYPE_PROPERTY_NAME);
    return (value && parseInt(value, 10 /* radix */)) || -1;
};

export default getSourceWellKnownFolderTypeProperty;

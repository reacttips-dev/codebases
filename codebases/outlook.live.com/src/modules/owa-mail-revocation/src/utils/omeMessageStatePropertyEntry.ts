import mailStore from 'owa-mail-store/lib/store/Store';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

const omeMessageStatusPropertyPath = extendedPropertyUri({
    PropertyName: 'x-ms-exchange-organization-ome-messagestate',
    DistinguishedPropertySetId: 'InternetHeaders',
    PropertyType: 'String',
});

const isPropertyExistedOnItem = (itemId: string): boolean => {
    //Always return false, so that GetItem is issued everytime reading pane is opened, to fetch the latest omeMessageStatus
    return false;
};

const shouldGetItemPropertiesFromServer = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item?.ParentFolderId?.Id === folderNameToId('sentitems');
};

const omeMessageStatePropertyEntry = {
    featureId: 'rp-omeRevocation',
    propertyPaths: [omeMessageStatusPropertyPath],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldGetItemPropertiesFromServer,
};

export default omeMessageStatePropertyEntry;

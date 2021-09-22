import { EMBEDDED_URL_PROPERTY_NAME, URL_PROPERTY_NAME } from './constants';
import mailStore from 'owa-mail-store/lib/store/Store';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

const embeddedUrlPropertyPath = extendedPropertyUri({
    PropertyName: EMBEDDED_URL_PROPERTY_NAME,
    DistinguishedPropertySetId: 'Common',
    PropertyType: 'String',
});

const urlPropertyPath = extendedPropertyUri({
    PropertyName: URL_PROPERTY_NAME,
    DistinguishedPropertySetId: 'Common',
    PropertyType: 'String',
});

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return !!item?.ExtractedUrlData;
};

const shouldGetItemPropertiesFromServer = (itemId: string): boolean => {
    // Always get item properties from server
    return true;
};

const extractedUrlPropertyEntry = {
    featureId: 'extractedUrl',
    propertyPaths: [embeddedUrlPropertyPath, urlPropertyPath],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldGetItemPropertiesFromServer,
};

export default extractedUrlPropertyEntry;

import { mailStore } from 'owa-mail-store';
import { sendContentRequestExtendedPropertyUri } from '../constants';
import shouldMakeGetItemCall from '../shouldMakeGetItemCall';
import { GetItemManagerFeatureIds } from 'owa-mail-smart-pill-features';

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item && !!item.SmartDocData;
};

const smartDocItemPropertyEntry = {
    featureId: GetItemManagerFeatureIds.SmartDoc,
    propertyPaths: [sendContentRequestExtendedPropertyUri],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldMakeGetItemCall,
};

export default smartDocItemPropertyEntry;

import { smartReplyExtendedPropertyUri } from '../constants';
import { mailStore } from 'owa-mail-store';
import { GetItemManagerFeatureIds } from 'owa-mail-smart-pill-features';
import shouldMakeGetItemCall from '../shouldMakeGetItemCall';

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item && !!item.SmartReplyData;
};

const smartReplyItemPropertyEntry = {
    featureId: GetItemManagerFeatureIds.SmartReply,
    propertyPaths: [smartReplyExtendedPropertyUri],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldMakeGetItemCall,
};

export default smartReplyItemPropertyEntry;

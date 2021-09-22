import isGroupItem from './isGroupItem';
import { isFeatureEnabled } from 'owa-feature-flags';
import mailStore from 'owa-mail-store/lib/store/Store';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import propertyUri from 'owa-service/lib/factory/propertyUri';

export const featureId = 'UserHighlight';
const propertyPath = propertyUri({ FieldURI: 'UserHighlightData' });

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item && item.userHighlightData != undefined;
};

const shouldGetItemPropertiesFromServer = (
    itemId: string,
    listviewType: ReactListViewType
): boolean => {
    if (!isFeatureEnabled('rp-userMarkup')) {
        return false;
    }

    const item = mailStore.items.get(itemId);
    return item && !isGroupItem(item);
};

const userHighlightItemPropertyEntry = {
    featureId: featureId,
    propertyPaths: [propertyPath],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldGetItemPropertiesFromServer,
};

export default userHighlightItemPropertyEntry;

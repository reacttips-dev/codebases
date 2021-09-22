import { isFeatureEnabled } from 'owa-feature-flags';
import mailStore from 'owa-mail-store/lib/store/Store';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import propertyUri from 'owa-service/lib/factory/propertyUri';

const featureId = 'LinkDiscovery';
const propertyPath = propertyUri({ FieldURI: 'HasProcessedSharepointLink' });

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item && item.HasProcessedSharepointLink != undefined;
};

const shouldGetItemPropertiesFromServer = (
    itemId: string,
    listviewType: ReactListViewType
): boolean => {
    return isFeatureEnabled('doc-linkDiscovery-useNewProperty');
};

export const linkDiscoveryItemPropertyEntry = {
    featureId: featureId,
    propertyPaths: [propertyPath],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldGetItemPropertiesFromServer,
};

export default linkDiscoveryItemPropertyEntry;

import isGroupItem from './isGroupItem';
import { isFeatureEnabled } from 'owa-feature-flags';
import mailStore from 'owa-mail-store/lib/store/Store';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { USER_NOTE_EXTENDED_PROPERTY_URI } from '../utils/constants';

export const featureId = 'UserNote';
export const USER_NOTE_DATA_PROPERTY_NAME = 'UserNoteData';

const isPropertyExistedOnItem = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return item && item.userNoteData != undefined;
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

const userNoteItemPropertyEntry = {
    featureId: featureId,
    propertyPaths: [USER_NOTE_EXTENDED_PROPERTY_URI],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldGetItemPropertiesFromServer,
};

export default userNoteItemPropertyEntry;

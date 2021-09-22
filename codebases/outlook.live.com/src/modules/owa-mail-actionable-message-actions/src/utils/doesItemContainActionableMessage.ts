import { isFeatureEnabled } from 'owa-feature-flags';
import Item from 'owa-service/lib/contract/Item';
import getExtendedPropertyValue from 'owa-mail-store/lib/utils/getExtendedPropertyValue';
import { EXPLICIT_MESSAGE_CARD_PROPERTY_NAME } from '../constants';

const doesItemContainActionableMessage = (item: Item): boolean => {
    if (!isFeatureEnabled('rp-actionableMessagesV2')) {
        return false;
    }

    const propertyValue = getExtendedPropertyValue(item, null, EXPLICIT_MESSAGE_CARD_PROPERTY_NAME);
    if (propertyValue && (propertyValue as string).toLowerCase() === 'true') {
        return true;
    } else {
        return false;
    }
};

export default doesItemContainActionableMessage;

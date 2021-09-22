import type Item from 'owa-service/lib/contract/Item';
import getExtendedPropertyValue from 'owa-mail-store/lib/utils/getExtendedPropertyValue';
import { MESSAGE_CARD_PROPERTY_NAME } from '../constants';

const doesItemContainCardPayload = (item: Item): boolean => {
    const cardPayloadExtendedProperty = getExtendedPropertyValue(
        item,
        null /* tag */,
        MESSAGE_CARD_PROPERTY_NAME
    );

    return !!cardPayloadExtendedProperty;
};

export default doesItemContainCardPayload;

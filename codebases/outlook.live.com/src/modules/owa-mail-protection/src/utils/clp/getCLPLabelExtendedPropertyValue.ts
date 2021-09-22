import type Item from 'owa-service/lib/contract/Item';
import getExtendedPropertyValue from 'owa-mail-store/lib/utils/getExtendedPropertyValue';

const LABEL_PROPERTY_NAME = 'msip_labels';

export default function getCLPLabelExtendedPropertyValue(item: Item) {
    if (!item || !item.ExtendedProperty) {
        return null;
    }

    // CLP label string in item does not have tag only in property name.
    return getExtendedPropertyValue(item, null /*Tag*/, LABEL_PROPERTY_NAME);
}

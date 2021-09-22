import getDefaultBodyType from './getDefaultBodyType';
import type BodyType from 'owa-service/lib/contract/BodyType';
import type Item from 'owa-service/lib/contract/Item';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';

const getBodyTypeForResponse = (parentItem: Item): BodyType => {
    // For S/MIME item, use the body type of the original item.
    // For other cases, use the body type from UserConfiguration.
    return isSMIMEItem(parentItem) && parentItem.NormalizedBody
        ? parentItem.NormalizedBody.BodyType
        : getDefaultBodyType();
};

export default getBodyTypeForResponse;

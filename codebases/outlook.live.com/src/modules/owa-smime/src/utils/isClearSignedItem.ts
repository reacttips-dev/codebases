import { ITEM_CLASS_SMIME_CLEAR_SIGNED } from 'owa-smime-adapter/lib/utils/constants';
import type Item from 'owa-service/lib/contract/Item';

/**
 * Returns whether an Item is an S/MIME clear signed item
 * @param item
 */
const isClearSignedItem = (item: Item): boolean =>
    item && item.ItemClass === ITEM_CLASS_SMIME_CLEAR_SIGNED;

export default isClearSignedItem;

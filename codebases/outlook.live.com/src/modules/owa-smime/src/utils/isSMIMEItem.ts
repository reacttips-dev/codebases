import type Item from 'owa-service/lib/contract/Item';
import { isItemClassSmime } from './smimeItemClassUtils';

export default function isSMIMEItem(item: Item): boolean {
    return item && isItemClassSmime(item.ItemClass);
}

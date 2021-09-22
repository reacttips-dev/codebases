import { mailStore, ClientItem } from 'owa-mail-store';
import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import type Item from 'owa-service/lib/contract/Item';
import { action } from 'satcheljs/lib/legacy';

export default action('updateExtendedProperty')(function updateExtendedProperty(
    item: Item,
    extendedProperty: ExtendedPropertyType
) {
    if (item.ExtendedProperty) {
        item.ExtendedProperty.push(extendedProperty);
        mailStore.items.set(item.ItemId.Id, item as ClientItem);
    }
});

import getItem from './getItem';
import type Item from 'owa-service/lib/contract/Item';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';

function getEntityExtractionResultResponseShape(): ItemResponseShape {
    return itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [propertyUri({ FieldURI: 'EntityExtractionResult' })],
    });
}

export default function getEntityExtractionResult(item: Item): Promise<Item> {
    return getItem(
        [item.ItemId.Id],
        getEntityExtractionResultResponseShape(),
        null /* shapeName */
    );
}

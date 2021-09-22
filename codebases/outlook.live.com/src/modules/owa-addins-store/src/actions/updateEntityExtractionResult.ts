import type Item from 'owa-service/lib/contract/Item';
import { action } from 'satcheljs/lib/legacy';

export default action('updateEntityExtractionResult')(function (
    item: Item,
    entityExtractionResult: Item
) {
    item.EntityExtractionResult = entityExtractionResult;
});

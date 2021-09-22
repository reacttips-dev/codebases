import { action } from 'satcheljs/lib/legacy';
import type ItemId from 'owa-service/lib/contract/ItemId';

/*TODO: After OfficeMain:3200464 is fixed, we can remove this action. */
export default action('updateChangeKeyOnItemId')(function updateChangeKeyOnItemId(
    itemId: ItemId,
    changeKey: string
): void {
    itemId.ChangeKey = changeKey;
});

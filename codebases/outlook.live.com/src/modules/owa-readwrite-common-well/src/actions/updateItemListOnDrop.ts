import { action } from 'satcheljs/lib/legacy';
import type ReadWriteCommonWellItemViewState from '../store/schema/ReadWriteCommonWellItemViewState';

export default action('updateItemListOnDrop')(function updateItemListOnDrop(
    itemList: ReadWriteCommonWellItemViewState[],
    dropIndex: number,
    dragItem: ReadWriteCommonWellItemViewState
) {
    itemList.splice(dropIndex, 0, dragItem);
});

/**
 * Moves an item in an array located at fromIndex to the position before the indexToInsertBefore
 * @param arr the array with the element to be moved
 * @param fromIndex item at this index will be moved
 * @param indexToInsertBefore item will be inserted before this index
 */
export default function moveDragAndDroppableItem(
    arr: any[],
    fromIndex: number,
    indexToInsertBefore: number
) {
    if (fromIndex === indexToInsertBefore) {
        return;
    }
    // Validate the indices
    if (fromIndex === -1 || indexToInsertBefore === -1) {
        return;
    }
    // If moving an element down the list, decrement the toIndex since the splice will shift all the elements up
    if (fromIndex < indexToInsertBefore) {
        indexToInsertBefore--;
    }

    let itemToMove = arr.splice(fromIndex, 1)[0];
    arr.splice(indexToInsertBefore, 0, itemToMove);
}

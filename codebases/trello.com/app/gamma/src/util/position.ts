/* eslint-disable @trello/disallow-filenames */
interface ItemWithPosition {
  id: string;
  pos: number;
}

export const isInPosition = (
  index: number,
  allItems: ItemWithPosition[],
  item: ItemWithPosition,
) => {
  const itemAtPosition = item && allItems[index];

  return itemAtPosition && itemAtPosition.id === item.id;
};

export const calculatePos = (
  index: number,
  allItems: ItemWithPosition[],
  item: ItemWithPosition,
  fxFilter?: (item: ItemWithPosition) => boolean,
  includeItem?: boolean,
) => {
  const indexStep = 65536; // 2^16
  const items = allItems.filter(
    (c) =>
      (!(item && item.id === c.id) || includeItem) &&
      (!fxFilter || fxFilter(c)),
  );

  // if the item is in position no point in moving it around
  if (isInPosition(index, items, item)) {
    return item.pos;
  }

  const indexBounded = Math.min(Math.max(index, 0), items.length);
  const itemPrev = items[indexBounded - 1];
  const itemNext = items[indexBounded];
  const posItemCurr = (item ? item.pos : undefined) || -1;
  const posItemPrev = itemPrev ? itemPrev.pos : -1;
  const posItemNext = itemNext ? itemNext.pos : -1;

  if (posItemNext === -1) {
    // Ensure that the new pos comes after the prev card pos
    if (item && posItemCurr > posItemPrev) {
      // it's already after so no need to update
      return posItemCurr;
    } else {
      // bump it one past the last item
      return posItemPrev + indexStep;
    }
  } else {
    if (item && posItemCurr > posItemPrev && posItemCurr < posItemNext) {
      return posItemCurr;
    } else if (posItemPrev >= 0) {
      return (posItemNext + posItemPrev) / 2;
    } else {
      // halve the pos of the top item
      return posItemNext / 2;
    }
  }
};

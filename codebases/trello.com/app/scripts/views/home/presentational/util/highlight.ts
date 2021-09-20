/* eslint-disable @trello/disallow-filenames */
import {
  CardInfo,
  getAllOverflowItems,
  Handlers,
  ItemKeys,
} from './overflow-menu-items';

export const getHighlightsOverflowItems = (
  cardInfo: CardInfo,
  handlers: Handlers,
) => {
  const itemKeys: ItemKeys = {
    subscribe: true,
    unsubscribe: true,
    joinCard: true,
    leaveCard: true,
  };

  const tracking = {
    getPrepObj: () => '',
    getIndObj: () => '',
    getMethod: (itemName: string) =>
      `by clicking ${itemName} menu item on highlights card`,
  };

  const overflowItems = getAllOverflowItems(cardInfo, handlers, tracking);

  return overflowItems.filter((item) => item.shouldShow && itemKeys[item.key]);
};

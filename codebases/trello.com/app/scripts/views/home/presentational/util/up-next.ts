/* eslint-disable @trello/disallow-filenames */
import {
  CardInfo,
  getAllOverflowItems,
  Handlers,
  ItemKeys,
} from './overflow-menu-items';

export interface UpNextInfo {
  isDueSoon: boolean;
  isComment: boolean;
  isAddMemberToCard: boolean;
  hasMeAsMember: boolean;
  isActionCreatorMe: boolean;
}

export const getTrackingPrepObj = ({
  isDueSoon,
  isComment,
  isAddMemberToCard,
  isActionCreatorMe,
  hasMeAsMember,
}: UpNextInfo): string => {
  if (isComment) {
    return 'member is @-mentioned on';
  } else if (isDueSoon) {
    if (hasMeAsMember) {
      return "member is assigned to that's due soon/recently overdue";
    } else {
      return "no one is assigned to that's due soon/recently overdue";
    }
  } else if (isAddMemberToCard) {
    if (isActionCreatorMe) {
      return 'member added self to';
    } else {
      return 'member is added to';
    }
  }

  return '';
};

export const getTrackingIndObj = ({
  isDueSoon,
  isComment,
  isAddMemberToCard,
  isActionCreatorMe,
  hasMeAsMember,
}: UpNextInfo): string => {
  if (isComment) {
    return 'on card member is @-mentioned on';
  } else if (isDueSoon) {
    if (hasMeAsMember) {
      return "on card member is assigned to that's due soon/recently overdue";
    } else {
      return "on card no one is assigned to that's due soon/recently overdue";
    }
  } else if (isAddMemberToCard) {
    if (isActionCreatorMe) {
      return 'on card member added self to';
    } else {
      return 'on card member is added to';
    }
  }

  return '';
};

export const getUpNextOverflowItems = (
  cardInfo: CardInfo,
  handlers: Handlers,
  upNextInfo: UpNextInfo,
) => {
  const itemKeys: ItemKeys = {
    subscribe: true,
    unsubscribe: true,
    addDueDate: true,
    changeDueDate: true,
    addMembers: true,
  };

  const tracking = {
    getPrepObj: () => getTrackingPrepObj(upNextInfo),
    getIndObj: () => getTrackingIndObj(upNextInfo),
    getMethod: (itemName: string) =>
      `by clicking ${itemName} menu item on up next card`,
  };

  const overflowItems = getAllOverflowItems(cardInfo, handlers, tracking);

  return overflowItems.filter((item) => item.shouldShow && itemKeys[item.key]);
};

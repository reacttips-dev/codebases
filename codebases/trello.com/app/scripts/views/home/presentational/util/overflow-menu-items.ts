/* eslint-disable @trello/disallow-filenames */
import { forNamespace } from '@trello/i18n';
const l = forNamespace('home card overflow menu title');
import { Analytics } from '@trello/atlassian-analytics';

export type ItemKey =
  | 'subscribe'
  | 'unsubscribe'
  | 'addDueDate'
  | 'changeDueDate'
  | 'addMembers'
  | 'joinCard'
  | 'leaveCard';

export type ItemKeys = { [key in ItemKey]?: boolean };

export interface CardInfo {
  editable: boolean;
  hasDueDate: boolean;
  hasMeAsMember: boolean;
  cardId: string;
  isSubscribed: boolean;
}

export type Handlers = { [key in ItemKey]: () => void };

export interface OverflowItem {
  key: ItemKey;
  name: string;
  onClick: () => void;
  shouldShow: boolean;
}

interface TrackingOpts {
  getPrepObj: () => string;
  getIndObj: () => string;
  getMethod: (itemName: string) => string;
}

const trackAddDueDate = (tracking: TrackingOpts, cardId: string) => {
  const { getIndObj } = tracking;

  Analytics.sendClickedButtonEvent({
    buttonName: 'addDueDateButton',
    source: 'cardActionsInlineDialog',
    containers: {
      card: {
        id: cardId,
      },
    },
    attributes: {
      memberInfo: getIndObj,
    },
  });
};

const trackChangeDueDate = (tracking: TrackingOpts, cardId: string) => {
  const { getIndObj } = tracking;

  Analytics.sendClickedButtonEvent({
    buttonName: 'changeDueDateButton',
    source: 'cardActionsInlineDialog',
    containers: {
      card: {
        id: cardId,
      },
    },
    attributes: {
      memberInfo: getIndObj,
    },
  });
};

const trackAddMembers = (tracking: TrackingOpts, cardId: string) => {
  const { getIndObj } = tracking;

  Analytics.sendClickedButtonEvent({
    buttonName: 'changeMembersOnCardButton',
    source: 'cardActionsInlineDialog',
    containers: {
      card: {
        id: cardId,
      },
    },
    attributes: {
      memberInfo: getIndObj,
    },
  });
};

const trackJoinCard = (tracking: TrackingOpts, cardId: string) => {
  const { getIndObj } = tracking;

  Analytics.sendClickedButtonEvent({
    buttonName: 'joinCardButton',
    source: 'cardActionsInlineDialog',
    containers: {
      card: {
        id: cardId,
      },
    },
    attributes: {
      memberInfo: getIndObj,
    },
  });
};

const trackLeaveCard = (tracking: TrackingOpts, cardId: string) => {
  const { getIndObj } = tracking;

  Analytics.sendClickedButtonEvent({
    buttonName: 'leaveCardButton',
    source: 'cardActionsInlineDialog',
    containers: {
      card: {
        id: cardId,
      },
    },
    attributes: {
      memberInfo: getIndObj,
    },
  });
};

export const getAllOverflowItems = (
  cardInfo: CardInfo,
  handlers: Handlers,
  tracking: TrackingOpts,
): OverflowItem[] => {
  const {
    isSubscribed,
    hasDueDate,
    editable,
    hasMeAsMember,
    cardId,
  } = cardInfo;

  const items: OverflowItem[] = [
    {
      key: 'subscribe',
      name: l('watch'),
      shouldShow: !isSubscribed,
      onClick: () => handlers.subscribe(),
    },
    {
      key: 'unsubscribe',
      name: l('stop watching'),
      shouldShow: isSubscribed,
      onClick: () => handlers.unsubscribe(),
    },
    {
      key: 'addDueDate',
      name: l('add due date'),
      shouldShow: !hasDueDate && editable,
      onClick: () => {
        trackAddDueDate(tracking, cardId);
        handlers.addDueDate();
      },
    },
    {
      key: 'changeDueDate',
      name: l('change due date'),
      shouldShow: hasDueDate && editable,
      onClick: () => {
        trackChangeDueDate(tracking, cardId);
        handlers.changeDueDate();
      },
    },
    {
      key: 'addMembers',
      name: l('add members to card'),
      shouldShow: editable,
      onClick: () => {
        trackAddMembers(tracking, cardId);
        handlers.addMembers();
      },
    },
    {
      key: 'joinCard',
      name: l('join card'),
      shouldShow: !hasMeAsMember && editable,
      onClick: () => {
        trackJoinCard(tracking, cardId);
        handlers.joinCard();
      },
    },
    {
      key: 'leaveCard',
      name: l('leave card'),
      shouldShow: hasMeAsMember && editable,
      onClick: () => {
        trackLeaveCard(tracking, cardId);
        handlers.leaveCard();
      },
    },
  ];

  return items;
};

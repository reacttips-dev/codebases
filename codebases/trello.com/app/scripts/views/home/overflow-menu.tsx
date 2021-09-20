import {
  Analytics,
  getScreenFromUrl,
  tracingCallback,
} from '@trello/atlassian-analytics';
import { Auth } from 'app/scripts/db/auth';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import CardMemberSelectView from 'app/scripts/views/card/card-member-select-view';
import DatePickerView from 'app/scripts/views/card/date-picker-view';
import {
  getUpNextOverflowItems,
  UpNextInfo,
} from './presentational/util/up-next';
import { getHighlightsOverflowItems } from './presentational/util/highlight';
import { getDueDatesOverflowItems } from './presentational/util/due-date';
import type { Card } from 'app/scripts/models/card';
import { ModelCache } from 'app/scripts/db/model-cache';

type UP_NEXT_TYPE = 'UP_NEXT';
type HIGHLIGHT_TYPE = 'HIGHLIGHTS';
type DUE_DATE_TYPE = 'DUE_DATES';

export const UP_NEXT_TYPE: UP_NEXT_TYPE = 'UP_NEXT';
export const HIGHLIGHT_TYPE: HIGHLIGHT_TYPE = 'HIGHLIGHTS';
export const DUE_DATE_TYPE: DUE_DATE_TYPE = 'DUE_DATES';

interface CardResponse {
  id: string;
  idList: string;
  idBoard: string;
}

const onClickSubscribe = (card: Card) => {
  const source = getScreenFromUrl();
  const traceId = Analytics.startTask({
    taskName: 'edit-card/subscribed',
    source,
  });
  // @ts-expect-error
  card.subscribeWithTracing(
    true,
    traceId,
    tracingCallback(
      {
        taskName: 'edit-card/subscribed',
        source,
        traceId,
      },
      (_err, response: CardResponse) => {
        if (response) {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'subscribed',
            source,
            containers: {
              card: { id: response.id },
              board: { id: response.idBoard },
              list: { id: response.idList },
            },
            attributes: {
              taskId: traceId,
            },
          });
        }
      },
    ),
  );
  return PopOver.hide();
};

const onClickUnsubscribe = (card: Card) => {
  const source = getScreenFromUrl();
  const traceId = Analytics.startTask({
    taskName: 'edit-card/subscribed',
    source,
  });
  // @ts-expect-error
  card.subscribeWithTracing(
    false,
    traceId,
    tracingCallback(
      {
        taskName: 'edit-card/subscribed',
        source,
        traceId,
      },
      (_err, response: CardResponse) => {
        if (response) {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'subscribed',
            source,
            containers: {
              card: { id: response.id },
              board: { id: response.idBoard },
              list: { id: response.idList },
            },
            attributes: {
              taskId: traceId,
            },
          });
        }
      },
    ),
  );
  return PopOver.hide();
};

const onClickDueDate = (card: Card, modelCache: typeof ModelCache) => {
  return PopOver.pushView({
    view: DatePickerView,
    options: { model: card, modelCache, trackingCategory: 'home' },
  });
};

const onClickAddMembers = (card: Card, modelCache: typeof ModelCache) => {
  return PopOver.pushView({
    view: CardMemberSelectView,
    options: { model: card, modelCache },
  });
};

const onClickJoinCard = (card: Card) => {
  const source = getScreenFromUrl();
  const traceId = Analytics.startTask({
    taskName: 'edit-card/idMembers',
    source,
  });

  card.addMemberWithTracing(
    Auth.myId(),
    traceId,
    tracingCallback(
      {
        taskName: 'edit-card/idMembers',
        traceId,
        source,
      },
      () => {
        Analytics.sendUpdatedCardFieldEvent({
          field: 'idMembers',
          source,
          containers: {
            card: { id: card.id },
            board: { id: card.get('idBoard') },
            list: { id: card.get('idList') },
          },
          attributes: {
            taskId: traceId,
          },
        });
      },
    ),
  );
  return PopOver.hide();
};

const onClickLeaveCard = (card: Card) => {
  const source = getScreenFromUrl();
  const traceId = Analytics.startTask({
    taskName: 'edit-card/idMembers',
    source,
  });

  card.removeMemberWithTracing(
    Auth.myId(),
    traceId,
    tracingCallback(
      {
        taskName: 'edit-card/idMembers',
        traceId,
        source,
      },
      () => {
        Analytics.sendUpdatedCardFieldEvent({
          field: 'idMembers',
          source,
          containers: {
            card: { id: card.id },
            board: { id: card.get('idBoard') },
            list: { id: card.get('idList') },
          },
          attributes: {
            taskId: traceId,
          },
        });
      },
    ),
  );
  return PopOver.hide();
};

export const getOverflowItems = (
  card: Card,
  type: UP_NEXT_TYPE | HIGHLIGHT_TYPE | DUE_DATE_TYPE,
  modelCache: typeof ModelCache,
  upNextInfo?: UpNextInfo,
) => {
  if (
    type !== UP_NEXT_TYPE &&
    type !== HIGHLIGHT_TYPE &&
    type !== DUE_DATE_TYPE
  ) {
    throw new Error('invalid feed type');
  }

  const cardInfo = {
    cardId: card.id,
    editable: card.editable(),
    // @ts-expect-error
    isSubscribed: card.isSubscribed(),
    hasDueDate: Boolean(card.getDueDate()),
    hasMeAsMember: card.hasMember(Auth.myId()),
  };

  const handlers = {
    subscribe: () => onClickSubscribe(card),
    unsubscribe: () => onClickUnsubscribe(card),
    addDueDate: () => onClickDueDate(card, modelCache),
    changeDueDate: () => onClickDueDate(card, modelCache),
    addMembers: () => onClickAddMembers(card, modelCache),
    joinCard: () => onClickJoinCard(card),
    leaveCard: () => onClickLeaveCard(card),
  };

  if (type === UP_NEXT_TYPE && upNextInfo) {
    return getUpNextOverflowItems(cardInfo, handlers, upNextInfo);
  }
  if (type === HIGHLIGHT_TYPE) {
    return getHighlightsOverflowItems(cardInfo, handlers);
  }
  if (type === DUE_DATE_TYPE) {
    return getDueDatesOverflowItems(cardInfo, handlers);
  }
};

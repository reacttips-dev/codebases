import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Analytics, tracingCallback } from '@trello/atlassian-analytics';
import { Auth } from 'app/scripts/db/auth';
import { Label } from 'app/scripts/models/label';
import ModelCacheListener from 'app/scripts/views/internal/model-cache-listener';
import { TrelloStorage } from '@trello/storage';
import TFM from 'app/scripts/lib/markdown/tfm';
import { Util } from 'app/scripts/lib/util';
import { CanonicalCard } from 'app/scripts/views/canonical-card/canonical-card-components';
import { CanonicalDetail } from 'app/scripts/views/canonical-detail/canonical-detail-components';
import * as TrelloCanonicalComponents from '@atlassian/trello-canonical-components';
const { BoardAndDetailContainer } = TrelloCanonicalComponents.CanonicalDetail;
import {
  getOverflowItems,
  UP_NEXT_TYPE,
} from 'app/scripts/views/home/overflow-menu';
import {
  getTrackingPrepObj,
  getTrackingIndObj,
} from './presentational/util/up-next';
import { siteDomain } from '@trello/config';
import { Action } from 'app/scripts/models/action';
import { Card } from 'app/scripts/models/card';
import { ModelCache } from 'app/scripts/db/model-cache';

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((v) => ++v);
}

export interface UpNextProps {
  boardId: string;
  cardId: string;
  idAction: string;
  listId: string;
  modelCache: typeof ModelCache;
  reactionList: Array<object>;
  setFocusedCard: (card: Card) => void;
  item: {
    type: string;
    actionId: string;
  };
  optimisticallyDismissCard: (
    upNextId: string,
    dismissed?: boolean,
    delay?: boolean,
  ) => void;
  upNextId: string;
  card: Card;
  dismissUpNextCard: (
    cardId: string,
    upNextId: string,
    trackingPrepositionalObject: string,
  ) => void;
  modelListener: (card: Card, eventName: string, callback: () => void) => void;
  clearModelListeners: () => void;
}

export interface UpNextStateProps {
  isReplying?: boolean;
  isWaitingForNetworkResponse?: boolean;
  replyMessage?: string;
  replyFailedStatusCode?: string | boolean | null;
}

// eslint-disable-next-line @trello/no-module-logic
export const UpNext = ModelCacheListener(
  ({
    boardId,
    cardId,
    idAction,
    listId,
    modelCache,
    reactionList,
    setFocusedCard,
    item,
    optimisticallyDismissCard,
    upNextId,
    dismissUpNextCard,
    modelListener,
    clearModelListeners,
  }: UpNextProps) => {
    const forceUpdate = useForceUpdate();

    const getModelFromModelCache = useCallback(
      (type: string, id: string) => {
        // @ts-expect-error
        return modelCache.get(type, id);
      },
      [modelCache],
    );

    const dueSoon = item.type === 'dueSoon';
    const actionItem = modelCache.get('Action', item?.actionId) as Action;
    const idMemberCreator = actionItem?.get('idMemberCreator') as string;
    const actionMemberCreator =
      actionItem && idMemberCreator
        ? modelCache.get('Member', idMemberCreator)
        : undefined;

    const isEdited = !!actionItem?.data?.dateLastEdited;
    const isComment = actionItem?.get('type') === 'commentCard';
    const isAddMemberToCard = actionItem?.get('type') === 'addMemberToCard';

    const getUpNextTypeInfo = () => {
      return {
        isComment: isComment,
        isDueSoon: dueSoon,
        isAddMemberToCard: isAddMemberToCard,
        isActionCreatorMe:
          actionMemberCreator && Auth.isMe(actionMemberCreator),
        hasMeAsMember: (getModelFromModelCache(
          'Card',
          cardId,
        ) as Card).hasMember(Auth.myId()),
      };
    };

    const getTrackingIndirectObject = () => {
      // @ts-expect-error
      return getTrackingIndObj(getUpNextTypeInfo());
    };

    const getTrackingPrepositionalObject = () => {
      // @ts-expect-error
      return getTrackingPrepObj(getUpNextTypeInfo());
    };

    const trackingPrepositionalObject = getTrackingPrepositionalObject();
    const trackingIndirectObject = getTrackingIndirectObject();

    const trackOnClickCanonicalCard = () => {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'tile',
        actionSubjectId: 'cardTile',
        source: 'memberHomeUpNextSection',
        containers: {
          card: {
            id: cardId,
          },
        },
        attributes: {
          memberInfo: trackingPrepositionalObject,
        },
      });
    };

    const trackOverflowMenuOpens = () => {
      Analytics.sendScreenEvent({
        name: 'cardActionsInlineDialogScreen',
        containers: {
          card: {
            id: cardId,
          },
        },
        attributes: {
          memberInfo: trackingIndirectObject,
        },
      });
    };

    const board = getModelFromModelCache('Board', boardId);
    const card = getModelFromModelCache('Card', cardId);
    const canReply =
      (isComment || isAddMemberToCard) &&
      actionMemberCreator &&
      board?.canComment(Auth.me());

    const [state, _setState] = useState({
      isReplying: false,
      isWaitingForNetworkResponse: false,
      replyMessage:
        canReply && actionMemberCreator && !Auth.isMe(actionMemberCreator)
          ? `@${actionMemberCreator?.get('username')} `
          : '',
      replyFailedStatusCode: null,
    } as UpNextStateProps);

    const setState = (newState: UpNextStateProps) => {
      _setState((prevState) => {
        return {
          ...prevState,
          ...newState,
        };
      });
    };

    const _commentDraftKey = useCallback(() => {
      return `draft_${upNextId}_comment`;
    }, [upNextId]);

    const listenOnCardChange = useCallback(() => {
      const relevantCard = getModelFromModelCache('Card', cardId);
      return modelListener(relevantCard, 'change', () => {
        if (item.type === 'dueSoon' && !relevantCard.getDueDate()) {
          optimisticallyDismissCard(upNextId, true, false);
        }

        forceUpdate();
      });
    }, [
      cardId,
      forceUpdate,
      getModelFromModelCache,
      item.type,
      modelListener,
      optimisticallyDismissCard,
      upNextId,
    ]);

    const prevCardId = usePrevious(cardId);

    useEffect(() => {
      if (cardId !== prevCardId) {
        clearModelListeners();
        listenOnCardChange();
      }
    }, [cardId, clearModelListeners, listenOnCardChange, prevCardId]);

    useEffect(() => {
      listenOnCardChange();

      const commentDraftText = TrelloStorage.get(_commentDraftKey());
      if (commentDraftText) {
        setState({ replyMessage: commentDraftText });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // We only want this to fire once on component did mount

    const onChangeReplyMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
      Util.preventDefault(e);
      const commentText = e.target.value;
      setState({ replyMessage: commentText });
      if (commentText) {
        TrelloStorage.set(_commentDraftKey(), commentText);
      } else {
        TrelloStorage.unset(_commentDraftKey());
      }
    };

    const onCancelClick = (_cardId: string, actionId: string) => {
      Analytics.sendClickedLinkEvent({
        linkName: 'cancelReplyLink',
        source: 'memberHomeUpNextSection',
        containers: {
          card: {
            id: cardId,
          },
        },
        attributes: {
          memberInfo: trackingIndirectObject,
          actionId: actionId,
        },
      });
      return setState({ isReplying: false });
    };

    const onCompleteClick = () => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'completeCardButton',
        source: 'memberHomeUpNextSection',
        containers: {
          card: {
            id: cardId,
          },
        },
        attributes: {
          memberInfo: trackingIndirectObject,
        },
      });
      getModelFromModelCache('Card', cardId).update({ dueComplete: true });
      return optimisticallyDismissCard(upNextId);
    };

    const prevIsReplying = usePrevious(state.isReplying);

    const onReplyClick = (_cardId: string, actionId: string) => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'replyButton',
        source: 'memberHomeUpNextSection',
        containers: {
          card: {
            id: cardId,
          },
        },
        attributes: {
          memberInfo: trackingIndirectObject,
          actionId: actionId,
        },
      });
      return setState({
        isReplying: !prevIsReplying,
      });
    };

    interface CommentResponse {
      data: {
        card: { id: string };
        list: { id: string };
        board: { id: string };
      };
    }

    const onSaveClick = (_cardId: string, actionId: string) => {
      if (!canReply) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName: 'create-comment',
        source: 'memberHomeScreen',
      });

      Analytics.sendClickedLinkEvent({
        linkName: 'saveReplyLink',
        source: 'memberHomeUpNextSection',
        containers: {
          card: {
            id: cardId,
          },
        },
        attributes: {
          memberInfo: trackingIndirectObject,
          actionId: actionId,
        },
      });

      setState({ isWaitingForNetworkResponse: true });

      return getModelFromModelCache('Card', _cardId)
        ?.addComment(
          state.replyMessage,
          traceId,
          tracingCallback(
            {
              taskName: 'create-comment',
              source: 'memberHomeScreen',
              traceId,
            },
            (err, response: CommentResponse) => {
              if (!err && response) {
                Analytics.sendTrackEvent({
                  action: 'added',
                  actionSubject: 'comment',
                  source: 'memberHomeUpNextSection',
                  attributes: {
                    taskId: traceId,
                  },
                  containers: {
                    card: { id: response.data?.card?.id },
                    list: { id: response.data?.list?.id },
                    board: { id: response.data?.board?.id },
                  },
                });
              }
            },
          ),
        )
        .then(() => {
          setState({ isWaitingForNetworkResponse: false });
          return optimisticallyDismissCard(upNextId);
        })
        .catch((error: { status: string }) => {
          return setState({
            replyFailedStatusCode: error.status || true,
            isWaitingForNetworkResponse: false,
          });
        });
    };

    const dismissCard = () => {
      return dismissUpNextCard(
        card?.get('id'),
        upNextId,
        trackingPrepositionalObject,
      );
    };

    const org = getModelFromModelCache('Organization', boardId);
    const list = getModelFromModelCache('List', listId);

    const _tfmFormatOpts = {
      card,
      board,
      siteDomain,
      textData: actionItem?.data?.textData,
    };

    return (
      <BoardAndDetailContainer width={420}>
        <div
          role="button"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => trackOnClickCanonicalCard()}
        >
          <CanonicalCard
            board={board}
            boardClassName="canonical-stretch"
            canRemove={false}
            card={card}
            cardClassName="canonical-stretch"
            labels={card.getLabels()?.sort(Label.compare)}
            list={list}
            lightBackground={true}
            members={card.memberList?.models}
            numNotifications={0}
            organization={org}
          />
        </div>
        <div>
          <CanonicalDetail
            dueSoon={dueSoon}
            // eslint-disable-next-line react/jsx-no-bind
            trackOverflowMenuOpens={trackOverflowMenuOpens}
            actionMemberCreator={actionMemberCreator}
            board={board}
            canDismiss={true}
            canReply={canReply}
            cardId={cardId}
            collapseComment={isComment}
            commentText={
              isComment &&
              TFM.comments.format(
                actionItem.get('display').entities.comment.text,
                _tfmFormatOpts,
              ).output
            }
            date={actionItem?.get('date')}
            dueDate={card.get('badges').due}
            idAction={idAction}
            isActionMemberCreatorDeleted={
              actionItem?.get('display')?.entities?.memberCreator
                ?.translationKey === 'action_deleted_account'
            }
            isAddMemberToCard={isAddMemberToCard}
            isEdited={isEdited}
            isReplying={state.isReplying}
            isWaitingForNetworkResponse={state.isWaitingForNetworkResponse}
            memberCreator={Auth.me()}
            // eslint-disable-next-line react/jsx-no-bind
            onCancelClick={() => onCancelClick(cardId, actionItem?.id)}
            // eslint-disable-next-line react/jsx-no-bind
            onChangeReplyMessage={onChangeReplyMessage}
            // eslint-disable-next-line react/jsx-no-bind
            onCompleteClick={onCompleteClick}
            // eslint-disable-next-line react/jsx-no-bind
            onDismissClick={dismissCard}
            // eslint-disable-next-line react/jsx-no-bind
            onReplyClick={() => onReplyClick(cardId, actionItem?.id)}
            // eslint-disable-next-line react/jsx-no-bind
            onSaveClick={() => onSaveClick(cardId, actionItem?.id)}
            overflowMenuItems={getOverflowItems(
              card,
              UP_NEXT_TYPE,
              modelCache,
              // @ts-expect-error
              getUpNextTypeInfo(),
            )}
            reactionList={reactionList}
            replyFailedStatusCode={state.replyFailedStatusCode}
            replyMessage={state.replyMessage}
            // eslint-disable-next-line react/jsx-no-bind
            setFocusedCard={() => setFocusedCard(card)}
          />
        </div>
      </BoardAndDetailContainer>
    );
  },
);

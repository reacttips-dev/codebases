import React, { useEffect, useState, useRef, useCallback } from 'react';
import BlueBirdPromise from 'bluebird';
import { Analytics, tracingCallback } from '@trello/atlassian-analytics';
import { Auth } from 'app/scripts/db/auth';
import { Util } from 'app/scripts/lib/util';
import { Label } from 'app/scripts/models/label';
import { CanonicalCard } from 'app/scripts/views/canonical-card/canonical-card-components';
import { CanonicalDetail } from 'app/scripts/views/canonical-detail/canonical-detail-components';
import { CanonicalDetail as TrelloCanonicalComponentCanonicalDetail } from '@atlassian/trello-canonical-components';
const { BoardAndDetailContainer } = TrelloCanonicalComponentCanonicalDetail;
import ModelCacheListener from 'app/scripts/views/internal/model-cache-listener';
import {
  getOverflowItems,
  HIGHLIGHT_TYPE,
} from 'app/scripts/views/home/overflow-menu';
import TFM from 'app/scripts/lib/markdown/tfm';
import { siteDomain } from '@trello/config';
import { Action } from 'app/scripts/models/action';
import type { Member } from 'app/scripts/models/member';
import type { Card } from 'app/scripts/models/card';
import { ModelCache } from 'app/scripts/db/model-cache';

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((v) => ++v);
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export interface HighlightProps {
  currentOrgId: string;
  modelCache: typeof ModelCache;
  idAction: string;
  reactionList: string;
  modelListener: (card: Card, eventName: string, callback: () => void) => void;
  setFocusedCard: (card: Card) => void;
  onDismissClick: (idAction: string) => void;
  clearModelListeners: () => void;
}

export interface HighlightStateProps {
  isReplying?: boolean;
  replyMessage?: null | string;
  isWaitingForNetworkResponse?: boolean;
  hasReplied?: boolean;
  replyAction?: object | null;
  replyFailedStatusCode?: string | null;
  hasClickedReply?: boolean;
  hasCalledListenOnCardChange?: boolean;
}

// eslint-disable-next-line @trello/no-module-logic
export const Highlight = ModelCacheListener(
  ({
    currentOrgId,
    modelCache,
    idAction,
    reactionList,
    modelListener,
    setFocusedCard,
    onDismissClick,
    clearModelListeners,
  }: HighlightProps) => {
    const forceUpdate = useForceUpdate();

    const action = modelCache.get('Action', idAction) as Action;
    const commentMemberCreator = modelCache.get(
      'Member',
      action.get('idMemberCreator') as string,
    );
    const memberCreator = Auth.me();

    const [state, _setState] = useState({
      isReplying: false,
      replyMessage: null,
      isWaitingForNetworkResponse: false,
      hasReplied: false,
      replyAction: null,
      replyFailedStatusCode: null,
      hasClickedReply: false,
    } as HighlightStateProps);

    const setState = (newState: HighlightStateProps) => {
      _setState((prevState) => {
        return {
          ...prevState,
          ...newState,
        };
      });
    };

    const card = action.getCard();
    const board = card.getBoard();
    const organization = board.getOrganization();
    const canReply =
      board?.canComment(Auth.me()) &&
      (action.isAddAttachment() || action.isCommentLike());

    const _tfmFormatOpts = {
      card,
      board,
      siteDomain,
      textData: action.get('data').textData,
    };

    let replyActionPromise: null | BlueBirdPromise<Action> = null;

    const formatDefaultReplyMessage = (actionMemberCreator: Member) => {
      let replyMessage;
      if (actionMemberCreator && !Auth.isMe(actionMemberCreator)) {
        replyMessage = `@${actionMemberCreator.get('username')} `;
      } else {
        replyMessage = '';
      }
      return replyMessage;
    };

    const prevIdAction = usePrevious(idAction);

    const listenOnCardChange = useCallback(() => {
      const relevantAction = modelCache.get('Action', idAction) as Action;

      if (relevantAction) {
        const relevantCard = relevantAction.getCard();

        return modelListener(relevantCard, 'change', () => forceUpdate());
      }
    }, [forceUpdate, idAction, modelCache, modelListener]);

    useEffect(() => {
      if (state.hasClickedReply) {
        const relevantAction = modelCache.get('Action', idAction) as Action;
        const relevantMemberCreator = modelCache.get(
          'Member',
          relevantAction.get('idMemberCreator') as string,
        );

        setState({
          isReplying: !state.isReplying,
          replyMessage:
            state.replyMessage ||
            formatDefaultReplyMessage(relevantMemberCreator as Member),
          hasClickedReply: false,
        });
      }

      if (prevIdAction !== idAction) {
        clearModelListeners();
        listenOnCardChange();
      }

      return () => replyActionPromise?.cancel();
    }, [
      state.hasClickedReply,
      state.isReplying,
      state.replyMessage,
      modelCache,
      idAction,
      action,
      replyActionPromise,
      clearModelListeners,
      forceUpdate,
      modelListener,
      prevIdAction,
      listenOnCardChange,
    ]);

    useEffect(() => {
      listenOnCardChange();
    }, [listenOnCardChange]);

    const trackOnClickCanonicalCard = () => {
      const relevantAction = modelCache.get('Action', idAction) as Action;

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'tile',
        actionSubjectId: 'cardTile',
        source: 'memberHomeHighlightSection',
        containers: {
          card: {
            id: relevantAction.getCard().get('id'),
          },
          organization: {
            id: currentOrgId,
          },
        },
        attributes: {
          actionId: relevantAction.id,
        },
      });
    };

    const trackCancelClick = () => {
      const relevantAction = modelCache.get('Action', idAction) as Action;

      const cardId = relevantAction.getCard().get('id');
      const actionId = relevantAction.id;

      Analytics.sendClickedLinkEvent({
        linkName: 'cancelReplyLink',
        source: 'memberHomeHighlightSection',
        containers: {
          organization: {
            id: currentOrgId,
          },
          card: {
            id: cardId,
          },
        },
        attributes: {
          actionId: actionId,
        },
      });
    };

    const onCancelClick = () => {
      trackCancelClick();
      return setState({ isReplying: false });
    };

    const onChangeReplyMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
      Util.preventDefault(e);
      return setState({ replyMessage: e.target.value });
    };

    const onReplyClick = () => {
      const relevantAction = modelCache.get('Action', idAction) as Action;

      const cardId = relevantAction.getCard().get('id');
      const actionId = relevantAction.id;

      Analytics.sendClickedButtonEvent({
        buttonName: 'replyButton',
        source: 'memberHomeHighlightSection',
        containers: {
          card: {
            id: cardId,
          },
          organization: {
            id: currentOrgId,
          },
        },
        attributes: {
          actionId: actionId,
        },
      });

      return setState({
        hasReplied: false,
        replyAction: null,
        replyFailedStatusCode: null,
        hasClickedReply: true,
      });
    };

    interface CommentResponse {
      data: {
        card: { id: string };
        list: { id: string };
        board: { id: string };
      };
    }

    const trackSaveClick = () => {
      const relevantAction = modelCache.get('Action', idAction) as Action;

      const cardId = relevantAction.getCard().get('id');
      const actionId = relevantAction.id;

      Analytics.sendClickedLinkEvent({
        linkName: 'saveReplyLink',
        source: 'memberHomeHighlightSection',
        containers: {
          card: {
            id: cardId,
          },
          organization: {
            id: currentOrgId,
          },
        },
        attributes: {
          actionId: actionId,
        },
      });
    };

    const onSaveClick = () => {
      const traceId = Analytics.startTask({
        taskName: 'create-comment',
        source: 'memberHomeScreen',
      });
      const relevantAction = modelCache.get('Action', idAction) as Action;

      trackSaveClick();

      setState({ isWaitingForNetworkResponse: true });
      if (replyActionPromise !== null) {
        replyActionPromise.cancel();
      }
      replyActionPromise = relevantAction.getCard().addComment(
        state.replyMessage as string,
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
                source: 'memberHomeScreen',
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
      );

      if (!replyActionPromise) {
        return;
      }

      return replyActionPromise
        .then((newAction) => {
          return setState({
            replyAction: newAction,
            replyMessage: null,
            hasReplied: true,
            isReplying: false,
            isWaitingForNetworkResponse: false,
          });
        })
        .catch((error) => {
          return setState({
            hasReplied: false,
            isReplying: true,
            isWaitingForNetworkResponse: false,
            replyFailedStatusCode: error.status || true,
          });
        });
    };

    const onDismissClickHandler = () => {
      return onDismissClick(idAction);
    };

    const trackOverflowMenuOpens = (cardId: string) => {
      Analytics.sendScreenEvent({
        name: 'cardActionsInlineDialogScreen',
        containers: {
          card: {
            id: cardId,
          },
        },
      });
    };

    const actionDisplay = action.get('display');
    const isActionMemberCreatorDeleted =
      actionDisplay?.entities?.memberCreator?.translationKey ===
      'action_deleted_account';

    return (
      <BoardAndDetailContainer width={420}>
        <div
          // eslint-disable-next-line react/jsx-no-bind
          onClick={trackOnClickCanonicalCard}
          role="button"
        >
          <CanonicalCard
            board={board}
            boardClassName="canonical-stretch"
            canRemove={false}
            card={card}
            cardClassName="canonical-stretch"
            labels={card.getLabels().sort(Label.compare)}
            list={card.getList()}
            members={card.memberList.models}
            numNotifications={0}
            organization={organization}
            lightBackground={true}
          />
        </div>
        <div>
          <CanonicalDetail
            actionMemberCreator={commentMemberCreator}
            board={board}
            canReply={canReply}
            cardId={card.get('id')}
            collapseComment={action.isCommentLike()}
            commentText={
              TFM.comments.format(action.get('data').text, _tfmFormatOpts)
                .output
            }
            currentOrgId={currentOrgId}
            date={action.get('date')}
            hasReplied={state.hasReplied}
            idAction={idAction}
            isActionMemberCreatorDeleted={isActionMemberCreatorDeleted}
            isEdited={!!action.get('data').dateLastEdited}
            isReplying={state.isReplying}
            isWaitingForNetworkResponse={state.isWaitingForNetworkResponse}
            replyFailedStatusCode={state.replyFailedStatusCode}
            memberCreator={memberCreator}
            overflowMenuItems={getOverflowItems(
              card,
              HIGHLIGHT_TYPE,
              modelCache,
            )}
            // eslint-disable-next-line react/jsx-no-bind
            onCancelClick={onCancelClick}
            // eslint-disable-next-line react/jsx-no-bind
            onChangeReplyMessage={onChangeReplyMessage}
            // eslint-disable-next-line react/jsx-no-bind
            onReplyClick={onReplyClick}
            // eslint-disable-next-line react/jsx-no-bind
            onSaveClick={onSaveClick}
            reactionList={reactionList}
            replyAction={state.replyAction}
            replyMessage={state.replyMessage}
            // eslint-disable-next-line react/jsx-no-bind
            onDismissClick={onDismissClickHandler}
            // eslint-disable-next-line react/jsx-no-bind
            setFocusedCard={() => setFocusedCard(card)}
            // eslint-disable-next-line react/jsx-no-bind
            trackOverflowMenuOpens={trackOverflowMenuOpens}
          />
        </div>
      </BoardAndDetailContainer>
    );
  },
);

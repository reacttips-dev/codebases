import React from 'react';
import $ from 'jquery';
import memoizeOne from 'memoize-one';
import BluebirdPromise from 'bluebird';
import { difference, isEqual } from 'underscore';

import { Apdex, Analytics } from '@trello/atlassian-analytics';
import { UnsplashTracker } from '@trello/unsplash';

import { Card } from 'app/scripts/models/card';
import { Board } from 'app/scripts/models/board';
import { List } from 'app/scripts/models/list';
import Alerts from 'app/scripts/views/lib/alerts';
import { ApiError } from 'app/scripts/network/api-error';
import { ApiPromise } from 'app/scripts/network/api-promise';
import { Auth } from 'app/scripts/db/auth';
import { Controller } from 'app/scripts/controller';
import { Dates } from 'app/scripts/lib/dates';
import { Highlight } from 'app/scripts/views/home/highlight';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { NewUserOrientationCard } from 'app/scripts/views/home/new-user-orientation-card';
import { UndoDismissSnackbar } from 'app/scripts/views/home/undo-dismiss-snackbar';
import { UpNext } from 'app/scripts/views/home/up-next';
import { Util } from 'app/scripts/lib/util';
import { startDecayingInterval } from 'app/scripts/lib/util/decaying-interval';
import { ContentSkeleton } from 'app/scripts/views/home/presentational/content-skeleton';

import { getScrollParent } from 'app/src/getScrollParent';
import { ReactionList } from 'app/scripts/models/collections/reaction-list';
import { LazyActionableTaskView } from 'app/src/components/ActionableTaskView';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ModelCache } from 'app/scripts/db/model-cache';
import { forTemplate } from '@trello/i18n';

import { FixedSectionHeaderButton } from './presentational/section-header';
import { HighlightSection } from './presentational/highlight-section';
import { OrientationCard } from './presentational/orientation-card';
import { UpNextModel, UpNextSection } from './presentational/up-next-section';

// Need to import this like this because of the way it's exported
const { Action } = require('app/scripts/models/action');

const format = forTemplate('home');
const MAX_PAGE_RESULTS = 20;

interface HomeMainContentContainerProps {
  modelCache: typeof ModelCache;
  setFocusedCard: () => object;
  orgname: string;
}

interface HomeMainContentContainerState {
  fixedButtons: { highlights?: boolean; upNext?: boolean };
  idActions: string[];
  loadingInitial: boolean;
  loadingMore: boolean;
  moreHighlightsAvailable: boolean;
  mostRecentDismissedUpNext: UpNextModel | null;
  newUpNextCards?: UpNextModel[];
  numUpNextCardsVisible: number;
  shouldShowUndoDismiss: boolean;
  unreadIdActions: string[];
  upNextCards: UpNextModel[];
  waitingForBoardsData: boolean;
}

export class HomeMainContentContainer extends React.Component<
  HomeMainContentContainerProps,
  HomeMainContentContainerState
> {
  dismissTimeout: NodeJS.Timeout | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unresolvedPromises: Set<BluebirdPromise<any>>;
  upNextOptimisticallyUpdated: boolean;
  reactionListGroup: { [key: string]: typeof ReactionList };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelUpNextDecayingInterval: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelHighlightsDecayingInterval: any;
  ref: {
    upNext?: HTMLDivElement | null;
    highlights?: HTMLDivElement | null;
  };

  constructor(props: HomeMainContentContainerProps) {
    super(props);

    this.dismissTimeout = null;
    this.unresolvedPromises = new Set();
    this.upNextOptimisticallyUpdated = false;
    this.reactionListGroup = {};
    this.cancelUpNextDecayingInterval = null;
    this.cancelHighlightsDecayingInterval = null;
    this.ref = {};

    this.state = {
      fixedButtons: {},
      idActions: [],
      loadingInitial: true,
      loadingMore: false,
      moreHighlightsAvailable: false,
      mostRecentDismissedUpNext: null,
      newUpNextCards: [],
      numUpNextCardsVisible: 1,
      shouldShowUndoDismiss: false,
      unreadIdActions: [],
      upNextCards: [],
      waitingForBoardsData: true,
    };

    // For some reason making these arrow functions doesn't accomplish this
    // Leaving all of these here to avoid any issues
    this.cancelOnUnmount = this.cancelOnUnmount.bind(this);
    this.onHomeTab = this.onHomeTab.bind(this);
    this.isFirstBoard = this.isFirstBoard.bind(this);
    this.showNewUserCard = this.showNewUserCard.bind(this);
    this.newUserCanDismiss = this.newUserCanDismiss.bind(this);
    this.renderUpNext = this.renderUpNext.bind(this);
    this.updateUpNextCards = this.updateUpNextCards.bind(this);
    this.fetchUpNextCards = this.fetchUpNextCards.bind(this);
    this.startPollingForUpNextCards = this.startPollingForUpNextCards.bind(
      this,
    );
    this.onShowMoreUpNextClick = this.onShowMoreUpNextClick.bind(this);
    this.showNewUpNextItems = this.showNewUpNextItems.bind(this);
    this.optimisticallyDismissCard = this.optimisticallyDismissCard.bind(this);
    this.dismissUpNextOrientationCard = this.dismissUpNextOrientationCard.bind(
      this,
    );
    this.dismissUpNextCard = this.dismissUpNextCard.bind(this);
    this.undoDismissUpNext = this.undoDismissUpNext.bind(this);
    this.closeUndoDismissUpNext = this.closeUndoDismissUpNext.bind(this);
    this.fetchHighlights = this.fetchHighlights.bind(this);
    this.mostRecentIdAction = this.mostRecentIdAction.bind(this);
    this.showUnreadActionsButton = this.showUnreadActionsButton.bind(this);
    this.pollHighlights = this.pollHighlights.bind(this);
    this.startPollingforHighlights = this.startPollingforHighlights.bind(this);
    this.showUnreadHighlights = this.showUnreadHighlights.bind(this);
    this.loadMoreHighlights = this.loadMoreHighlights.bind(this);
    this.dismissHighlightsOrientationCard = this.dismissHighlightsOrientationCard.bind(
      this,
    );
    this.dismissHighlightsCard = this.dismissHighlightsCard.bind(this);
    this.dismissNewUser = this.dismissNewUser.bind(this);
    this.setHighlightsFixedButton = this.setHighlightsFixedButton.bind(this);
    this.setUpNextFixedButton = this.setUpNextFixedButton.bind(this);
    this.setHighlightsWrapperRef = this.setHighlightsWrapperRef.bind(this);
    this.setUpNextWrapperRef = this.setUpNextWrapperRef.bind(this);
    this.onClickFixedButton = this.onClickFixedButton.bind(this);
    this.createBoard = this.createBoard.bind(this);
    this.renderHighlight = this.renderHighlight.bind(this);
  }

  componentDidMount() {
    return this.cancelOnUnmount(
      new BluebirdPromise(function (resolve) {
        return ModelLoader.waitFor('boardsData', resolve);
      }),
    )
      .then(() => {
        this.setState({ waitingForBoardsData: false });

        let upNextCardsRequest = BluebirdPromise.resolve();
        let highlightsRequest: null | BluebirdPromise<string[]> = null;

        if (!this.showNewUserCard() && this.onHomeTab()) {
          upNextCardsRequest = this.fetchUpNextCards();

          upNextCardsRequest
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((upNextCards: any) => {
              this.setState({
                upNextCards,
              });
              return this.startPollingForUpNextCards();
            });
        }

        if (!this.showNewUserCard()) {
          highlightsRequest = this.fetchHighlights({});

          highlightsRequest?.then((idActions) => {
            this.setState({
              idActions,
            });
            return this.startPollingforHighlights();
          });
        }

        BluebirdPromise.all([upNextCardsRequest, highlightsRequest])
          .then(() => {
            // Deferring here to allow React to render before measuring
            setTimeout(function () {
              Apdex.stop({ task: 'memberHome' });
            }, 0);

            return this.setState({
              loadingInitial: false,
            });
          })
          .catch((e) => {
            if (e instanceof BluebirdPromise.CancellationError) {
              // Cancelled due to component being unmounted
              return;
            }
            return this.setState({
              loadingInitial: false,
            });
          });
      })
      .catch(BluebirdPromise.CancellationError, function () {});
  }

  componentWillUnmount() {
    if (this.cancelUpNextDecayingInterval) {
      this.cancelUpNextDecayingInterval();
    }

    if (this.cancelHighlightsDecayingInterval) {
      this.cancelHighlightsDecayingInterval();
    }

    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }

    return this.unresolvedPromises.forEach((promise) => promise.cancel());
  }

  componentDidUpdate() {
    return this.setDateFirstSawHighlights();
  }

  isUpNextCardsFromOtherUsers = memoizeOne(function (
    newUpNextCards,
    currentUpNextCards,
  ) {
    const { modelCache } = this.props;

    const newUpNexts = this.getVisibleNewUpNexts(newUpNextCards);
    const currUpNexts = this.getVisibleUpNexts(currentUpNextCards);

    const ids = (upNexts: UpNextModel[]) => upNexts.map((upNext) => upNext.id);

    // Never show "Show new items" if the new set is empty.
    if (newUpNexts.length === 0) {
      return false;
    }

    // Always show "Show new items" if items were removed.
    if (difference(ids(currUpNexts), ids(newUpNexts)).length > 0) {
      return true;
    }

    // Ignore new items caused by adding yourself to a card.
    const upNextNotFromSelf = function (upNext: UpNextModel) {
      if (upNext.item.type === 'action') {
        const action = modelCache.get('Action', upNext.item.actionId);
        const memberCreator = modelCache.get(
          'Member',
          action?.get('idMemberCreator'),
        );
        return !Auth.isMe(memberCreator);
      }

      return true;
    };

    return !isEqual(
      ids(newUpNexts.filter(upNextNotFromSelf)),
      ids(currUpNexts.filter(upNextNotFromSelf)),
    );
  });

  currentOrg = memoizeOne(function (orgname) {
    const { modelCache } = this.props;

    return modelCache.findOne('Organization', 'name', orgname);
  });

  currentOrgId = memoizeOne(function (orgname) {
    return this.currentOrg(orgname)?.id;
  });

  // Up Next Functions Start
  getVisibleUpNexts = memoizeOne((upNexts: UpNextModel[]) =>
    upNexts.filter((upNext) => !upNext.dismissed),
  );

  getVisibleNewUpNexts = memoizeOne((newUpNexts: UpNextModel[]) =>
    newUpNexts.filter((upNext) => !upNext.dismissed),
  );

  getExistingUserComponent() {
    const {
      idActions,
      loadingInitial,
      loadingMore,
      moreHighlightsAvailable,
      newUpNextCards,
      numUpNextCardsVisible,
      upNextCards,
    } = this.state;

    if (loadingInitial) {
      return <ContentSkeleton />;
    }

    if (!this.getVisibleUpNexts(upNextCards).length && !idActions.length) {
      return (
        <OrientationCard
          key="orientation"
          titleKey="orientation-no-content-title"
          textKey="orientation-no-content-text"
          backgroundName="no-content"
          isBackgroundTop
        />
      );
    }

    return (
      <>
        {this.onHomeTab() && (
          <div
            className="home-main-content-item"
            // eslint-disable-next-line react/jsx-no-bind
            ref={(el) => {
              Dates.update(el);
              return this.setUpNextWrapperRef(el);
            }}
          >
            <UpNextSection
              key="up-next"
              dismissUpNextOrientationCard={this.dismissUpNextOrientationCard}
              numUpNextCardsVisible={numUpNextCardsVisible}
              onShowMoreUpNextClick={this.onShowMoreUpNextClick}
              renderUpNext={this.renderUpNext}
              setFixedButton={this.setUpNextFixedButton}
              shouldShowUpNextOrientationCard={
                !Auth.me().isDismissed('homeUpNextOrientationCard')
              }
              showNewUpNextItems={this.showNewUpNextItems}
              showUnreadUpNextActionsButton={this.isUpNextCardsFromOtherUsers(
                newUpNextCards,
                upNextCards,
              )}
              upNextCards={this.getVisibleUpNexts(upNextCards)}
              optimisticallyDismissCard={this.optimisticallyDismissCard}
            />
          </div>
        )}
        <div
          className="home-main-content-item"
          ref={this.setHighlightsWrapperRef}
        >
          <HighlightSection
            key="highlights"
            myId={Auth.myId()}
            idActions={idActions}
            showUnreadActionsButton={this.showUnreadActionsButton()}
            loadingMore={loadingMore}
            moreHighlightsAvailable={moreHighlightsAvailable}
            loadMoreHighlights={this.loadMoreHighlights}
            showUnreadHighlights={this.showUnreadHighlights}
            dismissHighlightsCard={this.dismissHighlightsCard}
            dismissHighlightsOrientationCard={
              this.dismissHighlightsOrientationCard
            }
            shouldShowHighlightsOrientationCard={
              !Auth.me().isDismissed('homeHighlightsOrientationCard')
            }
            dismissFeedbackOrientationCard={this.dismissFeedbackOrientationCard}
            shouldShowFeedbackOrientationCard={
              false && Auth.me().shouldShowFeedbackCard() // only disable for now, leave for future use
            }
            idOrganization={this.currentOrgId(this.props.orgname)}
            renderHighlight={this.renderHighlight}
            setFixedButton={this.setHighlightsFixedButton}
          />
        </div>
      </>
    );
  }

  render() {
    const { orgname, modelCache } = this.props;
    const { mostRecentDismissedUpNext, shouldShowUndoDismiss } = this.state;

    return (
      <div className="home-main-content-container">
        <FixedSectionHeaderButton
          shouldShow={this.shouldShowFixedButton()}
          onClick={this.onClickFixedButton}
          iconName="up"
        >
          {format('new-activity')}
        </FixedSectionHeaderButton>
        <UndoDismissSnackbar
          shouldShow={shouldShowUndoDismiss}
          idDismiss={mostRecentDismissedUpNext?.id}
          boardName={modelCache
            .get('Board', mostRecentDismissedUpNext?.boardId)
            ?.get('name')}
          cardUrl={modelCache
            .get('Card', mostRecentDismissedUpNext?.cardId)
            ?.get('url')}
          close={this.closeUndoDismissUpNext}
          undo={this.undoDismissUpNext}
        />
        {this.onHomeTab() && (
          <ComponentWrapper>
            <LazyActionableTaskView />
          </ComponentWrapper>
        )}
        {this.showNewUserCard() && (
          <ComponentWrapper>
            <NewUserOrientationCard
              key="new-user"
              onHomeTab={this.onHomeTab()}
              currentOrg={this.currentOrg(orgname)}
              onCreateBoardClick={this.createBoard}
              onDismissClick={
                this.newUserCanDismiss() ? this.dismissNewUser : undefined
              }
            />
          </ComponentWrapper>
        )}
        {!this.showNewUserCard() && this.getExistingUserComponent()}
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelOnUnmount(promise: any) {
    promise
      .cancellable()
      .then(() => this.unresolvedPromises.delete(promise))
      .catch(BluebirdPromise.CancellationError, function () {});
    this.unresolvedPromises.add(promise);

    return promise;
  }

  onHomeTab() {
    return !this.props.orgname;
  }

  isFirstBoard() {
    const me = Auth.me();
    const ownedBoards: Board[] = me.boardList.models.filter((board: Board) =>
      board.owned(),
    );

    // Only has a welcome boards or no boards at all
    return ownedBoards.filter((board) => !board.isWelcomeBoard()).length === 0;
  }

  showNewUserCard() {
    const { orgname } = this.props;
    const { waitingForBoardsData } = this.state;

    if (waitingForBoardsData) {
      return false;
    }

    const me = Auth.me();

    if (this.onHomeTab()) {
      if (me.isDismissed('homeNewUserCard')) {
        return false;
      }

      return this.isFirstBoard();
    }

    if (this.currentOrgId(orgname)) {
      if (me.isDismissed(`homeNewUserCard_${this.currentOrgId(orgname)}`)) {
        return false;
      }

      const openBoards: Board[] = me.boardList.models.filter((board: Board) =>
        board.isOpen(),
      );
      const openOrgBoards = openBoards.filter(
        (board) => board.getOrganization()?.id === this.currentOrgId(orgname),
      );

      return openOrgBoards.length === 0;
    }
  }

  newUserCanDismiss() {
    return this.showNewUserCard();
  }

  getUpNextById(upNexts: UpNextModel[], upNextId: string) {
    return upNexts.find(({ id }) => id === upNextId);
  }

  unsplashTrackNewUpNext(newIds: string[], upNextCards: UpNextModel[]) {
    const trackingPaths = upNextCards
      .filter((upNext) => {
        return newIds.includes(upNext.id);
      })
      .map((upNext) => {
        const board = this.props.modelCache.get('Board', upNext.boardId);
        return (board as Board).attributes.prefs.backgroundImage;
      });

    return UnsplashTracker.trackOncePerInterval(
      // @ts-expect-error
      trackingPaths.filter((tp) => !!tp),
    );
  }

  renderUpNext(upNextCard: UpNextModel) {
    const { id, cardId, listId, boardId, orgId, item } = upNextCard;

    if (item.type === 'action') {
      if (
        !Object.prototype.hasOwnProperty.call(
          this.reactionListGroup,
          item.actionId,
        )
      ) {
        // @ts-expect-error
        this.reactionListGroup[
          `${item.actionId}`
        ] = new ReactionList().syncCache(
          this.props.modelCache,
          [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (reaction: any) => {
            return reaction.get('idModel') === item.actionId;
          },
        );
      }
    }

    return (
      <UpNext
        dismissUpNextCard={this.dismissUpNextCard}
        optimisticallyDismissCard={this.optimisticallyDismissCard}
        boardId={boardId}
        cardId={cardId}
        item={item}
        key={id}
        listId={listId}
        modelCache={this.props.modelCache}
        orgId={orgId}
        setFocusedCard={this.props.setFocusedCard}
        upNextId={id}
        reactionList={
          item.type === 'action'
            ? this.reactionListGroup[`${item.actionId}`]
            : undefined
        }
        idAction={item.type === 'action' ? item.actionId : undefined}
      />
    );
  }

  updateUpNextCards() {
    return this.fetchUpNextCards()
      .then((upNextCards: UpNextModel[]) => {
        return this.setState((prevState) => {
          const currUpNextIds = this.getVisibleUpNexts(
            prevState.upNextCards,
          ).map((card) => card.id);
          const newUpNextIds: string[] = upNextCards.map((card) => card.id);
          const isNewUpNext: boolean = !isEqual(currUpNextIds, newUpNextIds);

          if (isNewUpNext) {
            this.unsplashTrackNewUpNext(newUpNextIds, upNextCards);

            // collect all "action" ids
            const actionIds = upNextCards
              .filter((upNextCard) => upNextCard.item.type === 'action')
              .map((upNextCard) => upNextCard.item.actionId);
            // prune dismissed reactionLists
            for (const reactionAction of Object.keys(
              this.reactionListGroup || {},
            )) {
              const usedReactionList = actionIds.some(
                (id) => id === reactionAction,
              );
              if (!usedReactionList) {
                delete this.reactionListGroup[`${reactionAction}`];
              }
            }

            return { newUpNextCards: upNextCards };
          }

          return { newUpNextCards: [] };
        });
      })
      .catch(BluebirdPromise.CancellationError, function () {});
  }

  fetchUpNextCards() {
    const { modelCache } = this.props;

    return (
      this.cancelOnUnmount(ModelLoader.loadUpNext())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const upNextCards = response.upNext.map((upNextItem: any) => {
            const item = upNextItem.items[0]; // for initial release there is only 1 item
            item.actionId = modelCache.get('Action', item.data.idAction)?.id;

            const card = modelCache.get('Card', upNextItem.data.idCard) as Card;
            const board = card.getBoard();

            return {
              id: upNextItem.id,
              cardId: card.id,
              listId: card.get('idList'),
              boardId: board.id,
              orgId: board.get('idOrganization'),
              dismissed: false,
              item,
            };
          });

          return upNextCards;
        })
        .catch(ApiError.Server, function (e: Event) {
          console.error(e);
          return [];
        })
        .catch(ApiError.BadRequest, function (e: Event) {
          console.error(e);
          return [];
        })
        .catch((e: Event) => {
          if (e instanceof BluebirdPromise.CancellationError) {
            throw e;
          }

          console.error(e);
          return [];
        })
    );
  }

  startPollingForUpNextCards() {
    this.cancelUpNextDecayingInterval = startDecayingInterval(() => {
      if (this.upNextOptimisticallyUpdated) {
        // Skip one poll result if the user made an API request
        // within the last poll. This prevents stale data from
        // overwriting the client-side optimistic dismissing before
        // the API request finishes.
        this.upNextOptimisticallyUpdated = false;
        return;
      } else {
        return this.updateUpNextCards();
      }
    });
  }

  onShowMoreUpNextClick() {
    Analytics.sendClickedButtonEvent({
      buttonName: 'showMoreButton',
      source: 'memberHomeUpNextSection',
    });

    return this.setState((prevState) => ({
      numUpNextCardsVisible: prevState.numUpNextCardsVisible + 6,
    }));
  }

  showNewUpNextItems(e: React.MouseEvent<HTMLButtonElement>) {
    Util.preventDefault(e);

    const { orgname } = this.props;

    Analytics.sendClickedButtonEvent({
      buttonName: 'showNewItemsButton',
      source: 'memberHomeUpNextSection',
      containers: {
        organization: {
          id: this.currentOrgId(orgname),
        },
      },
    });

    return this.setState((prevState) => ({
      upNextCards: prevState.newUpNextCards || [],
      newUpNextCards: [],
    }));
  }

  optimisticallyDismissCard(
    upNextId: string,
    dismissed?: boolean,
    delay?: boolean,
  ) {
    // optimistically dismiss card with a slight delay
    if (dismissed === undefined) {
      dismissed = true;
    }
    if (delay === undefined) {
      delay = true;
    }

    const dismiss = () => {
      return this.setState(function (prevState) {
        const mapUpNext = function (upNext: UpNextModel) {
          if (upNext.id !== upNextId) {
            return upNext;
          } else {
            return { ...upNext, dismissed };
          }
        };

        const upNextCards = prevState.upNextCards.map(mapUpNext);
        const newUpNextCards = prevState.newUpNextCards?.map(mapUpNext) || [];

        if (upNextCards.length === 0 && newUpNextCards.length > 0) {
          // if it's the last card that we dismissed and there are new cards that we can show let's show the
          return {
            upNextCards: newUpNextCards,
            newUpNextCards: [],
          };
        }

        return {
          upNextCards,
          newUpNextCards,
        };
      });
    };

    if (delay) {
      this.dismissTimeout = setTimeout(dismiss, 250);
    } else {
      dismiss();
    }

    this.upNextOptimisticallyUpdated = true;
  }

  dismissUpNextOrientationCard() {
    Analytics.sendClickedButtonEvent({
      buttonName: 'dismissOrientationCardButton',
      source: 'memberHomeUpNextSection',
    });

    return Auth.me().dismiss('homeUpNextOrientationCard');
  }

  dismissUpNextCard(
    cardId: string,
    upNextId: string,
    trackingPrepositionalObject: string,
  ) {
    Analytics.sendClickedButtonEvent({
      buttonName: 'dismissCardButton',
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

    this.optimisticallyDismissCard(upNextId, true);

    this.setState((prevState) => {
      const mostRecentDismissedUpNext = this.getUpNextById(
        prevState.upNextCards,
        upNextId,
      );

      return {
        mostRecentDismissedUpNext: mostRecentDismissedUpNext || null,
        shouldShowUndoDismiss: true,
      };
    });

    return this.cancelOnUnmount(
      ApiPromise({
        url: `1/members/me/upNext/${upNextId}`,
        type: 'PUT',
        data: {
          dismissed: true,
        },
      }),
    )
      .catch(BluebirdPromise.CancellationError, function () {})
      .done();
  }

  undoDismissUpNext(upNextId: string) {
    const dismissedUpNextCardId = this.getUpNextById(
      this.state.upNextCards,
      upNextId,
    )?.cardId;

    Analytics.sendClickedButtonEvent({
      buttonName: 'undoDismissCardButton',
      source: 'memberHomeUpNextSection',
      containers: {
        card: {
          id: dismissedUpNextCardId,
        },
      },
    });

    this.optimisticallyDismissCard(upNextId, false);

    this.cancelOnUnmount(
      ApiPromise({
        url: `1/members/me/upNext/${upNextId}`,
        type: 'PUT',
        data: {
          dismissed: false,
        },
      }),
    )
      .catch(BluebirdPromise.CancellationError, function () {})
      .done();
  }

  closeUndoDismissUpNext() {
    this.setState({ shouldShowUndoDismiss: false });
  }
  // Up Next Functions End

  // Highlights Functions Start
  fetchHighlights({ before, since }: { before?: string; since?: string }) {
    const { modelCache, orgname } = this.props;

    // If you are a guest on a team then searching for undefined in modelCache
    // will return that team which has a couple fields that were leaked
    // When there is no orgname we want to explicity not get a team so we get
    // all of the users highlights across all of there teams
    const orgId = orgname
      ? modelCache.findOne('Organization', 'name', orgname)?.id
      : null;

    if (orgname && !orgId) {
      // if there is no orgId when there is an orgname it means that you no longer can see that team
      // this fixes an issue when you're deactivated from a team, but the update to the model hasn't
      // flown down and redirected the page, so we make a bad request by fetching highlights for that team
      return new BluebirdPromise(() => []);
    }

    return this.cancelOnUnmount(
      ModelLoader.loadHighlights({ before, since, organization: orgId }),
    )
      .then(
        (response: {
          cards: Card[];
          boards: Board[];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          highlights: any;
          lists: List[];
          organizations: typeof Organization[];
        }) => {
          const trackingPaths: string[] = [];
          const highlightCards = response.highlights.map(
            (action: typeof Action) => {
              const card = response.cards.find(
                (card) => action.data.card.id === card.id,
              );
              if (!card) return undefined;

              const list = response.lists.find(
                // @ts-expect-error
                (list) => list.id === card.idList,
              );
              const board = response.boards.find(
                // @ts-expect-error
                (board) => board.id === card.idBoard,
              );
              const org = response.organizations.find(
                (organization) => organization.id === board?.idOrganization,
              );

              if (board?.organization) {
                board.organization = org;
              }
              // @ts-expect-error
              card.list = list;
              // @ts-expect-error
              card.board = board;
              action.card = card;
              action.list = list;
              action.board = board;

              if (board?.prefs.backgroundImage) {
                trackingPaths.push(board?.prefs.backgroundImage);
              }

              // Side effect: Action gets loaded into modelCache.
              action = new Action(action, { modelCache });

              return action.id;
            },
          );

          UnsplashTracker.trackOncePerInterval(trackingPaths);

          if (!since) {
            this.setState({
              moreHighlightsAvailable:
                highlightCards.length === MAX_PAGE_RESULTS,
            });
          }

          return highlightCards;
        },
      )
      .catch(ApiError.Server, function (e: Event) {
        console.error(e);
        return [];
      })
      .catch(ApiError.BadRequest, function (e: Event) {
        console.error(e);
        return [];
      })
      .catch((e: Event) => {
        if (e instanceof BluebirdPromise.CancellationError) {
          throw e;
        }

        console.error(e);
        return [];
      });
  }

  mostRecentIdAction() {
    const { idActions, unreadIdActions } = this.state;

    const mostRecent = unreadIdActions[0] ? unreadIdActions[0] : idActions[0];

    return mostRecent || '';
  }

  showUnreadActionsButton() {
    const { unreadIdActions } = this.state;
    const { modelCache } = this.props;

    const isActionsFromOtherUsers = unreadIdActions.some((actionId) => {
      const action = modelCache.get('Action', actionId) as typeof Action;
      const memberCreator = modelCache.get(
        'Member',
        action.get('idMemberCreator'),
      );

      return !Auth.isMe(memberCreator);
    });

    return isActionsFromOtherUsers;
  }

  pollHighlights() {
    return this.fetchHighlights({
      since: this.mostRecentIdAction(),
    })
      .then((newIdActions: string[]) => {
        if (newIdActions.length) {
          return this.setState((prevState) => ({
            unreadIdActions: newIdActions.concat(prevState.unreadIdActions),
          }));
        }
      })
      .catch(BluebirdPromise.CancellationError, function () {});
  }

  startPollingforHighlights() {
    this.cancelHighlightsDecayingInterval = startDecayingInterval(
      this.pollHighlights,
    );
  }

  showUnreadHighlights(e: React.MouseEvent<HTMLButtonElement>) {
    Util.preventDefault(e);

    const { orgname } = this.props;

    Analytics.sendClickedButtonEvent({
      buttonName: 'showNewActivityButton',
      source: 'memberHomeHighlightSection',
      containers: {
        organization: {
          id: this.currentOrgId(orgname),
        },
      },
    });

    return this.setState((prevState, props) => ({
      idActions: prevState.unreadIdActions.concat(prevState.idActions),
      unreadIdActions: [],
    }));
  }

  loadMoreHighlights(e: React.MouseEvent<HTMLButtonElement>) {
    Util.preventDefault(e);

    const { orgname } = this.props;

    Analytics.sendClickedButtonEvent({
      buttonName: 'showMoreActivityButton',
      source: 'memberHomeHighlightSection',
      containers: {
        organization: {
          id: this.currentOrgId(orgname),
        },
      },
    });

    this.setState({
      loadingMore: true,
    });

    return this.fetchHighlights({
      before: this.state.idActions[this.state.idActions.length - 1],
    })
      .then((idActions: string[]) => {
        return this.setState((prevState) => ({
          idActions: prevState.idActions.concat(idActions),
          loadingMore: false,
        }));
      })
      .catch((e: Event) => {
        if (e instanceof BluebirdPromise.CancellationError) {
          // Cancelled due to component being unmounted
          return;
        }
        return this.setState({
          loadingMore: false,
        });
      });
  }

  dismissHighlightsOrientationCard() {
    const { orgname } = this.props;

    Analytics.sendClickedButtonEvent({
      buttonName: 'dismissOrientationCardButton',
      source: 'memberHomeHighlightSection',
      containers: {
        organization: {
          id: this.currentOrgId(orgname),
        },
      },
    });

    Auth.me().dismiss('homeHighlightsOrientationCard');
  }

  dismissFeedbackOrientationCard() {
    Auth.me().dismiss('homeFeedbackOrientationCard');
  }

  setDateFirstSawHighlights() {
    const { idActions } = this.state;

    if (idActions.length && !Auth.me().getDateFirstSawHighlights()) {
      Auth.me().setDateFirstSawHighlights();
    }
  }

  dismissHighlightsCard(idAction: string) {
    return this.setState((prevState) => ({
      idActions: prevState.idActions.filter((id) => id !== idAction),
    }));
  }
  // Highlights Functions End

  dismissNewUser() {
    const { orgname } = this.props;

    const dismissKey = this.currentOrgId(orgname)
      ? `homeNewUserCard_${this.currentOrgId(orgname)}`
      : 'homeNewUserCard';

    Auth.me().dismiss(dismissKey);
  }

  setHighlightsFixedButton(shouldShow: boolean) {
    return this.setState(({ fixedButtons }) => ({
      fixedButtons: { ...fixedButtons, highlights: shouldShow },
    }));
  }

  setUpNextFixedButton(shouldShow: boolean) {
    return this.setState(({ fixedButtons }) => ({
      fixedButtons: { ...fixedButtons, upNext: shouldShow },
    }));
  }

  setHighlightsWrapperRef(ref: HTMLDivElement | null) {
    if (!this.ref) {
      this.ref = {};
    }

    this.ref.highlights = ref;
  }

  setUpNextWrapperRef(ref: HTMLDivElement | null) {
    if (!this.ref) {
      this.ref = {};
    }

    this.ref.upNext = ref;
  }

  shouldShowFixedButton() {
    const { fixedButtons } = this.state;

    return fixedButtons.upNext || fixedButtons.highlights;
  }

  onClickFixedButton() {
    const { orgname } = this.props;

    const scrollIntoView = (el: HTMLElement) =>
      $(getScrollParent(el)).animate({
        scrollTop: el.offsetTop - 8,
      });

    if (this.state.fixedButtons.upNext && this.ref.upNext) {
      scrollIntoView(this.ref.upNext);
    } else if (this.state.fixedButtons.highlights && this.ref.highlights) {
      scrollIntoView(this.ref.highlights);
    }

    this.setState({ fixedButtons: {} });

    Analytics.sendClickedButtonEvent({
      buttonName: 'newActivityButton',
      source: 'memberHomeScreen',
      containers: {
        organization: {
          id: this.currentOrgId(orgname),
        },
      },
    });
  }

  createBoard({ name }: { name: string }) {
    // can only create a private personal board
    // so setting idOrganization, prefs_permissionLevel, and prefs_selfJoin to defaults

    const isFirstBoard = this.isFirstBoard();

    // Data that we'll use in the body of the POST to create the board
    const initialData = {
      name,
      idOrganization: '',
    };

    // Data that we're going to send in the create request; not all of the
    // fields will be board attributes
    const requestData = {
      prefs_permissionLevel: 'private',
      prefs_selfJoin: false,
      defaultLists: isFirstBoard,
      ...initialData,
    };

    return Auth.me().boardList.create(initialData, {
      modelCache: this.props.modelCache,
      requestData,
      success: (board: Board) => {
        // this fixes an issue with idBoards not being updated at the time that
        // the board gets rendered and the client thinking the member is not on
        // the board
        const boardId = board.get('id');
        const currentBoards = Auth.me().get('idBoards');

        if (!currentBoards.includes(boardId)) {
          Auth.me().set('idBoards', currentBoards.concat(boardId));
        }

        Analytics.sendClickedButtonEvent({
          buttonName: 'createYourBoardButton',
          source: 'memberHomeScreen',
          containers: {
            board: {
              id: boardId,
            },
          },
        });

        // We have to wait until we get the board id back before we can
        // display the boad
        // @ts-expect-error because of the way controller is setup it doesn't recognize displayBoard
        Controller.displayBoard({
          idBoard: boardId,
          openListComposer: !isFirstBoard,
          openCardComposerInFirstList: isFirstBoard,
        }).done();
      },
      error() {
        return Alerts.flash(
          'could not create board',
          'error',
          'createBoardError',
        );
      },
    });
  }

  renderHighlight(idAction: string) {
    const { orgname, modelCache } = this.props;

    if (
      !Object.prototype.hasOwnProperty.call(this.reactionListGroup, idAction)
    ) {
      // @ts-expect-error
      this.reactionListGroup[`${idAction}`] = new ReactionList().syncCache(
        modelCache,
        [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (reaction: any) => {
          return reaction.get('idModel') === idAction;
        },
      );
    }

    return (
      <Highlight
        currentOrgId={this.currentOrgId(orgname)}
        key={idAction}
        idAction={idAction}
        modelCache={this.props.modelCache}
        setFocusedCard={this.props.setFocusedCard}
        onDismissClick={this.dismissHighlightsCard}
        reactionList={this.reactionListGroup[`${idAction}`]}
      />
    );
  }
}

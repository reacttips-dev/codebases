import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from 'react';
import _ from 'underscore';
import $ from 'jquery';
import { Analytics } from '@trello/atlassian-analytics';
import { useLazyComponent } from '@trello/use-lazy-component';
import { Auth } from 'app/scripts/db/auth';
import { maybeDisplayMemberLimitsError } from 'app/scripts/views/board-menu/member-limits-error';
import { ModelLoader } from 'app/scripts/db/model-loader';
import ModelCacheListener from 'app/scripts/views/internal/model-cache-listener';
// eslint-disable-next-line @trello/no-module-logic
const t = require('app/scripts/views/internal/recup-with-helpers')('home');
import { StarIcon } from '@trello/nachos/icons/star';
import { ClockIcon } from '@trello/nachos/icons/clock';
import { HomeTestIds } from '@trello/test-ids';
import { l } from 'app/scripts/lib/localize';
import { Util } from 'app/scripts/lib/util';
import { RecentBoards } from 'app/scripts/lib/recent-boards';
// eslint-disable-next-line @trello/no-module-logic
const recentBoardsHelper = new RecentBoards();
import { HomeBoardTile } from 'app/scripts/views/home/home-board-tile';
import { HomeBoardDndContainer } from 'app/scripts/views/home/home-board-dnd-container';
import { BoardSection } from './presentational/board';
import { LinkSection } from './presentational/link';
import { ModelCache } from 'app/scripts/db/model-cache';
import { Board } from 'app/scripts/models/board';
import { Member } from 'app/scripts/models/member';
import { preloadCreateBoardData } from 'app/gamma/src/modules/state/ui/create-menu';
import { useDispatch } from 'react-redux';
import {
  useWorkspaceNavigation,
  useWorkspaceNavigationHidden,
} from 'app/src/components/WorkspaceNavigation';
import classNames from 'classnames';

interface HomeRightSidebarContainerProps {
  orgname: string;
  modelCache: typeof ModelCache;
  model: Member;
  modelListener: (
    boardsListIds: string[],
    eventName: string,
    callback: () => void,
  ) => void;
}

interface HomeRightSidebarContainerStateProps {
  starredBoards?: Board[];
  recentBoards?: Board[];
  showAllRecentBoards?: boolean;
  showAllStarredBoards?: boolean;
}

// eslint-disable-next-line @trello/no-module-logic
export const HomeRightSidebarContainer = ModelCacheListener(
  ({
    modelCache,
    orgname,
    model,
    modelListener,
  }: HomeRightSidebarContainerProps) => {
    const defaultNumStarredBoardsVisible = 8;
    const defaultNumRecentBoardsVisible = 4;

    const [state, _setState] = useState({
      starredBoards: [],
      recentBoards: [],
      showAllStarredBoards: false,
      showAllRecentBoards: false,
    } as HomeRightSidebarContainerStateProps);

    const dispatch = useDispatch();

    const setState = (newState: HomeRightSidebarContainerStateProps) => {
      _setState((prevState) => {
        return {
          ...prevState,
          ...newState,
        };
      });
    };

    const [
      {
        expanded: _workspaceNavigationExpanded,
        enabled: _workspaceNavigationEnabled,
      },
    ] = useWorkspaceNavigation();
    const [
      { hidden: _workspaceNavigationHidden },
    ] = useWorkspaceNavigationHidden();
    const workspaceNavigationExpanded =
      _workspaceNavigationEnabled &&
      !_workspaceNavigationHidden &&
      _workspaceNavigationExpanded;

    const fetchUnknownBoardsCallback = useCallback(
      (idBoardsMissing: string[]) => {
        const me = Auth.me();
        const missingRecentBoards = _.chain(idBoardsMissing)
          .map((idBoard) => modelCache.get('Board', idBoard))
          .compact()
          .filter((board: Board) => board.isOpen() && board.isViewableBy(me))
          .value() as Board[];

        _setState((prevState) => ({
          ...prevState,
          recentBoards: prevState.recentBoards?.concat(missingRecentBoards),
        }));
      },
      [modelCache],
    );

    const getBoards = useCallback(() => {
      const callbackWrapper = {
        value: () => {
          const me = Auth.me();

          const starredBoards = _.filter(
            model.boardStarList.getBoards(),
            (board: Board) => board?.isOpen() && board?.isViewableBy(me),
          );
          const recentBoards = recentBoardsHelper.getBoards(
            model,
            fetchUnknownBoardsCallback,
          ) as Board[];

          return setState({
            starredBoards,
            recentBoards,
          });
        },
      };

      return ModelLoader.waitFor('boardsData', () => callbackWrapper.value());
    }, [fetchUnknownBoardsCallback, model]);

    const listenOnBoardListChange = useCallback(() => {
      // @ts-expect-error
      modelListener(model.boardList, 'change:closed', () => {
        return getBoards();
      });
    }, [getBoards, model.boardList, modelListener]);

    useEffect(() => {
      getBoards();
      listenOnBoardListChange();
    }, [getBoards, listenOnBoardListChange]);

    const currentStarBoardList = useRef(model.boardStarList.getBoardIds());

    useEffect(() => {
      const newStarBoardList = model.boardStarList.getBoardIds();
      if (!_.isEqual(currentStarBoardList.current, newStarBoardList)) {
        getBoards();
      }

      currentStarBoardList.current = newStarBoardList;
    }, [getBoards, model.boardStarList]);

    const CreateBoardOverlay = useLazyComponent(
      () =>
        import(
          /* webpackChunkName: "create-board-overlay" */ 'app/gamma/src/components/overlays/create-board-overlay'
        ),

      {
        preload: false,
      },
    );

    const [showCreateBoardOverlay, setShowCreateBoardOverlay] = useState(false);

    const closeCreateBoardOverlay = useCallback(() => {
      setShowCreateBoardOverlay(false);
    }, [setShowCreateBoardOverlay]);

    const openCreateBoardOverlay = useCallback(() => {
      setShowCreateBoardOverlay(true);
    }, [setShowCreateBoardOverlay]);

    const orgId = modelCache.findOne('Organization', 'name', orgname)?.id;

    const orgModel = orgname
      ? modelCache.findOne('Organization', 'name', orgname)
      : undefined;

    const buttonName = orgModel ? 'create a team board' : 'create a board';

    const showBoards = (boardType: string, showAll: boolean) => {
      const buttonName = showAll
        ? 'showMoreBoardsButton'
        : 'showFewerBoardsButton';

      if (boardType === 'starred') {
        setState({ showAllStarredBoards: showAll });
        Analytics.sendClickedButtonEvent({
          buttonName: buttonName,
          source: 'memberHomeStarredBoardsSection',
          containers: {
            organization: {
              id: orgId,
            },
          },
        });
      } else if (boardType === 'recent') {
        setState({ showAllRecentBoards: showAll });
        Analytics.sendClickedButtonEvent({
          buttonName: buttonName,
          source: 'memberHomeRecentBoardsSection',
          containers: {
            organization: {
              id: orgId,
            },
          },
        });
      }
    };

    const renderBoardTile = (
      boardId: string,
      boardsType: string,
      isDraggable: boolean,
      organizationId: string,
    ) => {
      return (
        <HomeBoardTile
          key={boardId}
          modelCache={modelCache}
          boardId={boardId}
          boardsType={boardsType}
          isDraggable={isDraggable}
          orgId={organizationId}
        />
      );
    };

    const addBoard = (e: React.MouseEvent) => {
      Util.preventDefault(e);

      if (maybeDisplayMemberLimitsError($(e.target), null, Auth.me())) {
        return;
      }

      dispatch(preloadCreateBoardData());
      openCreateBoardOverlay();

      Analytics.sendClickedButtonEvent({
        buttonName: 'createBoardButton',
        source: 'memberHomeScreen',
        containers: {
          organization: {
            id: orgModel?.id,
          },
        },
      });
    };

    return (
      <>
        <div
          className={classNames(
            'home-right-sidebar-container',
            workspaceNavigationExpanded &&
              'home-right-sidebar-container--workspace-nav-expanded',
          )}
        >
          {!!state?.starredBoards?.length && (
            <HomeBoardDndContainer
              boardIds={state.starredBoards.map((starredBoard) =>
                starredBoard.get('id'),
              )}
              boardsType={'starred'}
              isDraggable={true}
              numBoardsVisible={defaultNumStarredBoardsVisible}
              // eslint-disable-next-line react/jsx-no-bind
              onShowFewerClick={() => showBoards('starred', false)}
              // eslint-disable-next-line react/jsx-no-bind
              onShowMoreClick={() => showBoards('starred', true)}
              orgId={orgId}
              // eslint-disable-next-line react/jsx-no-bind
              renderBoardTile={renderBoardTile}
              sectionHeaderTitle={l('home board section title.starred')}
              sectionHeaderIcon={<StarIcon />}
              showAll={state.showAllStarredBoards!}
              testId={HomeTestIds.StarredBoardsContainer}
            />
          )}

          {!!state?.recentBoards?.length && (
            <BoardSection
              boardIds={state.recentBoards.map((recentBoard) =>
                recentBoard.get('id'),
              )}
              boardsType={'recent'}
              numBoardsVisible={
                state.starredBoards && state.starredBoards.length < 4
                  ? 8
                  : defaultNumRecentBoardsVisible
              }
              orgId={orgId}
              // eslint-disable-next-line react/jsx-no-bind
              onShowFewerClick={() => showBoards('recent', false)}
              // eslint-disable-next-line react/jsx-no-bind
              onShowMoreClick={() => showBoards('recent', true)}
              // eslint-disable-next-line react/jsx-no-bind
              renderBoardTile={renderBoardTile}
              sectionHeaderTitle={l('home board section title.recent')}
              sectionHeaderIcon={<ClockIcon />}
              showAll={state.showAllRecentBoards!}
              testId={HomeTestIds.RecentlyViewedBoardsContainer}
              isDraggable={false}
            />
          )}

          <LinkSection
            sectionHeaderTitle={l('home board section title.links')}
            links={[
              {
                iconName: 'add',
                isButton: true,
                onClick: addBoard,
                text: orgname
                  ? t.l('home-create-team-board')
                  : t.l('home-create-board'),
              },
            ]}
          />
        </div>
        {showCreateBoardOverlay && (
          <Suspense fallback={null}>
            <CreateBoardOverlay
              onClose={closeCreateBoardOverlay}
              trackingOpts={{
                method: `by clicking ${buttonName} button in right sidebar`,
              }}
            />
          </Suspense>
        )}
      </>
    );
  },
);

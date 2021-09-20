/* eslint-disable import/no-default-export */
import classnames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import _ from 'underscore';
import { ActionSubjectIdType } from '@trello/atlassian-analytics/src/constants/ActionSubjectId';
import { useSeesVersionedVariation } from '@trello/feature-flag-client';
import {
  BannerProps,
  TeamBoardsLinkBanner,
} from 'app/scripts/views/board-list/board-list-team-board-link-component';

import { useSharedState } from '@trello/shared-state';
import { sidebarState } from 'app/gamma/src/util/application-storage/sidebar';
import { showLessActiveBoards } from 'app/gamma/src/modules/state/ui/boards-menu';
import {
  BoardStarUpdate,
  updateBoardStarPosition,
} from 'app/gamma/src/modules/state/models/board-stars';
import { MemberContext, MemberInfo } from 'app/gamma/src/modules/context';
import {
  BoardsMenuCategoryModel,
  BoardsMenuCategoryType,
} from 'app/gamma/src/types/models';
import CategoryContent from './category-content';
import { TableIcon } from '@trello/nachos/icons/table';
import styles from './boards-menu.less';

import { Analytics } from '@trello/atlassian-analytics';
import {
  canViewTeamTablePage,
  getViewsUpsellFlag,
} from 'app/src/components/ViewsGenerics';
import { StarIcon } from '@trello/nachos/icons/star';
import { ClockIcon } from '@trello/nachos/icons/clock';
import { BoardIcon } from '@trello/nachos/icons/board';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
const icons = {
  [BoardsMenuCategoryType.Starred]: <StarIcon />,
  [BoardsMenuCategoryType.Recent]: <ClockIcon />,
  [BoardsMenuCategoryType.Personal]: <BoardIcon />,
  [BoardsMenuCategoryType.Team]: <OrganizationIcon />,
};

import { forTemplate } from '@trello/i18n';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { BoardsMenuButton } from './boards-menu-button';
import { BoardsMenuVisibilityState } from 'app/src/components/BoardsMenuVisibility';
import { RemoveIcon } from '@trello/nachos/icons/remove';
import { AddIcon } from '@trello/nachos/icons/add';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
const format = forTemplate('boards_sidebar_section');
const formatBoardsList = forTemplate('board_list');

interface OwnProps {
  categories: BoardsMenuCategoryModel[];
  hidden: boolean;
  boardsMenuVisibility: BoardsMenuVisibilityState;
  setBoardsMenuVisibility: (s: BoardsMenuVisibilityState) => void;
}

interface DispatchProps {
  includeLessActiveBoards: (
    idTeam: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;

  reorderBoards: (data: BoardStarUpdate) => void;
}

interface AllProps extends OwnProps, DispatchProps {}

interface TeamBoardBannerWrapperProps extends Pick<BannerProps, 'children'> {
  category: BoardsMenuCategoryModel;
  isBoardsMenuPinned: boolean;
  closeBoardsMenu: () => void;
}

const TeamBoardsBannerWrapper = ({
  category,
  isBoardsMenuPinned,
  closeBoardsMenu,
  children,
}: TeamBoardBannerWrapperProps) =>
  category.type === BoardsMenuCategoryType.Team && category.teamId ? (
    <TeamBoardsLinkBanner
      teamName={category.category}
      teamBoardsLink={`/${category.teamShortName}/home`}
      orgId={category.teamId}
      inBoardsMenu
      onBannerLinkClick={!isBoardsMenuPinned ? closeBoardsMenu : _.noop}
      emptyStateBanner={!category.boards.length}
    >
      {children}
    </TeamBoardsLinkBanner>
  ) : (
    <React.Fragment>
      {children({ shouldShowBanner: false, banner: null })}
    </React.Fragment>
  );

interface WorkspaceViewLinkProps {
  url: string;
  idOrg: string;
  isFreeTeam: boolean;
  hidden: boolean;
  analyticsLinkName: ActionSubjectIdType;
  linkName: string;
}

export const WorkspaceViewLink: React.FunctionComponent<WorkspaceViewLinkProps> = ({
  url,
  idOrg,
  isFreeTeam,
  hidden,
  analyticsLinkName,
  linkName,
}) => {
  const onClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: analyticsLinkName,
      source: 'boardsMenuInlineDialog',
      containers: {
        organization: {
          id: idOrg,
        },
      },
      attributes: {
        isFreeTeam: isFreeTeam,
      },
    });
  }, [analyticsLinkName, idOrg, isFreeTeam]);

  return (
    <div className={styles.boardTile}>
      <RouterLink href={url} className={styles.boardLink} onClick={onClick}>
        <div className={styles.boardThumbnail}>
          <div className={styles.tableIcon}>
            <TableIcon size="small" />
          </div>
        </div>
        <div className={styles.boardDescription}>
          <div className={styles.boardName}>{linkName}</div>
        </div>
      </RouterLink>
    </div>
  );
};

interface AvatarProps {
  readonly avatarURL?: string | null;
  readonly icon?: JSX.Element;
}

const TeamAvatar = ({ avatarURL, icon }: AvatarProps) => {
  if (avatarURL) {
    return (
      <span
        className={styles.avatar}
        style={{ backgroundImage: `url(${avatarURL})` }}
      />
    );
  } else if (icon) {
    return React.cloneElement(icon, {
      size: 'small',
      color: 'quiet',
      dangerous_className: styles.icon,
    });
  }

  return null;
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    includeLessActiveBoards(idTeam, e) {
      // The boards menu container registers document-level click handlers, so
      // we need to mute the native event too to make sure this doesn't bubble
      // there.
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
      dispatch(showLessActiveBoards(idTeam));
    },

    reorderBoards(data) {
      dispatch(updateBoardStarPosition(data));
    },
  };
};

const BoardList: React.FunctionComponent<AllProps> = ({
  categories,
  includeLessActiveBoards,
  reorderBoards,
  hidden,
  boardsMenuVisibility,
  setBoardsMenuVisibility,
}) => {
  useEffect(() => {
    //Sending analytics exposure events
    getViewsUpsellFlag('remarkable.org-table-view-free-team-upsell', false);
  }, []);

  const [state, setState] = useSharedState(sidebarState);
  const defaultViewsFlagEnabled = useSeesVersionedVariation(
    'remarkable.default-views',
    'alpha',
  );

  return (
    <MemberContext.Consumer>
      {(memberInfo: MemberInfo) => {
        return (
          <div className={styles.boards} hidden={hidden}>
            {categories.map((categoryModel) => (
              <TeamBoardsBannerWrapper
                key={categoryModel.id}
                category={categoryModel}
                isBoardsMenuPinned={
                  boardsMenuVisibility === BoardsMenuVisibilityState.PINNED
                }
                // eslint-disable-next-line react/jsx-no-bind
                closeBoardsMenu={() => {
                  setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
                }}
              >
                {({
                  shouldShowBanner: shouldShowTeamBanner,
                  banner: teamBanner,
                }) => {
                  const {
                    boards,
                    category,
                    type,
                    id,
                    numLessActiveBoards = 0,
                    logos,
                    hasViewsFeature,
                    isPremiumTeam,
                    isStandardTeam,
                    url,
                  } = categoryModel;

                  const isStarredType = type === BoardsMenuCategoryType.Starred;
                  const hasBoards = !!boards.length;

                  if (!isStarredType && !hasBoards && !shouldShowTeamBanner) {
                    return null;
                  }

                  const isTeam = type === BoardsMenuCategoryType.Team;
                  const shouldSeeDefaultViews =
                    defaultViewsFlagEnabled && isTeam && hasViewsFeature && url;
                  const headerClass = isTeam
                    ? classnames(styles.collapsibleHeader, styles.teamHeader)
                    : styles.collapsibleHeader;
                  const avatarURL = isTeam && !!logos ? logos['30'] : null;
                  const titleClass = classnames(
                    isTeam && styles.teamName,
                    avatarURL && styles.hasAvatar,
                  );
                  const idTeam = isTeam
                    ? id.replace(`${BoardsMenuCategoryType.Team}-`, '')
                    : id;

                  const onDragEnd = (result: DropResult) => {
                    const { draggableId, source, destination } = result;
                    if (
                      // they didn't drop it on a droppable
                      !destination ||
                      // they dropped it in the same position
                      (destination.droppableId === source.droppableId &&
                        destination.index === source.index)
                    ) {
                      return;
                    }

                    if (memberInfo.id) {
                      reorderBoards({
                        idBoard: draggableId,
                        idMember: memberInfo.id,
                        position: destination.index,
                      });
                    }
                  };

                  const open = !state.collapsedDrawerSections?.includes(id);

                  const urlClicked = () => {
                    Analytics.sendClickedLinkEvent({
                      linkName: 'orgPageLink',
                      source: 'boardsMenuInlineDialog',
                    });
                  };

                  const toggleCollapsibleSection = () => {
                    Analytics.sendClickedButtonEvent({
                      buttonName: 'toggleBoardsListButton',
                      source: 'boardsMenuInlineDialog',
                      attributes: {
                        action: open ? 'closed' : 'opened',
                      },
                      containers: {
                        organization: {
                          id: idTeam,
                        },
                      },
                    });

                    if (!open) {
                      setState({
                        collapsedDrawerSections: state.collapsedDrawerSections?.filter(
                          (collapsedDrawer) => collapsedDrawer !== id,
                        ),
                      });
                    } else {
                      setState({
                        collapsedDrawerSections: [
                          ...(state.collapsedDrawerSections || []),
                          id,
                        ],
                      });
                    }
                    // if (onToggleClick) {
                    //   onToggleClick();
                    // }
                  };

                  const premiumIcon = !!isPremiumTeam && (
                    <EnterpriseIcon
                      size="small"
                      color="quiet"
                      dangerous_className={classnames(
                        styles.icon,
                        styles.premiumIcon,
                      )}
                    />
                  );

                  const titleContents = (
                    <span className={styles.titleWrapper}>
                      <TeamAvatar avatarURL={avatarURL} icon={icons[type]} />
                      <span className={classnames(styles.title, titleClass)}>
                        {category}
                      </span>
                      {premiumIcon}
                    </span>
                  );

                  return (
                    // eslint-disable-next-line react/jsx-no-bind
                    <DragDropContext key={id} onDragEnd={onDragEnd}>
                      {/*<Collapsible*/}
                      {/*  id={idTeam}*/}
                      {/*>*/}
                      <div
                        className={classnames(styles.collapsible)}
                        key={`category-${id}`}
                      >
                        <div className={classnames(styles.header, headerClass)}>
                          {url ? (
                            <RouterLink
                              // eslint-disable-next-line react/jsx-no-bind
                              onClick={urlClicked}
                              href={url}
                              className={styles.headerLink}
                            >
                              {titleContents}
                            </RouterLink>
                          ) : (
                            <span
                              className={classnames(styles.title, titleClass)}
                            >
                              {titleContents}
                            </span>
                          )}
                          <button
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={toggleCollapsibleSection}
                            className={classnames(
                              {
                                [styles.toggleOpen]: open,
                              },
                              [styles.toggle, styles.collapsibleToggle],
                            )}
                            tabIndex={0}
                            aria-label={format('collapse')}
                          >
                            {/* here we handle swapping the components instead of a conditional render, otherwise the boards menu will close because it doesn't think the icon is contained within the boards menu anymore */}
                            <RemoveIcon
                              size="small"
                              color="quiet"
                              dangerous_className={styles.toggleIcon}
                            />
                            <AddIcon
                              size="small"
                              color="quiet"
                              dangerous_className={styles.toggleIcon}
                            />
                          </button>
                        </div>
                        <div
                          className={classnames({
                            [styles.open]: open,
                            [styles.closed]: !open,
                          })}
                        >
                          {isStarredType && !hasBoards && (
                            <div className={styles.starredBoardsEmptyState}>
                              {format('star-your-most-important-boards')}
                            </div>
                          )}
                          {shouldShowTeamBanner && (
                            <div className={styles.joinTeamBoardsBanner}>
                              {teamBanner}
                            </div>
                          )}
                          {shouldSeeDefaultViews && (
                            <WorkspaceViewLink
                              url={`${url}/views/my-work`}
                              idOrg={idTeam}
                              linkName={format('my-work-link')}
                              isFreeTeam={!isPremiumTeam}
                              analyticsLinkName={'organizationMyWorkViewLink'}
                              hidden={
                                boardsMenuVisibility ===
                                BoardsMenuVisibilityState.CLOSED
                              }
                            />
                          )}
                          {isTeam &&
                            canViewTeamTablePage(
                              hasViewsFeature,
                              isPremiumTeam && !isStandardTeam,
                            ) &&
                            url &&
                            (defaultViewsFlagEnabled ? (
                              <WorkspaceViewLink
                                url={`${url}/views/table`}
                                idOrg={idTeam}
                                linkName={format('custom-view-link')}
                                isFreeTeam={!isPremiumTeam}
                                analyticsLinkName={'organizationCustomViewLink'}
                                hidden={
                                  boardsMenuVisibility ===
                                  BoardsMenuVisibilityState.CLOSED
                                }
                              />
                            ) : (
                              <WorkspaceViewLink
                                url={`${url}/tables`}
                                idOrg={idTeam}
                                linkName={format('team-table-link')}
                                isFreeTeam={!isPremiumTeam}
                                analyticsLinkName={'teamTableLink'}
                                hidden={
                                  boardsMenuVisibility ===
                                  BoardsMenuVisibilityState.CLOSED
                                }
                              />
                            ))}

                          <CategoryContent {...categoryModel} />
                          {numLessActiveBoards > 0 && (
                            <div>
                              <BoardsMenuButton
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => {
                                  Analytics.sendClickedLinkEvent({
                                    linkName: 'showLessActiveBoardsLink',
                                    source: 'boardsMenuInlineDialog',
                                  });

                                  includeLessActiveBoards(idTeam, e);
                                }}
                                className={styles.showLessActive}
                              >
                                {formatBoardsList(
                                  'show-less-active-boards-count',
                                  {
                                    lessActiveCount: numLessActiveBoards.toString(),
                                  },
                                )}
                              </BoardsMenuButton>
                            </div>
                          )}
                        </div>
                      </div>
                    </DragDropContext>
                  );
                }}
              </TeamBoardsBannerWrapper>
            ))}
          </div>
        );
      }}
    </MemberContext.Consumer>
  );
};

export default connect(null, mapDispatchToProps)(BoardList);

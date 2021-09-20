import moment from 'moment';

import { State } from 'app/gamma/src/modules/types';
import { ProductFeatures } from '@trello/product-features';
import {
  AccessLevel,
  BoardCreationMethod,
  BoardModel,
  BoardsMenuCategoryModel,
  BoardsMenuCategoryType,
  BoardStarModel,
  MemberModel,
  MembershipModel,
  TeamModel,
} from 'app/gamma/src/types/models';
import { chain } from 'underscore';
import { idToDate } from '@trello/dates';
import {
  isAtOrOverFreeBoardLimit,
  isPremiumTeam,
} from 'app/gamma/src/util/model-helpers/team';
import { getCardByShortLink } from './cards';
import { getListById } from './lists';
import { getMyId, isLoggedIn } from './session';
import { getMyTeams, getTeamById, isMemberOfTeam } from './teams';
import { shouldShowLessActiveBoards } from './ui';

import { forNamespace, forTemplate } from '@trello/i18n';
import { getMe } from './members';
import { getMemberTypeFromMemberships } from './memberships';
import { getCurrentSearchQuery } from 'app/gamma/src/selectors/search';
import escapeForRegex from '../util/escape-for-regex';

const format = forNamespace();
const formatBoardHeader = forTemplate('board_header');

const INITIAL_MIN_PERSONAL_BOARDS_TO_DISPLAY = 11;
const INITIAL_MAX_PERSONAL_BOARDS_TO_DISPLAY = 50;
const MAX_RECENT_BOARDS = 8;
const MAX_FILTERED_BOARDS = 7;
const WELCOME_BOARD_THRESHOLD = 1000;

// helpers
const isActiveBoard = (board: BoardModel) =>
  !moment()
    .subtract(6, 'months')
    .isAfter(board.dateLastActivity || idToDate(board.id));

export type StandardComparator<T> = (a: T, b: T) => number;
export type PreferredComparator<T> = (a: T) => boolean;

export type AnyComparator<T> = StandardComparator<T> | PreferredComparator<T>;

function isPreferredComparator<T>(
  comparator: AnyComparator<T>,
): comparator is PreferredComparator<T> {
  return comparator.length === 1;
}

export function buildComparator<T>(
  ...comparators: AnyComparator<T>[]
): StandardComparator<T> {
  const standardComparators: StandardComparator<T>[] = comparators.map(
    (comparator) =>
      isPreferredComparator(comparator)
        ? (a: T, b: T) => {
            const aIsPreferred = comparator(a);
            const bIsPreferred = comparator(b);

            return aIsPreferred && !bIsPreferred
              ? -1
              : bIsPreferred && !aIsPreferred
              ? 1
              : 0;
          }
        : comparator,
  );

  return (a: T, b: T): number => {
    for (const comparator of standardComparators) {
      const result = comparator(a, b);
      if (result) {
        return result;
      }
    }

    return 0;
  };
}

type Matcher = (input: string) => boolean;

export const buildFuzzyMatcher = (query: string): Matcher => {
  const searchExpressions: RegExp[] = query
    .split(/\s+/)
    .map((word) => new RegExp(escapeForRegex(word), 'i'));

  return (input: string) =>
    searchExpressions.every((searchExpression) => searchExpression.test(input));
};

// selectors
export const getBoardById = (
  state: State,
  board: BoardModel | string,
): BoardModel | undefined =>
  typeof board === 'string'
    ? state.models.boards.find((model: BoardModel) => model.id === board)
    : board;

export const getBoardsByIds = (
  state: State,
  idBoards: string[] = [],
): BoardModel[] =>
  idBoards.reduce((result, idBoard) => {
    const board = getBoardById(state, idBoard);
    if (board) {
      result.push(board);
    }

    return result;
  }, [] as BoardModel[]);

export const getBoardByShortLink = (
  state: State,
  shortLink: string,
): BoardModel | undefined => {
  // NOTE: It's possible that we'll still have to deal with an old temporary
  // shortLink that was being used in a URL
  if (state.models.shortLinkMap[shortLink]) {
    shortLink = state.models.shortLinkMap[shortLink];
  }

  return state.models.boards.find(
    (board: BoardModel) => board.shortLink === shortLink,
  );
};

export const getBoardForCardShortLink = (
  state: State,
  shortLink: string,
): BoardModel | undefined => {
  const card = getCardByShortLink(state, shortLink);
  if (!card) {
    return undefined;
  }

  const list = getListById(state, card.idList as string);
  if (!list) {
    return undefined;
  }

  return getBoardById(state, list.idBoard);
};

export const getBoardsMenu = (state: State) => state.ui.boardsMenu;
export const getBoardsMenuSearchText = (state: State) =>
  getBoardsMenu(state).searchText;
export const getIsDeletingBoard = (state: State, idBoard: string) =>
  getBoardsMenu(state).isDeletingBoard[idBoard];

export const getBoardStars = (state: State): BoardStarModel[] =>
  state.models.boardStars.filter((boardStar) => !boardStar.deleted);

export const getBoardsStarsSortedByPosition = (
  state: State,
): BoardStarModel[] => {
  return getBoardStars(state).sort((a, b) => (a.pos || 0) - (b.pos || 0));
};

export const getMyOpenBoardsStarsSortedByPosition = (
  state: State,
): BoardStarModel[] => {
  return getBoardsStarsSortedByPosition(state).filter(({ idBoard }) => {
    const board = getBoardById(state, idBoard);

    return board && !board.closed;
  });
};

export const getBoardStarForBoard = (state: State, idBoard: string) =>
  getBoardStars(state).find((boardStar) => boardStar.idBoard === idBoard);

export const isBoardStarred = (state: State, idBoard: string) =>
  !!getBoardStarForBoard(state, idBoard);

export const getTeamForBoard = (
  state: State,
  idBoard: string,
): TeamModel | undefined => {
  const board = getBoardById(state, idBoard);
  if (!board || !board.idTeam) {
    return undefined;
  }

  const team = getTeamById(state, board.idTeam);
  if (!team) {
    return undefined;
  }

  return team;
};

// Returns the Personal / Private Team or the team's display name
// for display purposes (when listed with a board for example)
export const getTeamDisplayNameForBoard = (state: State, idBoard: string) => {
  const board = getBoardById(state, idBoard);
  if (!board) {
    return '';
  }
  if (!board.idTeam) {
    return format('personal');
  }

  const team = getTeamForBoard(state, idBoard);
  if (!team) {
    return formatBoardHeader('private-workspace');
  }

  return team.displayName || team.name;
};

export const isTeamAdminForBoard = (state: State, idBoard: string) => {
  const team = getTeamForBoard(state, idBoard);
  if (!team || !team.memberships) {
    return false;
  }

  const idMe = getMyId(state);

  return team.memberships.some(
    (membership) => membership.idMember === idMe && membership.type === 'admin',
  );
};

export const getTeamNameForBoard = (state: State, idBoard: string) => {
  const team = getTeamForBoard(state, idBoard);
  if (!team) {
    return '';
  }

  return team.displayName || team.name;
};

export const getTeamUrlForBoard = (state: State, idBoard: string) => {
  const team = getTeamForBoard(state, idBoard);
  if (!team) {
    return '';
  }

  return team.url;
};

export const getBusinessClassProductForBoard = (
  state: State,
  idBoard: string,
) => {
  const team = getTeamForBoard(state, idBoard);
  if (!team) {
    return null;
  }

  return (
    (team.products &&
      team.products.find(ProductFeatures.isBusinessClassProduct)) ||
    null
  );
};

export const isBusinessClassBoard = (state: State, idBoard: string) => {
  return !!getBusinessClassProductForBoard(state, idBoard);
};

export const areGuestsBillable = (state: State, idBoard: string) => {
  const team = getTeamForBoard(state, idBoard);
  if (!team) {
    return false;
  }

  return ProductFeatures.isFeatureEnabled(
    'multiBoardGuests',
    team.products && team.products[0],
  );
};

export const getIsMonthlyPaymentForBoard = (state: State, idBoard: string) => {
  const product = getBusinessClassProductForBoard(state, idBoard);

  return (product && ProductFeatures.isMonthly(product)) || false;
};

export const getPricePerGuestForBoard = (state: State, idBoard: string) => {
  const product = getBusinessClassProductForBoard(state, idBoard);

  return (product && ProductFeatures.getPrice(product)) || 0;
};

export const getMyBoards = (state: State): BoardModel[] => {
  const idMe = getMyId(state);

  if (!idMe) {
    return [];
  }

  const inIdBoards = new Map<string, boolean>();
  const me = getMe(state);
  if (me && me.idBoards) {
    me.idBoards.forEach((id) => inIdBoards.set(id, true));
  }

  return state.models.boards.filter(
    ({ id, memberships }: { id: string; memberships?: MembershipModel[] }) =>
      inIdBoards.get(id) &&
      (!memberships ||
        memberships.some(
          ({ idMember }: { idMember: string }) => idMember === idMe,
        )),
  );
};

export const isBoardAdmin = (state: State, board: BoardModel) => {
  if (!board.memberships) {
    return false;
  }

  const myId = getMyId(state);
  const myMemberships = board.memberships.filter(
    (membership) => membership.idMember === myId,
  );

  return !!myMemberships.find((membership) => membership.type === 'admin');
};

export const getMyStarredBoards = (state: State): BoardModel[] => {
  const boards: BoardModel[] = state.models.boards;
  const stars = getBoardsStarsSortedByPosition(state).map(
    (boardStar) => boardStar.idBoard,
  );

  return (
    chain(boards)
      // return only starred boards
      .filter((board) => stars.includes(board.id))
      // and sort them based on the positional sort from the stars array
      .sortBy((board) => stars.indexOf(board.id))
      .value()
  );
};

export const getMyOpenStarredBoards = (state: State): BoardModel[] => {
  const msb = getMyStarredBoards(state).filter(
    (board: BoardModel) => !board.closed,
  );

  return msb;
};

export const getMyOpenBoards = (state: State): BoardModel[] =>
  getMyBoards(state).filter((board: BoardModel) => !board.closed);

export const getMyOpenBoardsAndTeamBoards = (state: State): BoardModel[] => {
  const me = getMe(state);
  if (!me || !me.idBoards || !me.idOrganizations) {
    return [];
  }

  const isOnBoard = new Set(me.idBoards);
  const isOnTeam = new Set(me.idOrganizations);

  return state.models.boards.filter(
    (board) =>
      !board.closed &&
      (isOnBoard.has(board.id) || (board.idTeam && isOnTeam.has(board.idTeam))),
  );
};

export const getMyClosedBoards = (state: State): BoardModel[] =>
  getMyBoards(state).filter((board: BoardModel) => board.closed);

export const getMyOpenPersonalBoards = (state: State) =>
  getMyOpenBoards(state).filter((board: BoardModel) => {
    return !board.idTeam
      ? true
      : !getMyTeams(state).some((team: TeamModel) => team.id === board.idTeam);
  });

export const getMyOwnedBoards = (state: State): BoardModel[] =>
  getMyBoards(state).filter(
    (board) =>
      getMemberTypeFromMemberships(
        state,
        board.memberships,
        getMe(state)!,
        board.idTeam,
      ) === AccessLevel.Admin,
  );

export const getMyOpenBoardsForTeam = (state: State, idTeam: string) =>
  getMyOpenBoards(state).filter((board: BoardModel) => board.idTeam === idTeam);

export const getMyOpenTeamBoards = (state: State) =>
  getMyOpenBoards(state).filter((board: BoardModel) => !!board.idTeam);

export const getMyOpenBoardsSortedByActivity = (
  state: State,
  includeLessActiveBoards = true,
  idTeam: string | null = null,
): BoardModel[] => {
  const openBoards =
    idTeam === null
      ? getMyOpenPersonalBoards(state)
      : getMyOpenBoardsForTeam(state, idTeam);

  return chain(openBoards)
    .sortBy((board) => board.name && board.name.toLowerCase())
    .sortBy(
      (board) =>
        -(
          (board.dateLastActivity && new Date(board.dateLastActivity)) ||
          idToDate(board.id)
        ),
    )
    .filter(
      (board: BoardModel, i: number) =>
        includeLessActiveBoards ||
        i < INITIAL_MIN_PERSONAL_BOARDS_TO_DISPLAY ||
        (i < INITIAL_MAX_PERSONAL_BOARDS_TO_DISPLAY && isActiveBoard(board)),
    )
    .sortBy((board) => board.name && board.name.toLowerCase())
    .value();
};

export const getRecentBoards = (state: State): BoardModel[] => {
  const recentIds = state.ui.boardsMenu.idRecentBoards;

  return recentIds.reduce((acc: BoardModel[], id) => {
    const board = getBoardById(state, id);

    if (board) {
      acc.push(board);
    }

    return acc;
  }, []);
};

export const getMyOpenRecentBoards = (state: State): BoardModel[] => {
  const stars = getBoardStars(state).map((boardStar) => boardStar.idBoard);

  return (
    getRecentBoards(state)
      // the recent boards list doesn't contain any starred boards
      .filter((board) => !stars.includes(board.id))
      .filter((board) => !board.closed)
      .slice(0, MAX_RECENT_BOARDS)
  );
};

export const getMissingBoardIds = (state: State): string[] => {
  const boardIds = state.models.boards.map((board: BoardModel) => board.id);
  const recentIds = state.ui.boardsMenu.idRecentBoards;

  return recentIds.filter(
    (recentBoardId: string) => boardIds.indexOf(recentBoardId) < 0,
  );
};

export const getBoardsMenuCategoriesWithBoards = (
  state: State,
): BoardsMenuCategoryModel[] => {
  const myRecentBoards = getMyOpenRecentBoards(state);
  const myStarredBoards = getMyOpenStarredBoards(state);
  const myTeamBoards = getMyOpenTeamBoards(state);
  const myTeams = getMyTeams(state);

  const myPersonalBoards = getMyOpenPersonalBoards(state);
  const myPersonalBoardsSortedByActivity = getMyOpenBoardsSortedByActivity(
    state,
    shouldShowLessActiveBoards(state, BoardsMenuCategoryType.Personal),
  );

  return [
    {
      id: BoardsMenuCategoryType.Starred,
      category: format(['board section title', 'starred boards']),
      type: BoardsMenuCategoryType.Starred,
      boards: myStarredBoards,
    },
    {
      id: BoardsMenuCategoryType.Recent,
      category: format(['board section title', 'recent boards']),
      type: BoardsMenuCategoryType.Recent,
      boards: myRecentBoards,
    },
    {
      id: BoardsMenuCategoryType.Personal,
      category: format(['board section title', 'personal boards']),
      type: BoardsMenuCategoryType.Personal,
      boards: myPersonalBoardsSortedByActivity,
      numLessActiveBoards:
        myPersonalBoards.length - myPersonalBoardsSortedByActivity.length,
    },
    ...myTeams
      // When a user is added to a team, the "sort" operation fails. This is because we're partially updating the state
      // so we end up receiving a team that doesn't yet have a displayName. The root cause should be solved, but by
      // filtering upfront this mitigates the customer impact for now.
      // https://trello.atlassian.net/browse/TRELP-2711
      .filter((team) => team.displayName !== undefined)
      .sort((a: TeamModel, b: TeamModel) => {
        const teamAName = a.displayName.toLowerCase();
        const teamBName = b.displayName.toLowerCase();
        if (teamAName < teamBName) {
          return -1;
        }
        if (teamAName > teamBName) {
          return 1;
        }

        return 0;
      })
      .map((team: TeamModel) => {
        const teamBoards = myTeamBoards.filter(
          (board: BoardModel) => board.idTeam === team.id,
        );
        const teamBoardsSortedByActivity = getMyOpenBoardsSortedByActivity(
          state,
          shouldShowLessActiveBoards(state, team.id),
          team.id,
        );

        return {
          category: team.displayName,
          teamShortName: team.name,
          id: `${BoardsMenuCategoryType.Team}-${team.id}`,
          teamId: team.id,
          type: BoardsMenuCategoryType.Team,
          boards: teamBoardsSortedByActivity,
          logos: team.logos ? team.logos : null,
          isPremiumTeam: isPremiumTeam(team),
          isStandardTeam: ProductFeatures.isStandardProduct(team.products?.[0]),
          hasViewsFeature: ProductFeatures.isFeatureEnabled(
            'views',
            team.products?.[0],
          ),
          numLessActiveBoards:
            teamBoards.length - teamBoardsSortedByActivity.length,
          url: `/${team.name}`,
        };
      }),
  ];
};

interface NamedBoardModel extends BoardModel {
  readonly name: string;
}

const getFilteredBoards = (state: State, searchText: string): BoardModel[] => {
  const me = getMe(state);
  if (!me || !me.idBoards) {
    return [];
  }

  // filtering
  const isMatch = buildFuzzyMatcher(searchText);
  const filteredBoards = getMyOpenBoardsAndTeamBoards(state).filter(
    ({ name }) => name && isMatch(name),
  ) as NamedBoardModel[];

  // sorting
  const idBoardsStarred = new Set(
    getBoardStars(state).map(({ idBoard }) => idBoard),
  );
  const idBoardsRecent = new Set(
    getMyOpenRecentBoards(state).map(({ id }) => id),
  );

  const isOnBoard = new Set(me.idBoards);

  const startsWithSearch = (board: NamedBoardModel): boolean => {
    return board.name.toLowerCase().startsWith(searchText.toLowerCase());
  };

  let comparePrefixedBoards:
    | ((a: NamedBoardModel, b: NamedBoardModel) => number)
    | undefined;

  // from boards-sidebar-filtered-boards-view.js
  return filteredBoards
    .sort(
      buildComparator(
        // Preferred if it's starred
        (board: NamedBoardModel) => idBoardsStarred.has(board.id),
        // Preferred if it's recent
        (board: NamedBoardModel) => idBoardsRecent.has(board.id),
        // Preferred if we're a member of the board
        (board: NamedBoardModel) => isOnBoard.has(board.id),
        // Preferred if the name of the board starts our search term, and if
        // both do, by the shorter of the two names
        (a: NamedBoardModel, b: NamedBoardModel) => {
          if ([a, b].some(startsWithSearch)) {
            if (comparePrefixedBoards === undefined) {
              comparePrefixedBoards = buildComparator(
                // Prefer if it starts with the search term
                (board: NamedBoardModel) => startsWithSearch(board),
                // Prefer the shorter name
                (aWithPrefix: NamedBoardModel, bWithPrefix: NamedBoardModel) =>
                  aWithPrefix.name.length - bWithPrefix.name.length,
              );
            }

            return comparePrefixedBoards(a, b);
          } else {
            return 0;
          }
        },
        // Sort alphabetically
        (a: NamedBoardModel, b: NamedBoardModel) =>
          a.name.localeCompare(b.name),
      ),
    )
    .slice(0, MAX_FILTERED_BOARDS);
};

export const getBoardsMenuFilteredBoards = (state: State): BoardModel[] => {
  const searchText = getBoardsMenuSearchText(state);
  return getFilteredBoards(state, searchText);
};

export const getBoardsSearchFilteredBoards = (state: State): BoardModel[] => {
  const searchText = getCurrentSearchQuery(state);
  const isSearching = !!searchText;
  return isSearching ? getFilteredBoards(state, searchText) : [];
};

export const isWelcomeBoard = (
  state: State,
  board: BoardModel | string,
): boolean => {
  const model = getBoardById(state, board);

  if (!model) {
    return false;
  }

  const delta =
    idToDate(model.id).getTime() - idToDate(getMyId(state)).getTime();

  return (
    model.creationMethod === BoardCreationMethod.Demo ||
    (0 <= delta && delta < WELCOME_BOARD_THRESHOLD)
  );
};

export const getTeamsAtOrOverBoardLimitForClosedBoards = (
  state: State,
): TeamModel[] => {
  // Get all the closed boards that the user has permission to re-open
  const closedBoards = getMyClosedBoards(state).filter(
    (board) =>
      board &&
      (isBoardAdmin(state, board) || isTeamAdminForBoard(state, board.id)),
  );

  // Get the corresponding teams for these boards that are at or over their free
  // board limit and dedup the results
  return closedBoards
    .map((board) => getTeamForBoard(state, board.id))
    .filter((team, i, arr) => {
      if (!team) {
        return false;
      }

      if (arr.indexOf(team) !== i) {
        return false;
      }

      return isAtOrOverFreeBoardLimit(team);
    }) as TeamModel[];
};

export const isTeamBoard = (state: State, idBoard: string): boolean => {
  const board = getBoardById(state, idBoard);

  return board && board.idTeam ? true : false;
};

export const hasAccessLevelType = (
  state: State,
  member: MemberModel,
  board: BoardModel,
  AccessLevelType: AccessLevel,
): boolean => {
  if (!board.memberships || !board.idTeam) {
    return false;
  }

  return (
    getMemberTypeFromMemberships(
      state,
      board.memberships,
      member,
      board.idTeam,
    ) === AccessLevelType
  );
};

export const isMemberOfBoard = (
  state: State,
  member: MemberModel,
  idBoard: string,
): boolean => {
  const board = getBoardById(state, idBoard);

  if (!board || !member || !board.memberships) {
    return false;
  }

  return board.memberships.some((model) => model.idMember === member.id);
};

export const memberMatchesSetting = (
  state: State,
  member: MemberModel,
  board: BoardModel,
  setting: string,
): boolean => {
  const isMember = isMemberOfBoard(state, member, board.id);
  const isMemberOrg =
    isTeamBoard(state, board.id) &&
    isMemberOfTeam(state, board.idTeam!, member);
  const isMemberObserver = hasAccessLevelType(
    state,
    member,
    board,
    AccessLevel.Observer,
  );
  const isMemberAdmin = hasAccessLevelType(
    state,
    member,
    board,
    AccessLevel.Admin,
  );

  switch (setting) {
    case 'public':
      return isLoggedIn(state);
    case 'org':
      return isMember || isMemberOrg || isMemberObserver;
    case 'observers':
      return isMember || isMemberObserver;
    case 'members':
      return isMember;
    case 'admins':
      return isMemberAdmin;
    default:
      return false;
  }
};

export const canComment = (
  state: State,
  member: MemberModel,
  idBoard: string,
): boolean => {
  const board = getBoardById(state, idBoard);

  if (!board || !board.prefs || !board.prefs.comments) {
    return false;
  }

  return memberMatchesSetting(state, member, board, board.prefs.comments);
  // TODO: Team boards contribution implementation
  // https://trello.atlassian.net/browse/WLRS-336
  // https://trello.atlassian.net/browse/WLRS-315
};

export const isTemplate = (state: State, idBoard: string): boolean => {
  const board = getBoardById(state, idBoard);
  const isPublic = board?.prefs?.permissionLevel === AccessLevel.Public;
  const isPrivateTemplatesEnabled = board?.premiumFeatures?.includes(
    'privateTemplates',
  );

  if (!board?.prefs?.isTemplate) {
    return false;
  } else if (isPublic || isPrivateTemplatesEnabled) {
    return true;
  } else {
    return false;
  }
};

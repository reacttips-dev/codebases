/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  useAllBoardsAndWorkspacesQuery,
  AllBoardsAndWorkspacesQuery,
} from './AllBoardsAndWorkspacesQuery.generated';
import { UserRelationshipToWorkspace } from 'app/src/components/WorkspaceNavigation/useCurrentWorkspace';
import { Util } from 'app/scripts/lib/util';
import { forTemplate } from '@trello/i18n';

type Board = NonNullable<
  AllBoardsAndWorkspacesQuery['member']
>['boards'][number];

const format = forTemplate('workspace_switcher');

interface WorkspaceBase {
  displayName: string;
  urlMostRecentlyViewedBoard?: string;
  userRelationshipToWorkspace: UserRelationshipToWorkspace;
}

export interface MemberWorkspace extends WorkspaceBase {
  id: string;
  name: string;
  logoHash?: string | null;
  userRelationshipToWorkspace: 'MEMBER';
}

export interface GuestWorkspace extends WorkspaceBase {
  id: string;
  name: undefined;
  urlMostRecentlyViewedBoard: string;
  logoHash?: string | null;
  userRelationshipToWorkspace: 'GUEST';
}

export interface PersonalWorkspace extends WorkspaceBase {
  id: undefined;
  name: string;
  logoHash: undefined;
  userRelationshipToWorkspace: 'PERSONAL';
}

export type Workspace = MemberWorkspace | GuestWorkspace | PersonalWorkspace;

export const useAllWorkspaces = () => {
  const { data, loading, error, refetch } = useAllBoardsAndWorkspacesQuery({
    notifyOnNetworkStatusChange: true,
  });

  if (
    !data?.member?.boards ||
    !data.member.organizations ||
    !data.member.guestOrganizations
  ) {
    // Loading or error, return early
    return { workspaces: undefined, loading, error, refetch };
  }

  const {
    member: { username, boards, organizations, guestOrganizations },
  } = data;

  const workspaces: Workspace[] = [];

  // add the organizations user is a member of
  for (let i = 0; i < organizations.length; i += 1) {
    const organization = organizations[i];
    workspaces.push({
      id: organization.id,
      name: organization.name,
      displayName: organization.displayName,
      logoHash: organization.logoHash,
      userRelationshipToWorkspace: 'MEMBER' as const,
      urlMostRecentlyViewedBoard: getUrlMostRecentOrgBoard({
        orgId: organization.id,
        boards,
      }),
    });
  }
  // add the organizations the user is a guest of
  for (const guestOrganization of guestOrganizations) {
    const urlMostRecentlyViewedBoard = getUrlMostRecentOrgBoard({
      orgId: guestOrganization.id,
      boards,
    });

    // we only add a guest organization to the workspaces array
    // if the use is a member of a board in that org
    if (urlMostRecentlyViewedBoard) {
      workspaces.push({
        id: guestOrganization.id,
        name: undefined,
        displayName: guestOrganization.displayName,
        logoHash: guestOrganization.logoHash,
        userRelationshipToWorkspace: 'GUEST' as const,
        urlMostRecentlyViewedBoard,
      });
    }
  }

  const hasPersonalBoards = !!boards.find((b) => !b.idOrganization);

  if (hasPersonalBoards) {
    workspaces.push({
      id: undefined,
      name: username,
      displayName: format('personal-boards'),
      logoHash: undefined,
      userRelationshipToWorkspace: 'PERSONAL' as const,
    });
  }

  return { workspaces, loading, error, refetch };
};

interface GetUrlMostRecentOrgBoard {
  orgId: string;
  boards: Board[];
}
function getUrlMostRecentOrgBoard({
  orgId,
  boards,
}: GetUrlMostRecentOrgBoard): undefined | string {
  const mostRecentBoard = getMostRecentlyViewedBoardForOrg({ orgId, boards });

  return mostRecentBoard ? Util.relativeUrl(mostRecentBoard.url) : undefined;
}

interface GetMostRecentlyViewedBoardForOrg {
  orgId: string;
  boards: Board[];
}
function getMostRecentlyViewedBoardForOrg({
  orgId,
  boards,
}: GetMostRecentlyViewedBoardForOrg): undefined | Board {
  const openOrgBoards = boards.filter(
    (b) => !b.closed && b.idOrganization === orgId,
  );
  // initialize the most recently viewed board as the first board
  let mostRecentlyViewedBoard: Board | undefined = openOrgBoards[0];

  for (const board of openOrgBoards) {
    if (isMoreRecentlyViewedBoard(board, mostRecentlyViewedBoard)) {
      mostRecentlyViewedBoard = board;
    }
  }

  return mostRecentlyViewedBoard;
}

function isMoreRecentlyViewedBoard(board1: Board, board2: Board) {
  if (!board2.dateLastView) {
    // comparison board has never been viewed
    return true;
  }

  return (
    board1.dateLastView &&
    new Date(board1.dateLastView) > new Date(board2.dateLastView)
  );
}

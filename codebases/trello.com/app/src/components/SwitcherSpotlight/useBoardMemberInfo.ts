import { useMemo, useEffect } from 'react';
import { JoinableSiteUser } from './types';
import { useGetBoardMemberIdsQuery } from './GetBoardMemberIdsQuery.generated';
import { useGetMemberInfoQuery } from './GetMemberInfoQuery.generated';
import { NOT_A_BOARD } from './useCurrentBoardId';
import { cacheMembersAndLastBoard } from './caching';
import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent, SentryErrorMetadata } from '@trello/error-reporting';

const metadata: SentryErrorMetadata = {
  tags: {
    ownershipArea: 'trello-workflowers',
    feature: Feature.PushTouchpointsSwitcherSpotlight,
  },
  extraData: {
    subjectMethod: 'useBoardMemberInfo',
  },
};

/** Get the board member names, avatarUrl and aaIds */
export const useBoardMemberInfo = (
  boardId: string,
  userId: string,
  skip: boolean,
) => {
  const isBoard = boardId !== NOT_A_BOARD;
  const skipBoardMemberQuery = skip || !isBoard;

  const {
    data: boardMemberIds,
    loading: boardMemberIdsLoading,
    error: boardMemberIdsError,
  } = useGetBoardMemberIdsQuery({
    variables: {
      boardId,
    },
    skip: skipBoardMemberQuery,
  });
  const ids = boardMemberIds?.board?.members;

  const idMembers = useMemo(() => {
    try {
      if (
        isBoard &&
        !boardMemberIdsLoading &&
        !boardMemberIdsError &&
        ids?.length
      ) {
        return ids.filter(({ id }) => id !== userId).map(({ id }) => id);
      }
    } catch (err) {
      sendErrorEvent(err, metadata);
    }
  }, [isBoard, ids, boardMemberIdsLoading, boardMemberIdsError, userId]);

  // Self is already excluded from total members
  const totalMembers = idMembers?.length ?? 0;
  const skipMemberInfoQuery = skip || totalMembers < 2 || totalMembers > 19;

  const {
    data: membersData,
    error: membersError,
    loading: membersLoading,
  } = useGetMemberInfoQuery({
    variables: {
      idMembers: idMembers || [],
    },
    skip: skipMemberInfoQuery,
  });

  const membersInfo = useMemo(() => {
    try {
      if (
        isBoard &&
        !membersLoading &&
        !membersError &&
        membersData &&
        Array.isArray(membersData?.members)
      ) {
        return membersData.members
          .filter(({ aaId }) => aaId)
          .map<JoinableSiteUser>(({ avatarUrl, fullName, id, aaId }) => ({
            avatarUrl: `${avatarUrl}/original.png`,
            displayName: fullName ?? '',
            accountId: aaId ?? '',
            id,
          }))
          .sort((a, b) => (a.displayName <= b.displayName ? -1 : 1));
      }
    } catch (err) {
      sendErrorEvent(err, metadata);
    }
  }, [isBoard, membersData, membersLoading, membersError]);

  const loading = membersLoading || boardMemberIdsLoading;
  const error = membersError || boardMemberIdsError;

  useEffect(() => {
    if (!loading && !error && boardId !== NOT_A_BOARD) {
      cacheMembersAndLastBoard(membersInfo, boardId, userId);
    }
  }, [membersInfo, boardId, userId, loading, error]);

  return {
    data: membersInfo,
    loading,
    error,
  };
};

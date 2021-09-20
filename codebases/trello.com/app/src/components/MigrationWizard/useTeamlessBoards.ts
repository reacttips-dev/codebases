import { ApolloError } from '@apollo/client';
import {
  TeamlessBoardsQuery,
  useTeamlessBoardsQuery,
} from './TeamlessBoardsQuery.generated';
import { useEffect } from 'react';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';

export type TeamlessBoard = NonNullable<
  TeamlessBoardsQuery['member']
>['boards'][number];

interface TeamlessBoardsHookArgs {
  skip?: boolean;
}

interface TeamlessBoardsHook {
  loading: boolean;
  error?: ApolloError;
  teamlessBoards: TeamlessBoard[];
}

export const useTeamlessBoards = ({
  skip,
}: TeamlessBoardsHookArgs = {}): TeamlessBoardsHook => {
  const { data, loading, error } = useTeamlessBoardsQuery({ skip });

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          hook: 'useTeamlessBoards',
        },
      });
    }
  }, [error]);

  const memberId = data?.member?.id || 'me';
  const teamlessBoards =
    data?.member?.boards?.filter(
      ({ memberships, enterpriseOwned, idOrganization }) =>
        !idOrganization &&
        !enterpriseOwned &&
        memberships.find(
          ({ idMember, memberType }) =>
            idMember === memberId && memberType === 'admin',
        ),
    ) || [];

  return {
    loading,
    error,
    teamlessBoards,
  };
};

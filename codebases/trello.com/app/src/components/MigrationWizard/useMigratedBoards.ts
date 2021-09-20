import { memberId } from '@trello/session-cookie';
import { useEffect, useMemo } from 'react';
import {
  MigratedBoardsQuery,
  useMigratedBoardsQuery,
} from './MigratedBoardsQuery.generated';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';

export type MigratedBoard = NonNullable<
  MigratedBoardsQuery['organization']
>['boards'][number];

interface MigratedBoardsHookArgs {
  idOrg?: string;
  skip?: boolean;
}

/*
  Either accept an idOrg or find one from the teamify value,
  this allows double use of this hook in case we are in location
  that already has teamify and safes a second request.
*/
export const useMigratedBoards = ({
  idOrg,
  skip,
}: MigratedBoardsHookArgs = {}) => {
  const { data, loading, error, refetch } = useMigratedBoardsQuery({
    variables: {
      orgId: idOrg ?? '',
    },
    skip: skip || !idOrg,
  });

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          hook: 'useMigratedBoards',
        },
      });
    }
  }, [error]);

  const migrationOrg = useMemo(
    () => ({
      id: data?.organization?.id,
      displayName: data?.organization?.displayName,
    }),
    [data?.organization],
  );

  // the graphql query already filters for open boards, so no need to check that here
  const migratedBoards =
    data?.organization?.boards?.filter(({ memberships }) =>
      memberships.find(({ idMember }) => idMember === memberId),
    ) || [];

  return {
    loading,
    error,
    migrationOrg,
    migratedBoards,
    refetch,
  };
};

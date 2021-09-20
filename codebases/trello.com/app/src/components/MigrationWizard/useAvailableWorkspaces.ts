import { useContext, useEffect, useMemo } from 'react';
import { MigrationWizardContext } from './MigrationWizardContext';
import { sendErrorEvent } from '@trello/error-reporting';
import { ProductFeatures } from '@trello/product-features';
import { Feature } from 'app/scripts/debug/constants';
import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { isMemberAdmin } from '@trello/organizations';
import {
  useUseAvailableWorkspacesQuery,
  UseAvailableWorkspacesQuery,
} from './UseAvailableWorkspacesQuery.generated';
import { MigrationWizardExperience } from './types';

type WorkspaceResult = NonNullable<
  UseAvailableWorkspacesQuery['member']
>['organizations'][0];

interface Workspace extends WorkspaceResult {
  numberOfFreeBoardsAvailable: number | null;
  isPremiumWorkspace: boolean;
  isAdmin: boolean;
}

interface UseAvailableWorkspaces {
  loading: boolean;
  error?: ApolloError | null;
  workspaces: Workspace[];
  refetch: () => Promise<ApolloQueryResult<UseAvailableWorkspacesQuery>>;
}

export const useAvailableWorkspaces = (): UseAvailableWorkspaces => {
  const { dialogProps, experience, teamify } = useContext(
    MigrationWizardContext,
  );
  const { data, loading, error, refetch } = useUseAvailableWorkspacesQuery();

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          hook: 'useAvailableWorkspaces',
        },
      });
    }
  }, [error]);

  useEffect(() => {
    if (dialogProps.isOpen) {
      refetch();
    }
  }, [dialogProps.isOpen, refetch]);

  return useMemo(() => {
    const me = data?.member;

    const workspaces = (data?.member?.organizations ?? [])
      .map((workspace) => {
        const isPremiumWorkspace = ProductFeatures.hasProduct(
          workspace.products?.[0],
        );
        const boardCount =
          workspace?.limits?.orgs?.freeBoardsPerOrg?.count ?? 0;
        const boardLimit =
          workspace?.limits?.orgs?.freeBoardsPerOrg?.disableAt ?? 10;
        const boardCountRemaining = boardLimit - boardCount;
        const displayedBoardCount =
          boardCountRemaining > 0 && boardCountRemaining < 10
            ? boardCountRemaining
            : null;

        return {
          ...workspace,
          isAdmin: !!me && isMemberAdmin(me, workspace),
          numberOfFreeBoardsAvailable: isPremiumWorkspace
            ? Number.POSITIVE_INFINITY
            : displayedBoardCount,
          isPremiumWorkspace,
        };
      })
      .filter((w) =>
        experience === MigrationWizardExperience.Post
          ? w.id !== teamify?.idOrgCreated && w.id !== teamify?.idOrgSelected
          : true,
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    return {
      loading,
      error,
      workspaces,
      refetch,
    };
  }, [loading, error, data, teamify, experience, refetch]);
};

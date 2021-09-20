import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import { useContext, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { MigrationWizardContext } from './MigrationWizardContext';
import {
  useSelectedWorkspaceQuery,
  SelectedWorkspaceQuery,
} from './SelectedWorkspaceQuery.generated';

interface UseSelectedWorkspace {
  boards: NonNullable<SelectedWorkspaceQuery['organization']>['boards'];
  org: NonNullable<SelectedWorkspaceQuery['organization']> | null;
  loading: boolean;
  error?: ApolloError;
}

export const useSelectedWorkspace = (): UseSelectedWorkspace => {
  const { orgId } = useContext(MigrationWizardContext);
  const { data, loading, error } = useSelectedWorkspaceQuery({
    variables: { orgId },
    skip: !orgId,
  });

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          hook: 'useSelectedWorkspace',
        },
      });
    }
  }, [error]);

  return {
    loading,
    boards: data?.organization?.boards || [],
    org: data?.organization || null,
    error,
  };
};

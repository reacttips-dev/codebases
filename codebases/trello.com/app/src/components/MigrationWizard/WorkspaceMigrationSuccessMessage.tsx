import React from 'react';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { forNamespace } from '@trello/i18n';

const format = forNamespace(['migration wizard']);

interface Props {
  migrationOrg: {
    id?: string;
    displayName?: string;
  };
}

export const WorkspaceMigrationSuccessMessage: React.FC<Props> = ({
  migrationOrg,
}) => (
  <div>
    {format('workspace-migration-success', {
      workspaceName: (
        <RouterLink href={`/${migrationOrg.id}/`}>
          {migrationOrg.displayName}
        </RouterLink>
      ),
    })}
  </div>
);

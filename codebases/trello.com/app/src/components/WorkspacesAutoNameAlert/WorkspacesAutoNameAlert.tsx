import React, { useState, useEffect } from 'react';
import { useWorkspacesAutoNameAlertQuery } from './WorkspacesAutoNameAlertQuery.generated';
import { useWorkspacesAutoNameAlertDismissMutation } from './WorkspacesAutoNameAlertDismissMutation.generated';
import { forNamespace } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';

const format = forNamespace('alerts', { shouldEscapeStrings: false });

interface WorkspacesAutoNameAlertProps {
  orgId: string;
}

export const WorkspacesAutoNameAlert: React.FunctionComponent<WorkspacesAutoNameAlertProps> = ({
  orgId,
}) => {
  const [isShown, setIsShown] = useState(false);
  const { data } = useWorkspacesAutoNameAlertQuery({
    variables: { orgId },
    skip: !orgId || isShown,
  });
  const [dismissAlert] = useWorkspacesAutoNameAlertDismissMutation();
  const DISMISS_MESSAGE = `WorkspacesAutoNameAlert-${orgId}`;
  const workspaceName = data?.organization?.displayName;
  const workspaceUrl = data?.organization?.url;
  const shouldShowAlert =
    !isShown &&
    data?.organization?.creationMethod === 'board-creation' &&
    data?.organization?.idMemberCreator === data?.member?.id &&
    !data?.member?.oneTimeMessagesDismissed?.includes(DISMISS_MESSAGE);

  useEffect(() => {
    if (shouldShowAlert) {
      const messaging = format(['workspaces-auto-name-alert'], {
        workspaceName,
      });
      const linkText = format(['workspaces-auto-name-alert-link']);

      showFlag({
        id: 'WorkspacesAutoName',
        title: messaging,
        appearance: 'info',
        isAutoDismiss: true,
        msTimeout: 8000,
        actions: [
          {
            content: linkText,
            href: workspaceUrl,
            type: 'link',
          },
        ],
      });

      setIsShown(true);
      dismissAlert({
        variables: { messageId: DISMISS_MESSAGE },
      });
    }
  }, [
    DISMISS_MESSAGE,
    dismissAlert,
    shouldShowAlert,
    workspaceName,
    workspaceUrl,
  ]);

  return null;
};

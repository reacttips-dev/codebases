import React, { FunctionComponent, useCallback, useEffect } from 'react';

import { forNamespace, forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { showFlag } from '@trello/nachos/experimental-flags';

// eslint-disable-next-line @trello/less-matches-component
import styles from './AtlassianManagedAccountOverlay.less';
import api from 'app/gamma/src/api';
import { ManagedAccountDialog } from './ManagedAccountDialog';
import { AtlassianAccountOnboardingLinks } from '../AtlassianAccountOnboardingLinks';
import { NEWLY_MANAGED_MESSAGE_ID } from './newlyManagedMessageId';

const format = forNamespace(['aa onboarding', 'dialog'], {
  shouldEscapeStrings: false,
});
const formatError = forTemplate('app_management');

interface ManagedAccountProps {
  id: string;
  orgName?: string;
  onDismiss: () => void;
  onClickGotIt: () => void;
  onTrackScreenEvent: () => void;
}

const getSecondaryMessage = (orgName?: string) => {
  const managedByLink = (
    <a
      target="_blank"
      rel="noopener noreferrer"
      key="managed-by"
      href={AtlassianAccountOnboardingLinks.Help}
    >
      {format('managed by', { orgName })}
    </a>
  );

  return format('managed account secondary message', {
    orgName,
    managedBy: managedByLink,
  });
};

export const ManagedAccount: FunctionComponent<ManagedAccountProps> = ({
  id,
  orgName,
  onDismiss,
  onClickGotIt,
  onTrackScreenEvent,
}) => {
  useEffect(() => {
    onTrackScreenEvent();
  }, [onTrackScreenEvent]);

  const markAsDismissed = useCallback(async () => {
    try {
      await api.client.rest.post(`members/${id}/oneTimeMessagesDismissed`, {
        body: {
          value: NEWLY_MANAGED_MESSAGE_ID,
        },
      });
    } catch (err) {
      showFlag({
        id: 'ManagedAccount',
        title: formatError('something-went-wrong'),
        appearance: 'error',
        isAutoDismiss: true,
      });
    }
  }, [id]);

  const onGotIt = useCallback(async () => {
    await markAsDismissed();
    onClickGotIt();
  }, [markAsDismissed, onClickGotIt]);

  const onClose = useCallback(async () => {
    await markAsDismissed();
    onDismiss();
  }, [markAsDismissed, onDismiss]);

  return (
    <>
      <ManagedAccountDialog
        title={format('managed account title')}
        helpLink={AtlassianAccountOnboardingLinks.Help}
        closeDialog={onClose}
        className={styles.managedAccountBody}
      >
        <div className={styles.managedAccountContent}>
          <li key="managed account main message">
            {format('managed account main message', { orgName })}
          </li>
          <li key="managed account secondary-messages">
            {getSecondaryMessage(orgName)}
          </li>
          <li key="managed account tertiary message">
            {format('managed account tertiary message', {
              orgName,
            })}
          </li>
        </div>
        <div className={styles.managedAccountAction}>
          <Button appearance="primary" size="wide" onClick={onGotIt}>
            {format('got it')}
          </Button>
        </div>
      </ManagedAccountDialog>
    </>
  );
};

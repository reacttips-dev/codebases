import React from 'react';
import { Button } from '@trello/nachos/button';
import { forTemplate } from '@trello/i18n';
import { useFreeTeamOnboarding } from './useFreeTeamOnboarding';
import { Spinner } from '@trello/nachos/spinner';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './FreeTeamOnboardingMenu.less';

const format = forTemplate('free_team_onboarding');

interface FreeTeamOnboardingMenuProps {
  orgId: string;
}

export const FreeTeamOnboardingMenu: React.FC<FreeTeamOnboardingMenuProps> = ({
  orgId,
}) => {
  const { isDismissing, dismissAndRedirect } = useFreeTeamOnboarding(orgId);

  const onDismiss = async () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'hideButton',
      source: 'freeTeamGettingStartedMenuInlineDialog',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });

    dismissAndRedirect();
  };

  return (
    <div className={styles.container}>
      <strong>{format('hide-getting-started')}</strong>
      <p>{format('we-wont-show-you')}</p>
      <Button
        appearance="default"
        className={styles.submitButton}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onDismiss}
        isDisabled={isDismissing}
      >
        {isDismissing ? <Spinner centered small /> : format('hide')}
      </Button>
    </div>
  );
};

import React, { FunctionComponent, useEffect } from 'react';

import { forNamespace } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { AutoOnboardingDialog } from './AutoOnboardingDialog';
import { Analytics, SourceType } from '@trello/atlassian-analytics';

// eslint-disable-next-line @trello/less-matches-component
import styles from './AutoOnboardingOverlayManager.less';

const format = forNamespace(['aa onboarding', 'dialog'], {
  shouldEscapeStrings: false,
});

interface UpdateAccountProps {
  aaEmail: string;
  orgName?: string;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  onClickUpdateAccount: () => void;
  onDismiss: () => void;
  analyticsEventName: SourceType;
  analyticsContext: object;
  analyticsContainers: object;
}

const getDomainFromEmail = (email: string) => {
  let emailDomain = email;
  const pos = email.search('@'); // get position of domain
  if (pos > 0) {
    emailDomain = email.slice(pos + 1); // use the slice method to get domain name, "+1" mean domain does not include "@"
  }
  return emailDomain;
};

export const UpdateAccount: FunctionComponent<UpdateAccountProps> = ({
  aaEmail,
  orgName,
  image,
  mobileImage,
  onClickUpdateAccount,
  onDismiss,
  analyticsEventName,
  analyticsContext,
  analyticsContainers,
}) => {
  useEffect(() => {
    Analytics.sendScreenEvent({
      name: analyticsEventName,
      attributes: analyticsContext,
      containers: analyticsContainers,
    });
  }, [analyticsEventName, analyticsContext, analyticsContainers]);

  return (
    <AutoOnboardingDialog
      title={format('update your trello account')}
      closeDialog={onDismiss}
      image={image}
      mobileImage={mobileImage}
    >
      <div className={styles.mainMessage}>
        <p>
          {format('update account intro', {
            orgDomain: (
              <strong key={aaEmail}>{getDomainFromEmail(aaEmail)}</strong>
            ),
            orgName: <strong key={orgName}>{orgName}</strong>,
          })}
        </p>
        <p>{format('update account msg')}</p>
        <p>{format('guide account update')}</p>
      </div>
      <div className={styles.buttons}>
        <Button appearance="primary" size="wide" onClick={onClickUpdateAccount}>
          {format('continue')}
        </Button>
      </div>
    </AutoOnboardingDialog>
  );
};

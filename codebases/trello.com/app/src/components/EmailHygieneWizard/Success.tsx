import React, { FunctionComponent } from 'react';
import { SourceType } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { EmailHygieneDialog } from './EmailHygieneDialog';
import styles from './Success.less';

const format = forNamespace(['email hygiene wizard', 'success screen'], {
  shouldEscapeStrings: false,
});

interface SuccessProps {
  email: string;
  onDismiss: () => void;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  analyticsContext: object;
  analyticsSource: SourceType;
}

export const Success: FunctionComponent<SuccessProps> = ({
  email,
  onDismiss,
  image,
  mobileImage,
  analyticsContext,
  analyticsSource,
}) => (
  <EmailHygieneDialog
    closeDialog={onDismiss}
    title={format('title')}
    image={image}
    mobileImage={mobileImage}
    analyticsContext={analyticsContext}
    analyticsSource={analyticsSource}
  >
    <p className={styles.mainMessage}>
      {format('main-message', { email: <strong key="email">{email}</strong> })}
    </p>
    <p>
      {format('secondary-message', {
        yourProfileLink: (
          <a href="/me" key="profile-link">
            {format('your-profile-link')}
          </a>
        ),
      })}
    </p>

    <div className={styles.buttons}>
      <Button appearance="primary" onClick={onDismiss}>
        {format('done-button')}
      </Button>
    </div>
  </EmailHygieneDialog>
);

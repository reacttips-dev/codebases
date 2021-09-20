import React, { FunctionComponent, ReactElement } from 'react';
import { SourceType } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';
import { EmailHygieneDialog } from './EmailHygieneDialog';
import styles from './ConfirmationEmailSent.less';

interface ConfirmationEmailSentProps {
  email: string;
  onDismiss?: () => void;
  changeEmailButton: ReactElement;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  analyticsContext: object;
  analyticsSource: SourceType;
}

const format = forNamespace(
  ['email hygiene wizard v2', 'confirmation email sent screen'],
  { shouldEscapeStrings: false },
);

export const ConfirmationEmailSent: FunctionComponent<ConfirmationEmailSentProps> = ({
  email,
  onDismiss,
  changeEmailButton,
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
    {/* eslint-disable-next-line react/no-danger */}
    <p dangerouslySetInnerHTML={{ __html: format('secondary-message') }} />
    <div className={styles.buttons}>
      <Button appearance="primary" onClick={onDismiss}>
        {format('ok-button')}
      </Button>

      {changeEmailButton}
    </div>
  </EmailHygieneDialog>
);

import React, { FunctionComponent } from 'react';
import { SourceType } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { EmailHygieneDialog } from './EmailHygieneDialog';
import styles from './ErrorMessage.less';

interface ErrorMessageProps {
  onDismiss?: () => void;
  onClickBack: () => void;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  analyticsContext: object;
  analyticsSource: SourceType;
}

const format = forNamespace(['email hygiene wizard', 'error screen'], {
  shouldEscapeStrings: false,
});

export const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
  onDismiss,
  onClickBack,
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
    isCentered={true}
    analyticsContext={analyticsContext}
    analyticsSource={analyticsSource}
  >
    <h3 className={styles.errorMessage}>{format('main-message')}</h3>
    <p>{format('secondary-message')}</p>

    <div className={styles.buttons}>
      <Button appearance="primary" onClick={onClickBack}>
        {format('start-over-button')}
      </Button>
    </div>
  </EmailHygieneDialog>
);

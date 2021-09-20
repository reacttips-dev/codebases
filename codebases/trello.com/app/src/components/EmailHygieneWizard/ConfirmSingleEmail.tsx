import React, {
  FunctionComponent,
  KeyboardEvent,
  ReactElement,
  useEffect,
  useCallback,
} from 'react';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { idToDate } from '@trello/dates';
import { Button } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';
import { LoginModel } from 'app/gamma/src/types/models';
import { getDateDeltaString } from 'app/gamma/src/util/dates';
import { Spinner } from '@trello/nachos/spinner';
import { EmailError, EmailErrors } from 'app/src/components/EmailError';
import { EmailHygieneDialog } from './EmailHygieneDialog';
import styles from './ConfirmSingleEmail.less';

interface ConfirmSingleEmailProps {
  name: string;
  login: LoginModel;
  isSendingRequest: boolean;
  isSendingNewEmailRequest: boolean;
  isPopoverShown: boolean;
  onDismiss?: () => void;
  onSelectLogin: (login: LoginModel) => void;
  onClickConfirm: () => void;
  changeEmailButton: ReactElement;
  emailErrorMessage?: EmailErrors;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  analyticsContext: object;
  analyticsSource: SourceType;
}

const format = forNamespace(
  ['email hygiene wizard', 'confirm single email screen'],
  { shouldEscapeStrings: false },
);

export const ConfirmSingleEmail: FunctionComponent<ConfirmSingleEmailProps> = ({
  login,
  isSendingRequest,
  isSendingNewEmailRequest,
  isPopoverShown,
  onDismiss,
  onClickConfirm,
  changeEmailButton,
  emailErrorMessage,
  image,
  mobileImage,
  analyticsContext,
  analyticsSource,
}) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isSendingRequest && !isPopoverShown) {
        onClickConfirm();
      }
    },
    [isPopoverShown, isSendingRequest, onClickConfirm],
  );

  useEffect(() => {
    if (isPopoverShown) {
      Analytics.sendScreenEvent({
        name: 'emailHygieneChangeEmailInlineDialog',
        attributes: analyticsContext,
      });
    }
  }, [isPopoverShown, analyticsSource, analyticsContext]);

  return (
    <EmailHygieneDialog
      closeDialog={onDismiss}
      title={format('title')}
      image={image}
      mobileImage={mobileImage}
      onKeyPressCapture={handleKeyPress}
      analyticsContext={analyticsContext}
      analyticsSource={analyticsSource}
    >
      {format('main-message')}
      <div className={styles.singleEmailItem}>
        <div className={styles.singleEmailValue}>{login.email}</div>
        <div className={styles.singleEmailTimestamp}>
          {format('added-date', {
            date: getDateDeltaString(idToDate(login.id), new Date()),
          })}
        </div>
      </div>

      <div className={styles.buttons}>
        {emailErrorMessage && (
          <EmailError error={emailErrorMessage} email={login.email}>
            {(errorMessage) => (
              <div className={styles.emailErrorMessage}>{errorMessage}</div>
            )}
          </EmailError>
        )}

        <Button
          appearance="primary"
          onClick={onClickConfirm}
          isDisabled={isSendingRequest || isSendingNewEmailRequest}
        >
          {format('use-email-button')}
        </Button>

        {changeEmailButton}

        {isSendingRequest && (
          <Spinner small inline={true} wrapperClassName={styles.spinner} />
        )}
      </div>
    </EmailHygieneDialog>
  );
};

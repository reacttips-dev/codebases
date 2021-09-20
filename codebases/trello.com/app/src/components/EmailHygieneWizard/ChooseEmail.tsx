import React, {
  FunctionComponent,
  useState,
  KeyboardEvent,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { forNamespace } from '@trello/i18n';
import { Popover, usePopover } from '@trello/nachos/popover';
import { LoginModel } from 'app/gamma/src/types/models';
import { Spinner } from '@trello/nachos/spinner';
import { EmailError, EmailErrors } from 'app/src/components/EmailError';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { EmailHygieneDialog } from './EmailHygieneDialog';
import { EmailRadioItem } from './EmailRadioItem';
import styles from './ChooseEmail.less';

interface ExtendedLoginModel extends LoginModel {
  hasAa?: boolean;
}

export interface ChooseEmailProps {
  id: string;
  name: string;
  logins: ExtendedLoginModel[];
  selectedLogin?: LoginModel;
  isSendingRequest: boolean;
  isSendingRemoveEmailsRequest: boolean;
  shouldMigrate?: boolean;
  onDismiss?: () => void;
  onSelectLogin: (login: LoginModel) => void;
  onClickConfirm: () => void;
  onRemoveSecondaryEmails: () => void;
  emailErrorMessage?: EmailErrors;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  analyticsContext: object;
  analyticsSource: SourceType;
}

const EMAIL_DISPLAY_LIMIT = 5;

const format = forNamespace(['email hygiene wizard', 'choose email screen'], {
  shouldEscapeStrings: false,
});

export const ChooseEmail: FunctionComponent<ChooseEmailProps> = ({
  id,
  name,
  logins,
  onDismiss,
  selectedLogin,
  isSendingRequest,
  isSendingRemoveEmailsRequest,
  shouldMigrate = true,
  onSelectLogin,
  onClickConfirm,
  onRemoveSecondaryEmails,
  emailErrorMessage,
  image,
  mobileImage,
  analyticsContext,
  analyticsSource,
}) => {
  const [isListExpanded, setListExpanded] = useState(false);
  const { popoverProps, toggle, triggerRef } = usePopover<HTMLButtonElement>({
    onShow: () => {
      Analytics.sendScreenEvent({
        name: 'emailHygieneRemoveSecondaryEmailsInlineDialog',
        attributes: analyticsContext,
      });
    },
  });

  const onClickRemoveEmails = useCallback(() => {
    onRemoveSecondaryEmails();
    Analytics.sendClickedButtonEvent({
      buttonName: 'emailHygieneWizardRemoveSecondaryEmailsButton',
      source: 'emailHygieneRemoveSecondaryEmailsInlineDialog',
      attributes: analyticsContext,
    });
  }, [onRemoveSecondaryEmails, analyticsContext]);

  const displayedLogins =
    isListExpanded || logins.length <= EMAIL_DISPLAY_LIMIT
      ? logins
      : logins.slice(0, EMAIL_DISPLAY_LIMIT - 1);
  const moreLoginCount = logins.length - displayedLogins.length;

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isSendingRequest && !popoverProps.isVisible) {
        onClickConfirm();
      }
    },
    [isSendingRequest, onClickConfirm, popoverProps.isVisible],
  );

  const hasAnyAa = logins.some((l) => l.hasAa);

  const renderMainMessage = () => {
    const mainMessageAddition = (
      <strong className={styles.breakable} key="main-message-addition">
        {format('main-message-addition')}
      </strong>
    );

    if (shouldMigrate) {
      return <p>{format('main-message', { mainMessageAddition })}</p>;
    }
    return (
      <p>{format('main-message-wo-atlassian', { mainMessageAddition })}</p>
    );
  };

  const onClickExpand = useCallback(
    (e) => {
      e.preventDefault();
      setListExpanded(true);
    },
    [setListExpanded],
  );

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
      {renderMainMessage()}
      <p>{format('select-email-text')}</p>
      <div className={styles.emailList}>
        {hasAnyAa && shouldMigrate && (
          <p className={styles.aaLegend}>{format('aa-legend-text')}</p>
        )}
        {displayedLogins.map((login, index) => (
          <EmailRadioItem
            key={`email${index}`}
            login={login}
            disabled={isSendingRequest || isSendingRemoveEmailsRequest}
            checked={!!selectedLogin && login.email === selectedLogin.email}
            onSelectLogin={onSelectLogin}
            showAsterisk={!!login.hasAa && shouldMigrate}
          />
        ))}
        {moreLoginCount > 0 && (
          <div>
            <a
              href="#"
              className={styles.showMoreEmails}
              onClick={onClickExpand}
            >
              {format('show-more-link', { amount: moreLoginCount })}
              <DownIcon
                size="small"
                dangerous_className={styles.showMoreEmailsIcon}
              />
            </a>
          </div>
        )}
      </div>

      <div className={styles.buttons}>
        {emailErrorMessage && (
          <EmailError
            error={emailErrorMessage}
            email={selectedLogin?.email || logins[0].email}
          >
            {(errorMessage) => (
              <div className={styles.emailErrorMessage}>{errorMessage}</div>
            )}
          </EmailError>
        )}

        <Button
          appearance="primary"
          isDisabled={isSendingRequest || isSendingRemoveEmailsRequest}
          onClick={onClickConfirm}
        >
          {format('continue-button')}
        </Button>

        <Button onClick={toggle} isDisabled={isSendingRequest} ref={triggerRef}>
          {format('use-different-email')}
        </Button>
        <Popover {...popoverProps} title={format('use-different-email')}>
          <>
            <div className={styles.popoverContent}>
              {format('remove-secondary-addresses-text')}

              <a
                href="https://help.trello.com/article/773-adding-account-credentials"
                target="_blank"
              >
                {format('remove-secondary-addresses-link-text')}
              </a>

              {isSendingRemoveEmailsRequest && (
                <Spinner
                  small
                  inline={true}
                  wrapperClassName={classNames(styles.spinner, styles.floating)}
                />
              )}

              <Button
                appearance="danger"
                onClick={onClickRemoveEmails}
                isDisabled={isSendingRemoveEmailsRequest}
              >
                {format('remove-secondary-addresses-button')}
              </Button>
            </div>
          </>
        </Popover>

        {isSendingRequest && (
          <Spinner small wrapperClassName={styles.spinner} />
        )}
      </div>

      <div className={styles.profileInformation}>
        <span className={styles.avatar}>
          <MemberAvatar size={56} idMember={id} />
        </span>
        <p title={name}>{name}</p>
        <span title={selectedLogin?.email}>{selectedLogin?.email}</span>
      </div>
    </EmailHygieneDialog>
  );
};

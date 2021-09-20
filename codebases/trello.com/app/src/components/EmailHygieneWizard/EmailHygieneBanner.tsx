import React, {
  FunctionComponent,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';

import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { TrelloStorage } from '@trello/storage';
import { AtlassianIcon } from '@atlaskit/logo';
import { AtlassianBlue200, AtlassianBlue400, Yellow50 } from '@trello/colors';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { Popover, usePopover } from '@trello/nachos/popover';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { useLazyComponent } from '@trello/use-lazy-component';
import { forNamespace } from '@trello/i18n';

import { ChangeEmailButton } from 'app/src/components/ChangeEmailButton';
import { emailErrorMapping, EmailErrors } from 'app/src/components/EmailError';

import { Banner } from 'app/src/components/Banner';
import {
  Overlay,
  OverlayAlignment,
  OverlayBackground,
} from 'app/src/components/Overlay';

import { usePrepMemberForEmailHygieneMutation } from './PrepMemberForEmailHygieneMutation.generated';
import { useEmailHygieneChangeEmailMutation } from './EmailHygieneChangeEmailMutation.generated';

import { useEmailHygieneBanner } from './useEmailHygieneBanner';

import {
  HYGIENE_MESSAGE_ID,
  CHANGE_EMAIL_MESSAGE_ID,
} from './emailHygieneOneTimeMessageIds';
import { REMOVED_SECONDARY_EMAILS_ID } from './emailHygieneStorageIds';

import styles from './EmailHygieneBanner.less';
import { aaMigrationRedirect } from 'app/src/components/AtlassianAccountMigration';
import { noop } from 'app/src/noop';

let analyticsContext: object;

const format = forNamespace(['email hygiene wizard v2', 'banner'], {
  shouldEscapeStrings: false,
});

export const forceEmailHygieneQuery = /[?&]forceHygiene=true/i;

export interface EmailHygieneBannerProps {
  forceShow?: boolean;
  shouldInterruptForHygiene?: boolean;
  shouldMigrate?: boolean;
  hasCompletedHygiene?: boolean;
}

export const EmailHygieneBanner: FunctionComponent<EmailHygieneBannerProps> = ({
  forceShow,
  shouldInterruptForHygiene,
  shouldMigrate,
  hasCompletedHygiene,
}) => {
  const EmailHygieneWizard = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "email-hygiene-wizard" */ './EmailHygieneWizard'
      ),
  );
  const EmailHygieneWizardBlocking = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "email-hygiene-wizard-blocking" */ './EmailHygieneWizardBlocking'
      ),
  );

  const [
    performHygiene,
    hygieneStatus,
  ] = usePrepMemberForEmailHygieneMutation();

  const [
    sendNewEmailRequest,
    newEmailRequestStatus,
  ] = useEmailHygieneChangeEmailMutation();

  const {
    me,
    refetch,
    shouldOverlayAutoOpen,
    shouldShowHygiene,
    shouldShowFinalHygiene,
    dismissFinalHygiene,
  } = useEmailHygieneBanner({
    forceShow,
    shouldInterruptForHygiene,
    hasCompletedHygiene,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isHygieneComplete, setHygieneComplete] = useState(hasCompletedHygiene);
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [emailSendingError, setEmailSendingError] = useState(EmailErrors.None);
  const [changedEmail, setChangedEmail] = useState('');

  const { popoverProps, toggle, triggerRef } = usePopover<HTMLButtonElement>({
    onShow: () => {
      Analytics.sendScreenEvent({
        name: 'emailHygieneRemoveSecondaryEmailsInlineDialog',
        attributes: analyticsContext,
      });
    },
  });

  const isFinalHygieneEnabled = useFeatureFlag(
    'aaaa.final-email-hygiene',
    false,
  );
  const isAaMigrationEnabled = useFeatureFlag('aaaa.web.aa-migration', false);

  const logins = (me && [...me?.logins]) || [];

  const primaryLogin = logins.filter((l) => !!l.primary)[0];
  const secondaryLogins = logins.filter((l) => !l.primary);
  const hasMultipleEmails = !!logins && logins.length > 1;

  useEffect(() => {
    if (hygieneStatus.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [hygieneStatus]);

  const confirmEmail = useCallback(() => {
    if (!primaryLogin) {
      throw new Error('No primary login');
    }

    return performHygiene({
      variables: {
        memberId: 'me',
        primaryLoginId: primaryLogin.id,
        removeLoginIds: secondaryLogins.map((l) => l.id),
        dismissMessage: HYGIENE_MESSAGE_ID,
      },
    }).then(
      (response) => {
        if (hasMultipleEmails) {
          TrelloStorage.set(REMOVED_SECONDARY_EMAILS_ID, 1);
        }
        setHygieneComplete(true);
        aaMigrationRedirect();
      },
      (err) => {
        console.error('Failed to perform hygiene', err);
      },
    );
  }, [primaryLogin, secondaryLogins, performHygiene, hasMultipleEmails]);

  const onClickRemoveSecondaryEmails = useCallback(
    (e) => {
      e.preventDefault();

      confirmEmail().then(toggle);

      Analytics.sendClickedButtonEvent({
        buttonName: 'emailHygieneWizardRemoveSecondaryEmailsButton',
        source: 'emailHygieneRemoveSecondaryEmailsInlineDialog',
        attributes: analyticsContext,
      });
    },
    [confirmEmail, toggle],
  );

  const onClickConfirmEmail = useCallback(
    (e) => {
      e.preventDefault();

      if (hasMultipleEmails) {
        toggle();
      } else {
        confirmEmail();
      }

      Analytics.sendClickedButtonEvent({
        buttonName: 'useThisEmailButton',
        source: 'emailHygieneBanner',
        attributes: analyticsContext,
      });
    },
    [toggle, confirmEmail, hasMultipleEmails],
  );

  const onClickConnectAccount = useCallback((e) => {
    e.preventDefault();
    setOverlayOpen(true);

    Analytics.sendClickedButtonEvent({
      buttonName: 'connectAccountButton',
      source: 'emailHygieneBanner',
      attributes: analyticsContext,
    });
  }, []);

  const changeEmail = useCallback(
    async (email: string) => {
      if (!primaryLogin) {
        throw new Error('No primary login');
      }
      setEmailSendingError(EmailErrors.None);
      try {
        await sendNewEmailRequest({
          variables: {
            loginId: primaryLogin.id,
            email,
            dismissMessage: CHANGE_EMAIL_MESSAGE_ID,
          },
        });
        setChangedEmail(email);
        setOverlayOpen(true);
      } catch (error) {
        const errorMessage = error.networkError
          ? error.networkError.message
          : error.message;
        const knownEmailError = emailErrorMapping(errorMessage);
        if (knownEmailError) {
          setEmailSendingError(knownEmailError);
        } else {
          console.error('Failed to change email', error);
        }
      }

      Analytics.sendClickedButtonEvent({
        buttonName: 'sendConfirmationEmailButton',
        source: 'emailHygieneChangeEmailInlineDialog',
        attributes: analyticsContext,
      });
    },
    [primaryLogin, sendNewEmailRequest],
  );

  const onClickChangeEmail = useCallback(
    (e) => {
      e.preventDefault();

      refetch();
      setOverlayOpen(true);

      Analytics.sendClickedButtonEvent({
        buttonName: 'changeEmailButton',
        source: 'emailHygieneBanner',
        attributes: analyticsContext,
      });
    },
    [refetch],
  );

  const onToggleChangeEmailPopover = useCallback((isPopoverVisible) => {
    if (isPopoverVisible) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'changeEmailButton',
        source: 'emailHygieneBanner',
        attributes: analyticsContext,
      });
      Analytics.sendScreenEvent({
        name: 'emailHygieneChangeEmailInlineDialog',
        attributes: analyticsContext,
      });
    } else {
      Analytics.sendClosedComponentEvent({
        componentType: 'inlineDialog',
        componentName: 'emailHygieneChangeEmailInlineDialog',
        source: 'emailHygieneBanner',
        attributes: analyticsContext,
      });
    }
  }, []);

  const onDismissDialog = useCallback(() => {
    setOverlayOpen(false);
    if (shouldShowFinalHygiene) {
      dismissFinalHygiene();
    }
  }, [dismissFinalHygiene, shouldShowFinalHygiene]);

  // sort by two criteria:
  //   1. primary (to make sure that the current primary email address is on top)
  //   2. ID desc (so that the most recently added addresses will be the highest)
  if (logins) {
    logins.sort(
      (a, b) =>
        (b.primary ? 1 : 0) - (a.primary ? 1 : 0) || b.id.localeCompare(a.id),
    );
  }

  if (!analyticsContext && !!me) {
    analyticsContext = {
      organizationId: null,
      totalEmailAddresses: logins?.length,
      totalClaimableEmailAddresses: logins?.filter((l) => l.claimable).length,
    };
  }

  useEffect(() => {
    if (shouldShowHygiene && !isFinalHygieneEnabled) {
      Analytics.sendViewedBannerEvent({
        bannerName: 'emailHygieneBanner',
        source: getScreenFromUrl(),
        attributes: analyticsContext,
      });
    }
  }, [shouldShowHygiene, isFinalHygieneEnabled]);

  const renderRemoveSecondaryEmailsPopover = () => {
    const helpLink =
      'https://help.trello.com/article/773-adding-account-credentials';

    const emails = secondaryLogins.map(({ email }) => {
      return <li key={email}>{email}</li>;
    });

    const removeSecondaryEmailsButton = (
      <Button
        appearance="danger"
        isDisabled={isLoading}
        shouldFitContainer={true}
        onClick={onClickRemoveSecondaryEmails}
      >
        {format('remove-secondary-emails')}
      </Button>
    );

    return (
      <Popover {...popoverProps} title={format('remove-secondary-emails')}>
        <>
          <div className={styles.popoverContent}>
            <p>
              {format('remove-secondary-emails-text')}{' '}
              <a href={helpLink} target="_blank">
                {format('remove-secondary-emails-link-text')}
              </a>
            </p>
            <p>{format('remove-secondary-emails-text-list')}</p>
            <ul>{emails}</ul>
            {removeSecondaryEmailsButton}
          </div>
        </>
      </Popover>
    );
  };

  const renderButtons = () => {
    const confirmEmailButton = (
      <Button
        appearance="primary"
        className={styles.button}
        isDisabled={isLoading}
        ref={triggerRef}
        onClick={onClickConfirmEmail}
      >
        {format('confirm-email-button')}
      </Button>
    );

    const connectAccountButton = (
      <Button
        appearance="primary"
        className={styles.button}
        isDisabled={isLoading}
        ref={triggerRef}
        onClick={onClickConnectAccount}
      >
        {format('setup-atlassian-account')}
      </Button>
    );

    const secondaryButtonText = format('change-email-button');

    const changeEmailPopoverButton = (
      <ChangeEmailButton
        appearance="subtle-link"
        isDisabled={isLoading}
        onTogglePopover={onToggleChangeEmailPopover}
        isSendingRequest={newEmailRequestStatus.loading}
        isPopoverVisible={isOverlayOpen ? false : null}
        onSubmitEmail={changeEmail}
        emailError={emailSendingError}
      >
        {secondaryButtonText}
      </ChangeEmailButton>
    );

    const changeEmailDialogButton = (
      <Button
        appearance="subtle-link"
        isDisabled={isLoading}
        onClick={onClickChangeEmail}
      >
        {secondaryButtonText}
      </Button>
    );

    const primaryButton = isHygieneComplete
      ? connectAccountButton
      : confirmEmailButton;

    const secondaryButton = hasMultipleEmails
      ? changeEmailDialogButton
      : changeEmailPopoverButton;

    return (
      <div className={styles.actions}>
        {primaryButton}
        {hasMultipleEmails && renderRemoveSecondaryEmailsPopover()}
        {!isHygieneComplete && secondaryButton}
        {isLoading && (
          <Spinner
            inline={true}
            small={true}
            wrapperClassName={classNames(styles.spinner)}
          />
        )}
      </div>
    );
  };

  const renderBanner = () => {
    const email = me?.email || 'unknown';
    const message = format('confirm-email-message', {
      email: <strong key={email}>{email}</strong>,
    });

    return (
      <Banner
        className={styles.banner}
        bannerColor={Yellow50}
        alignCloseTop={true}
        shadow={true}
      >
        <div className={styles.bannerContent}>
          <span className={styles.logo}>
            <AtlassianIcon
              iconColor={AtlassianBlue200}
              iconGradientStart={AtlassianBlue400}
              iconGradientStop={AtlassianBlue200}
            />
          </span>
          <p className={styles.title}>{format('title')}</p>
          <p className={styles.message}>{message}</p>
          {renderButtons()}
        </div>
      </Banner>
    );
  };

  // short-circuit rendering if we don't have member data yet
  if (!me || !logins) {
    return null;
  }

  if (isFinalHygieneEnabled) {
    return (
      <div>
        {shouldOverlayAutoOpen && shouldShowFinalHygiene && (
          <Overlay
            background={OverlayBackground.LIGHT}
            closeOnEscape={false}
            closeOnOutsideClick={false}
            onClose={noop}
            alignment={OverlayAlignment.TOP}
          >
            <Suspense fallback={null}>
              <EmailHygieneWizardBlocking
                id={me.id}
                name={me.fullName || me.username}
                initials={me.initials || undefined}
                avatarUrl={me.avatarUrl || undefined}
                logins={logins}
                hasTwoFactor={!!me.prefs?.twoFactor?.enabled}
                hasCompletedHygiene={isHygieneComplete}
                shouldMigrate={shouldMigrate && isAaMigrationEnabled}
                pendingEmail={changedEmail || undefined}
                onDismiss={onDismissDialog}
                onComplete={onDismissDialog}
                analyticsContext={analyticsContext}
              />
            </Suspense>
          </Overlay>
        )}
      </div>
    );
  }

  return (
    <div>
      {shouldShowHygiene && renderBanner()}
      {isOverlayOpen && (
        <Overlay
          background={OverlayBackground.LIGHT}
          closeOnEscape={false}
          onClose={noop}
          alignment={OverlayAlignment.TOP}
        >
          <Suspense fallback={null}>
            <EmailHygieneWizard
              logins={logins}
              id={me.id}
              name={me.fullName || me.username}
              hasTwoFactor={!!me.prefs?.twoFactor?.enabled}
              hasCompletedHygiene={isHygieneComplete}
              shouldMigrate={isAaMigrationEnabled}
              avatarUrl={me.avatarUrl || undefined}
              initials={me.initials || undefined}
              pendingEmail={changedEmail || undefined}
              onDismiss={onDismissDialog}
              onComplete={onDismissDialog}
              analyticsContext={analyticsContext}
            />
          </Suspense>
        </Overlay>
      )}
    </div>
  );
};

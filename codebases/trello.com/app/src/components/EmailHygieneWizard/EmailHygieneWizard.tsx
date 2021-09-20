/* eslint-disable import/no-default-export */
import React, { useEffect, useState, useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { TrelloStorage } from '@trello/storage';
import { forNamespace } from '@trello/i18n';

import { LoginModel } from 'app/gamma/src/types/models';
import { ChangeEmailButton } from 'app/src/components/ChangeEmailButton';
import { emailErrorMapping, EmailErrors } from 'app/src/components/EmailError';

import { useEmailHygieneChangeEmailMutation } from './EmailHygieneChangeEmailMutation.generated';
import { usePrepMemberForEmailHygieneMutation } from './PrepMemberForEmailHygieneMutation.generated';
import { useAtlassianAccountsLazyQuery } from './AtlassianAccountsQuery.generated';

import { ChooseEmail } from './ChooseEmail';
import { ConfirmationEmailSent } from './ConfirmationEmailSent';
import { ConfirmSingleEmail } from './ConfirmSingleEmail';
import { ErrorMessage } from './ErrorMessage';
import { Success } from './Success';

import {
  HYGIENE_MESSAGE_ID,
  CHANGE_EMAIL_MESSAGE_ID,
} from './emailHygieneOneTimeMessageIds';
import { REMOVED_SECONDARY_EMAILS_ID } from './emailHygieneStorageIds';

import styles from './EmailHygieneWizard.less';
import { aaMigrationRedirect } from 'app/src/components/AtlassianAccountMigration';

export const illustrations = {
  choose: {
    full: require('resources/images/email-hygiene-wizard/illustration-atlassian.svg'),
    mobile: require('resources/images/email-hygiene-wizard/illustration-atlassian-mobile.svg'),
  },
  main: {
    full: require('resources/images/email-hygiene-wizard/illustration-main.svg'),
    mobile: require('resources/images/email-hygiene-wizard/illustration-main-mobile.svg'),
  },
  email: {
    full: require('resources/images/email-hygiene-wizard/illustration-email.svg'),
    mobile: require('resources/images/aa-migration-wizard/illustration-email-mobile.svg'),
  },
  success: {
    full: require('resources/images/email-hygiene-wizard/illustration-ok.svg'),
    mobile: require('resources/images/email-hygiene-wizard/illustration-ok-mobile.svg'),
  },
};

export enum ScreenType {
  CHOOSE_EMAIL = 'chooseEmail',
  CONFIRM_SINGLE_EMAIL = 'confirmSingleEmail',
  CONFIRMATION_EMAIL_SENT = 'confirmationEmailSent',
  SUCCESS = 'success',
  ERROR = 'error',
}

type ExtendedLoginModel = LoginModel & {
  claimable: boolean;
};

export interface EmailHygieneWizardProps {
  analyticsContext: object;
  id: string;
  name: string;
  avatarUrl?: string;
  initials?: string;
  hasTwoFactor: boolean;
  hasCompletedHygiene?: boolean;
  shouldMigrate?: boolean;
  pendingEmail?: string;
  logins: Array<ExtendedLoginModel>;
  onComplete: () => void;
  onDismiss: () => void;
}

const format = forNamespace(['email hygiene wizard', 'dialog'], {
  shouldEscapeStrings: false,
});

const fetchText = async (url: string) => {
  const response = await window.fetch(url);
  if (response?.ok) {
    return response.text();
  }
};

const injectAvatarInSvg = (
  element: HTMLElement,
  initials?: string,
  avatarUrl?: string,
) => {
  const avatarImg = element.querySelector('.replace-avatar');
  if (avatarUrl) {
    if (avatarImg) {
      avatarImg.setAttribute('xlink:href', `${avatarUrl}/170.png`);
    }
  } else {
    if (initials) {
      const initialsTxt = element.querySelector('.replace-initials');
      if (initialsTxt) {
        initialsTxt.innerHTML = initials;
      }
    }
    if (avatarImg) {
      avatarImg.remove();
    }
  }
};

const illustrationMap: Map<string, HTMLDivElement> = new Map();
export const fetchIllustration = (
  src: string,
  initials?: string,
  avatarUrl?: string,
) => {
  const key = `${src}-${initials || ''}-${avatarUrl || ''}`;
  const existing = illustrationMap.get(key);
  if (existing) {
    return existing;
  }
  const illustration = document.createElement('div');
  illustration.className = styles.illustration;
  illustrationMap.set(key, illustration);
  // we do not need to await, as the HTML element has already been created
  fetchText(src).then((content) => {
    if (content) {
      illustration.innerHTML = content;
      injectAvatarInSvg(illustration, initials, avatarUrl);
    }
  });
  return illustration;
};

const getAnalyticsSource = (screen: ScreenType) => {
  switch (screen) {
    case ScreenType.CHOOSE_EMAIL:
      return 'emailHygieneChooseEmailScreen';
    case ScreenType.CONFIRMATION_EMAIL_SENT:
      return 'emailHygieneConfirmationSentScreen';
    case ScreenType.CONFIRM_SINGLE_EMAIL:
      return 'emailHygieneConfirmEmailScreen';
    case ScreenType.ERROR:
      return 'emailHygieneErrorScreen';
    case ScreenType.SUCCESS:
      return 'emailHygieneThanksScreen';
    default:
      return 'unknown';
  }
};

export const EmailHygieneWizard: React.FunctionComponent<EmailHygieneWizardProps> = ({
  analyticsContext,
  id,
  name,
  avatarUrl,
  initials,
  logins,
  hasTwoFactor,
  hasCompletedHygiene,
  shouldMigrate,
  pendingEmail = '',
  onComplete,
  onDismiss,
}) => {
  const [screen, setScreen] = useState(ScreenType.CHOOSE_EMAIL);
  const [emailSendingError, setEmailSendingError] = useState(EmailErrors.None);
  const [selectedLogin, setSelectedLogin] = useState<ExtendedLoginModel>();
  const [changedEmail, setChangedEmail] = useState(pendingEmail);
  const [emailErrorMessage, setEmailErrorMessage] = useState<EmailErrors>(
    EmailErrors.None,
  );
  const hasSelectedLogin = !!selectedLogin;

  const [fetchAa, aaResult] = useAtlassianAccountsLazyQuery();

  const getIllustration = useCallback(
    (src: string) => fetchIllustration(src, initials, avatarUrl),
    [initials, avatarUrl],
  );

  useEffect(() => {
    // preload images
    getIllustration(illustrations.main.full);
    getIllustration(illustrations.email.full);
    getIllustration(illustrations.success.full);
    getIllustration(illustrations.main.mobile);
    getIllustration(illustrations.email.mobile);
    getIllustration(illustrations.success.mobile);
  });

  useEffect(() => {
    if (!hasSelectedLogin) {
      const initialSelectedLogin = logins.find((e) => e.primary) || logins[0];
      setSelectedLogin(initialSelectedLogin);
    }
  }, [hasSelectedLogin, logins]);

  useEffect(() => {
    if (
      logins?.length > 1 &&
      !(aaResult.loading || aaResult.data || aaResult.error)
    ) {
      fetchAa();
    }
  }, [aaResult, fetchAa, logins]);

  const aaValues = aaResult?.data?.atlassianAccounts || [];
  const extendedLogins = logins.map((l, index) => ({
    ...l,
    hasAa: aaValues.some(
      (aa) => aa.email.toLowerCase() === l.email.toLowerCase(),
    ),
  }));

  const [
    performFinalHygiene,
    finalHygieneStatus,
  ] = usePrepMemberForEmailHygieneMutation();
  const [
    performPartialHygiene,
    partialHygieneStatus,
  ] = usePrepMemberForEmailHygieneMutation();
  const [
    sendNewEmailRequest,
    newEmailRequestStatus,
  ] = useEmailHygieneChangeEmailMutation();
  const [isPopoverShown, setPopoverShown] = useState(false);

  let screenToDisplay = screen;

  if (changedEmail) {
    screenToDisplay = ScreenType.CONFIRMATION_EMAIL_SENT;
  } else if (
    screenToDisplay === ScreenType.CHOOSE_EMAIL ||
    screenToDisplay === ScreenType.CONFIRM_SINGLE_EMAIL
  ) {
    screenToDisplay =
      logins.length > 1
        ? ScreenType.CHOOSE_EMAIL
        : ScreenType.CONFIRM_SINGLE_EMAIL;
  }

  useEffect(() => {
    if (hasCompletedHygiene && shouldMigrate) {
      aaMigrationRedirect();
    } else if (hasCompletedHygiene && !shouldMigrate) {
      setScreen(ScreenType.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyticsSource = getAnalyticsSource(screenToDisplay);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: analyticsSource,
      attributes: analyticsContext,
    });
  }, [analyticsSource, analyticsContext]);

  const changeSelectedLogin = useCallback(
    (login: ExtendedLoginModel) => {
      setSelectedLogin(login);
      setEmailErrorMessage(EmailErrors.None);
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'radioButton',
        actionSubjectId: 'emailHygieneWizardEmailItem',
        source: analyticsSource,
        attributes: analyticsContext,
      });
    },
    [analyticsContext, analyticsSource],
  );

  const completeProcess = useCallback(() => {
    onComplete();
    Analytics.sendClosedComponentEvent({
      componentType: 'overlay',
      componentName: 'emailHygieneWizard',
      source: analyticsSource,
      attributes: analyticsContext,
    });
  }, [onComplete, analyticsSource, analyticsContext]);

  const confirmEmail = useCallback(() => {
    if (!selectedLogin) {
      throw new Error('No email selected');
    }
    const removeLoginIds = logins
      .filter((l) => l.id !== selectedLogin.id)
      .map((l) => l.id);

    if (removeLoginIds.length) {
      TrelloStorage.set(REMOVED_SECONDARY_EMAILS_ID, 1);
    }

    setEmailErrorMessage(EmailErrors.None);
    performFinalHygiene({
      variables: {
        memberId: 'me',
        primaryLoginId: selectedLogin.id,
        removeLoginIds,
        dismissMessage: HYGIENE_MESSAGE_ID,
      },
    }).then(
      () => {
        if (!shouldMigrate) {
          setScreen(ScreenType.SUCCESS);
          return;
        } else {
          aaMigrationRedirect();
        }
      },
      (error) => {
        const errorMessage = error.networkError
          ? error.networkError.message
          : error.message;
        const knownEmailError = emailErrorMapping(errorMessage);

        if (knownEmailError) {
          setEmailErrorMessage(knownEmailError);
        } else {
          console.error('Failed to perform hygiene', error);
          setScreen(ScreenType.ERROR);
        }
      },
    );
  }, [logins, performFinalHygiene, selectedLogin, shouldMigrate]);

  const maybeConfirmEmail = useCallback(() => {
    if (!selectedLogin) {
      throw new Error('No email selected');
    }
    confirmEmail();
  }, [confirmEmail, selectedLogin]);

  const removeSecondaryEmails = useCallback(() => {
    if (!selectedLogin) {
      throw new Error('No email selected');
    }

    const removeLoginIds = logins
      .filter((l) => l.id !== selectedLogin.id)
      .map((l) => l.id);

    if (removeLoginIds.length) {
      TrelloStorage.set(REMOVED_SECONDARY_EMAILS_ID, 1);
    }

    setEmailErrorMessage(EmailErrors.None);
    performPartialHygiene({
      variables: {
        memberId: 'me',
        primaryLoginId: selectedLogin.id,
        removeLoginIds,
      },
    }).then(
      () => setScreen(ScreenType.CONFIRM_SINGLE_EMAIL),
      (err) => {
        console.error('Failed to perform hygiene', err);
        setScreen(ScreenType.ERROR);
      },
    );
  }, [logins, performPartialHygiene, selectedLogin]);

  const changeEmail = useCallback(
    async (email: string) => {
      if (!selectedLogin) {
        throw new Error('No email selected');
      }
      setEmailSendingError(EmailErrors.None);
      try {
        await sendNewEmailRequest({
          variables: {
            loginId: selectedLogin.id,
            email,
            dismissMessage: CHANGE_EMAIL_MESSAGE_ID,
          },
        });
        setChangedEmail(email);
        setScreen(ScreenType.CONFIRMATION_EMAIL_SENT);
      } catch (error) {
        const errorMessage = error.networkError
          ? error.networkError.message
          : error.message;
        const knownEmailError = emailErrorMapping(errorMessage);
        if (knownEmailError) {
          setEmailSendingError(knownEmailError);
        } else {
          console.error('Failed to change email', error);
          setScreen(ScreenType.ERROR);
        }
      }
      Analytics.sendClickedButtonEvent({
        buttonName: 'emailHygieneWizardChangeEmailButton',
        source: 'emailHygieneChangeEmailInlineDialog',
        attributes: { ...analyticsContext, dialogScreen: analyticsSource },
      });
    },
    [analyticsContext, analyticsSource, selectedLogin, sendNewEmailRequest],
  );

  const toggleChangeEmailPopover = useCallback(
    (isPopoverVisible: boolean) => {
      setPopoverShown(isPopoverVisible);

      if (isPopoverVisible) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'changeEmailButton',
          source: analyticsSource,
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
          source: analyticsSource,
          attributes: analyticsContext,
        });
      }
    },
    [analyticsContext, analyticsSource],
  );

  const setScreenToChooseEmail = useCallback(
    () => setScreen(ScreenType.CHOOSE_EMAIL),
    [],
  );

  const isFinalHygieneOrMigrationRunning = finalHygieneStatus.loading;

  const changeEmailButton = (
    <ChangeEmailButton
      isDisabled={isFinalHygieneOrMigrationRunning}
      onTogglePopover={toggleChangeEmailPopover}
      isSendingRequest={newEmailRequestStatus.loading}
      onSubmitEmail={changeEmail}
      emailError={emailSendingError}
    >
      {format('change-email')}
    </ChangeEmailButton>
  );

  switch (screenToDisplay) {
    case ScreenType.CHOOSE_EMAIL:
      return (
        <ChooseEmail
          id={id}
          name={name}
          image={getIllustration(illustrations.main.full)}
          mobileImage={getIllustration(illustrations.main.mobile)}
          onDismiss={onDismiss}
          logins={extendedLogins}
          isSendingRequest={isFinalHygieneOrMigrationRunning}
          shouldMigrate={true}
          onClickConfirm={maybeConfirmEmail}
          selectedLogin={selectedLogin}
          onSelectLogin={changeSelectedLogin}
          isSendingRemoveEmailsRequest={partialHygieneStatus.loading}
          onRemoveSecondaryEmails={removeSecondaryEmails}
          emailErrorMessage={emailErrorMessage}
          analyticsContext={analyticsContext}
          analyticsSource={analyticsSource}
        />
      );
    case ScreenType.CONFIRM_SINGLE_EMAIL:
      return (
        <ConfirmSingleEmail
          name={name}
          image={getIllustration(illustrations.choose.full)}
          mobileImage={getIllustration(illustrations.choose.mobile)}
          onDismiss={onDismiss}
          isSendingRequest={isFinalHygieneOrMigrationRunning}
          isSendingNewEmailRequest={newEmailRequestStatus.loading}
          isPopoverShown={isPopoverShown}
          onSelectLogin={changeSelectedLogin}
          login={logins[0]}
          onClickConfirm={maybeConfirmEmail}
          changeEmailButton={changeEmailButton}
          emailErrorMessage={emailErrorMessage}
          analyticsContext={analyticsContext}
          analyticsSource={analyticsSource}
        />
      );
    case ScreenType.CONFIRMATION_EMAIL_SENT:
      return (
        <ConfirmationEmailSent
          image={getIllustration(illustrations.email.full)}
          mobileImage={getIllustration(illustrations.email.mobile)}
          onDismiss={completeProcess}
          changeEmailButton={changeEmailButton}
          email={changedEmail}
          analyticsContext={analyticsContext}
          analyticsSource={analyticsSource}
        />
      );
    case ScreenType.ERROR:
      return (
        <ErrorMessage
          onDismiss={onDismiss} // we want to let the user dismiss the error screen
          onClickBack={setScreenToChooseEmail}
          analyticsContext={analyticsContext}
          analyticsSource={analyticsSource}
        />
      );
    case ScreenType.SUCCESS:
      return (
        <Success
          image={getIllustration(illustrations.success.full)}
          mobileImage={getIllustration(illustrations.success.mobile)}
          onDismiss={completeProcess}
          email={selectedLogin!.email}
          analyticsContext={analyticsContext}
          analyticsSource={analyticsSource}
        />
      );
    default:
      return null;
  }
};

export default EmailHygieneWizard;

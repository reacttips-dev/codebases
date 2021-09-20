/* eslint-disable import/no-default-export */
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import api from 'app/gamma/src/api';
import { useDismissAtlassianAccountRelinkedConfirmationMutation } from '../DismissAtlassianAccountRelinkedConfirmationMutation.generated';
import { usePrepMemberForAtlassianAccountOnboardingMutation } from '../../PrepMemberForAtlassianAccountOnboardingMutation.generated';

import { EmailMismatch } from './EmailMismatch';
import { UpdateAccount } from './UpdateAccount';
import { AtlassianProfile } from './AtlassianProfile';
import { CreatePassword } from './CreatePassword';
import { AutoOnboardingConfirmation } from './AutoOnboardingConfirmation';

import { needsAtlassianAccountRelinkedConfirmation } from '../needsAtlassianAccountRelinkedConfirmation';

import { Analytics } from '@trello/atlassian-analytics';
import { sendCrashEvent } from '@trello/error-reporting';

import styles from './AutoOnboardingOverlayManager.less';

export enum ScreenType {
  ATLASSIAN_PROFILE = 'atlassianAutomaticOnboardingProfileModal',
  AUTOMATIC_MIGRATION_CONFIRMATION = 'atlassianAutomaticOnboardingConfirmationModal',
  UPDATE_ACCOUNT = 'atlassianAutomaticOnboardingUpdateAccountModal',
  EMAIL_MISMATCH = 'atlassianAutomaticOnboardingEmailMismatchModal',
  ACCOUNT_CONFIRMATION = 'atlassianAccountConfirmationModal',
  CREATE_PASSWORD = 'atlassianAutomaticAccountCreatePasswordModal',
}

export interface Login {
  id: string;
  email: string;
}

export const illustrations = {
  intro: {
    full: require('resources/images/email-hygiene-wizard/illustration-atlassian.svg'),
    mobile: require('resources/images/email-hygiene-wizard/illustration-atlassian-mobile.svg'),
  },
  main: {
    full: require('resources/images/email-hygiene-wizard/illustration-main.svg'),
    mobile: require('resources/images/email-hygiene-wizard/illustration-main-mobile.svg'),
  },
  password: {
    full: require('resources/images/email-hygiene-wizard/illustration-password.svg'),
    mobile: require('resources/images/email-hygiene-wizard/illustration-password-mobile.svg'),
  },
  emailMismatch: {
    full: require('resources/images/email-hygiene-wizard/illustration-email-mismatch.svg'),
    mobile: require('resources/images/email-hygiene-wizard/illustration-email-mismatch-mobile.svg'),
  },
};

const analyticsSource = 'atlassianAccountAutomaticOnboardingOverlayV2';

interface AutoOnboardingOverlayManagerProps {
  analyticsContext: object;
  analyticsContainers: object;
  credentialsRemovedCount?: string | null;
  id: string;
  name: string;
  screen: ScreenType | null;
  aaEmail: string;
  logins: Login[];
  oneTimeMessagesDismissed: string[];
  orgName?: string;
  dismiss: () => void;
  setScreen: (screenType: ScreenType) => void;
}

interface AtlassianProfileResponse {
  publicName: string;
  email: string;
  avatarUrl: string;
}

const fetchText = async (url: string) => {
  const response = await window.fetch(url);
  if (response?.ok) {
    return response.text();
  }
};

const injectProfileInSvg = (element: HTMLElement, avatarUrl?: string) => {
  const avatarImg = element.querySelector('.replace-avatar');
  if (avatarImg && avatarUrl) {
    avatarImg.setAttribute('xlink:href', avatarUrl);
  }
};

const illustrationMap: Map<string, HTMLDivElement> = new Map();

export const fetchIllustration = (src: string, avatarUrl?: string) => {
  const key = `${src}-${avatarUrl || ''}`;
  const illustration = document.createElement('div');
  illustration.className = styles.illustration;
  illustrationMap.set(key, illustration);
  // we do not need to await, as the HTML element has already been created
  fetchText(src).then((content) => {
    if (content) {
      illustration.innerHTML = content;
      injectProfileInSvg(illustration, avatarUrl);
    }
  });
  return illustration;
};

export const AutoOnboardingOverlayManager: React.FunctionComponent<AutoOnboardingOverlayManagerProps> = ({
  analyticsContext,
  analyticsContainers,
  screen,
  aaEmail,
  logins,
  oneTimeMessagesDismissed,
  orgName,
  dismiss,
  setScreen,
}) => {
  const [
    dismissAaRelinkedConfirmation,
  ] = useDismissAtlassianAccountRelinkedConfirmationMutation();
  const [removeEmails] = usePrepMemberForAtlassianAccountOnboardingMutation();
  const [atlassianProfileName, setAtlassianProfileName] = useState('');
  const [atlassianProfileEmail, setAtlassianProfileEmail] = useState('');
  const [atlassianAvatarUrl, setAvatarUrl] = useState('');

  const getAtlassianProfile = useCallback(async () => {
    try {
      const response = await api.client.rest.get<AtlassianProfileResponse>(
        `members/me/aaProfile`,
      );
      const { avatarUrl, publicName, email } = response;

      setAvatarUrl(avatarUrl);
      setAtlassianProfileName(publicName);
      setAtlassianProfileEmail(email);
      fetchIllustration(illustrations.main.full, avatarUrl);
    } catch (error) {
      sendCrashEvent(error);
    }
  }, []);

  const getIllustration = useCallback(
    (src: string) => fetchIllustration(src, atlassianAvatarUrl),
    [atlassianAvatarUrl],
  );

  useEffect(() => {
    // preload images
    getIllustration(illustrations.main.full);
    getIllustration(illustrations.main.mobile);
  });

  useEffect(() => {
    getAtlassianProfile();
  }, [getAtlassianProfile]);

  orgName = orgName as string;

  const aaLogin = logins?.find(({ email }) => email === aaEmail);
  const aaLoginId = aaLogin && aaLogin.id;
  const otherLogins = logins?.filter(({ email }) => email !== aaEmail);
  const nonAaLoginIds = otherLogins?.map((login) => login.id);

  const overlayAnalyticsContext = useMemo(() => {
    return {
      ...analyticsContext,
      screen,
    };
  }, [analyticsContext, screen]);

  const onClickUpdateAccount = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      attributes: overlayAnalyticsContext,
      containers: analyticsContainers,
      source: analyticsSource,
      buttonName: 'atlassianAutomaticOnboardingUpdateAccountButton',
    });
    setScreen(ScreenType.ATLASSIAN_PROFILE);
  }, [overlayAnalyticsContext, analyticsContainers, setScreen]);

  const onClickOkAtlassianProfile = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      attributes: overlayAnalyticsContext,
      containers: analyticsContainers,
      source: analyticsSource,
      buttonName: 'atlassianAutomaticOnboardingContinueToCreatePasswordButton',
    });
    setScreen(ScreenType.CREATE_PASSWORD);
  }, [analyticsContainers, overlayAnalyticsContext, setScreen]);

  const onClickOkCreatePassword = useCallback(async () => {
    const mutations = [];
    aaLoginId &&
      mutations.push(
        removeEmails({
          variables: {
            memberId: 'me',
            aaLoginId,
            nonAaLoginIds,
          },
        }),
      );
    needsAtlassianAccountRelinkedConfirmation(oneTimeMessagesDismissed) &&
      mutations.push(
        dismissAaRelinkedConfirmation({
          variables: { messageId: 'aa-relinked-confirmation' },
        }),
      );
    await Promise.all(mutations);
    Analytics.sendClickedButtonEvent({
      attributes: overlayAnalyticsContext,
      containers: analyticsContainers,
      source: analyticsSource,
      buttonName: 'atlassianAutomaticOnboardingContinueToAtlassianButton',
    });
  }, [
    aaLoginId,
    analyticsContainers,
    dismissAaRelinkedConfirmation,
    nonAaLoginIds,
    oneTimeMessagesDismissed,
    overlayAnalyticsContext,
    removeEmails,
  ]);

  const onClickOkAutoOnboardingConfirmation = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      attributes: overlayAnalyticsContext,
      containers: analyticsContainers,
      source: analyticsSource,
      buttonName: 'atlassianOnboardingGotItButton',
    });
    dismiss();
  }, [analyticsContainers, dismiss, overlayAnalyticsContext]);

  const onClickOkEmailMismatch = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      attributes: overlayAnalyticsContext,
      containers: analyticsContainers,
      source: analyticsSource,
      buttonName: 'atlassianAutomaticOnboardingMismatchLoginButton',
    });
    setScreen(ScreenType.EMAIL_MISMATCH);
  }, [analyticsContainers, overlayAnalyticsContext, setScreen]);

  switch (screen) {
    case ScreenType.UPDATE_ACCOUNT:
      return (
        <UpdateAccount
          image={getIllustration(illustrations.intro.full)}
          mobileImage={getIllustration(illustrations.intro.mobile)}
          aaEmail={aaEmail}
          orgName={orgName}
          onDismiss={dismiss}
          onClickUpdateAccount={onClickUpdateAccount}
          analyticsEventName={screen}
          analyticsContext={analyticsContext}
          analyticsContainers={analyticsContainers}
        />
      );
    case ScreenType.ATLASSIAN_PROFILE:
      return (
        <AtlassianProfile
          aaEmail={atlassianProfileEmail}
          name={atlassianProfileName}
          image={getIllustration(illustrations.main.full)}
          mobileImage={getIllustration(illustrations.main.mobile)}
          onDismiss={dismiss}
          orgName={orgName}
          onClickOk={onClickOkAtlassianProfile}
          analyticsEventName={screen}
          analyticsContext={analyticsContext}
          analyticsContainers={analyticsContainers}
        />
      );
    case ScreenType.CREATE_PASSWORD:
      return (
        <CreatePassword
          aaEmail={aaEmail}
          image={getIllustration(illustrations.password.full)}
          mobileImage={getIllustration(illustrations.password.mobile)}
          onDismiss={dismiss}
          onClickOk={onClickOkCreatePassword}
          analyticsEventName={screen}
          analyticsContext={analyticsContext}
          analyticsContainers={analyticsContainers}
        />
      );
    case ScreenType.AUTOMATIC_MIGRATION_CONFIRMATION:
      return (
        <AutoOnboardingConfirmation
          image={getIllustration(illustrations.main.full)}
          mobileImage={getIllustration(illustrations.main.mobile)}
          orgName={orgName}
          onDismiss={dismiss}
          onClickOk={onClickOkAutoOnboardingConfirmation}
          analyticsEventName={screen}
          analyticsContext={analyticsContext}
          analyticsContainers={analyticsContainers}
        />
      );
    case ScreenType.EMAIL_MISMATCH:
      return (
        <EmailMismatch
          aaEmail={aaEmail}
          orgName={orgName}
          image={getIllustration(illustrations.emailMismatch.full)}
          mobileImage={getIllustration(illustrations.emailMismatch.mobile)}
          onDismiss={dismiss}
          onClickLogin={onClickOkEmailMismatch}
          analyticsEventName={screen}
          analyticsContext={analyticsContext}
          analyticsContainers={analyticsContainers}
        />
      );
    default:
      return null;
  }
};

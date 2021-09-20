import { identityBaseUrl } from '@trello/config';
import { AtlassianAccountOnboardingLinks } from '../../AtlassianAccountOnboardingLinks';
import React, {
  FunctionComponent,
  KeyboardEvent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Button } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';
import { AutoOnboardingDialog } from './AutoOnboardingDialog';
import { sendCrashEvent } from '@trello/error-reporting';
import api from 'app/gamma/src/api';
import { Analytics, SourceType } from '@trello/atlassian-analytics';

// eslint-disable-next-line @trello/less-matches-component
import styles from './AutoOnboardingOverlayManager.less';

const format = forNamespace(['aa onboarding', 'dialog'], {
  shouldEscapeStrings: false,
});

interface AtlassianProfileResponse {
  publicName: string;
  email: string;
  avatarUrl: string;
}
interface AutoOnboardingConfirmationProps {
  orgName?: string;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  onClickOk: () => void;
  onDismiss: () => void;
  analyticsEventName: SourceType;
  analyticsContext: object;
  analyticsContainers: object;
}

export const AutoOnboardingConfirmation: FunctionComponent<AutoOnboardingConfirmationProps> = ({
  orgName,
  image,
  mobileImage,
  onClickOk,
  onDismiss,
  analyticsEventName,
  analyticsContext,
  analyticsContainers,
}) => {
  const [atlassianProfileName, setAtlassianProfileName] = useState('');
  const [atlassianProfileEmail, setAtlassianProfileEmail] = useState('');
  const [confirmationDimissed, setConfirmationDismissed] = useState(false);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: analyticsEventName,
      attributes: analyticsContext,
      containers: analyticsContainers,
    });
  }, [analyticsEventName, analyticsContext, analyticsContainers]);

  const closeOverlay = useCallback(() => {
    onDismiss();
    setConfirmationDismissed(true);
  }, [onDismiss]);

  const onClickGotIt = useCallback(() => {
    onClickOk();
    setConfirmationDismissed(true);
  }, [onClickOk]);

  const injectProfileInSvg = (element?: HTMLElement, avatarUrl?: string) => {
    const avatarImg = element?.querySelector('.replace-avatar');
    if (avatarImg && avatarUrl) {
      avatarImg.setAttribute('xlink:href', avatarUrl);
    }
  };

  const getAtlassianProfile = useCallback(async () => {
    try {
      const response = await api.client.rest.get<AtlassianProfileResponse>(
        `members/me/aaProfile`,
      );
      const { avatarUrl, publicName, email } = response;

      setAtlassianProfileName(publicName);
      setAtlassianProfileEmail(email);
      injectProfileInSvg(image, avatarUrl);
      injectProfileInSvg(mobileImage, avatarUrl);
    } catch (error) {
      sendCrashEvent(error);
    }
  }, [image, mobileImage]);

  useEffect(() => {
    getAtlassianProfile();
  }, [getAtlassianProfile]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onClickOk();
      }
    },
    [onClickOk],
  );

  const manageProfileUrl = atlassianProfileEmail
    ? `${identityBaseUrl}/login?login_hint=${encodeURIComponent(
        atlassianProfileEmail,
      )}&continue=${encodeURIComponent(identityBaseUrl + '/manage-profile')}`
    : `${identityBaseUrl}/manage-profile`;

  if (confirmationDimissed) {
    return null;
  }

  return (
    <AutoOnboardingDialog
      closeDialog={closeOverlay}
      title={format('youre all set')}
      image={image}
      mobileImage={mobileImage}
      onKeyPressCapture={handleKeyPress}
    >
      <ul className={styles.atlassianConfirmationBody}>
        <li key={atlassianProfileEmail}>
          <span>
            {format('atlassian confirmation first li', {
              aaEmail: <strong key="email">{atlassianProfileEmail}</strong>,
            })}
          </span>
        </li>
        <li key={orgName}>
          {format('atlassian confirmation second li', { orgName })}{' '}
          <a href={AtlassianAccountOnboardingLinks.TransferBoards}>
            <u> {format('atlassian confirmation leave or transfer')}</u>
          </a>{' '}
          {format('boards not for org', { org: orgName })}
        </li>
        <li key="review your profile">
          <a href={manageProfileUrl}>
            <u> {format('review your atlassian profile')}</u>
          </a>{' '}
          {format('within three days')}
        </li>
      </ul>
      <div className={styles.buttons}>
        <Button appearance="primary" onClick={onClickGotIt}>
          {format('got it')}
        </Button>
      </div>
      <div className={styles.profileInformation}>
        <p> {atlassianProfileName} </p>
        <span> {atlassianProfileEmail} </span>
      </div>
    </AutoOnboardingDialog>
  );
};

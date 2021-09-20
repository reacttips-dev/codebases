import { AutoOnboardingDialog } from './AutoOnboardingDialog';

// eslint-disable-next-line @trello/less-matches-component
import styles from './AutoOnboardingOverlayManager.less';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { forNamespace, forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import api from 'app/gamma/src/api';
import { ProfileSyncResponse } from 'app/gamma/src/types/responses';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { showFlag } from '@trello/nachos/experimental-flags';

const format = forNamespace(['aa onboarding', 'dialog'], {
  shouldEscapeStrings: false,
});

const formatError = forTemplate('app_management');
/**
 * Extracted to allow testing/storybooking this component.
 * Not expecting this property to be overridden by consumers.
 */
const defaultProfileSyncResponseProvider = () => {
  return api.client.rest.post<ProfileSyncResponse>(
    'members/me/atlassianAccount/autoOnboarding',
    {
      query: {
        returnUrl: window.location.pathname,
      },
    },
  );
};

interface CreatePasswordProps {
  aaEmail: string;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  onClickOk: () => Promise<void>;
  onDismiss: () => void;
  analyticsEventName: SourceType;
  analyticsContext: object;
  analyticsContainers: object;
}

export const CreatePassword: FunctionComponent<CreatePasswordProps> = ({
  aaEmail,
  image,
  mobileImage,
  onClickOk,
  onDismiss,
  analyticsEventName,
  analyticsContext,
  analyticsContainers,
}) => {
  const [requiresEmailVerification, setRequiresEmailVerification] = useState(
    false,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: analyticsEventName,
      attributes: analyticsContext,
      containers: analyticsContainers,
    });
  }, [analyticsEventName, analyticsContext, analyticsContainers]);

  const atlassianLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await defaultProfileSyncResponseProvider();
      await onClickOk();
      if (response.emailVerificationRequired) {
        setRequiresEmailVerification(true);
        setIsLoading(false);
      } else {
        window.location.assign(response.redirect_url);
      }
    } catch (err) {
      setIsLoading(false);
      if (err.error_code === 'ALREADY_MASTERED') {
        onDismiss();
        return;
      }
      showFlag({
        id: 'aaProfileSync',
        title: formatError('something-went-wrong'),
        appearance: 'error',
        isAutoDismiss: true,
      });
    }
  }, [onClickOk, onDismiss]);

  if (requiresEmailVerification) {
    return (
      <AutoOnboardingDialog
        title={format('check your inbox')}
        closeDialog={onDismiss}
      >
        <div className={styles.loginWithAtlassianContent}>
          <p>
            {format('we sent an email', {
              email: <strong key="email">{aaEmail}</strong>,
            })}
          </p>
          <p>{format('click the link in the email')}</p>
        </div>
        <div className={styles.section}>
          <Button appearance="primary" onClick={onDismiss}>
            {format('got it')}
          </Button>
        </div>
      </AutoOnboardingDialog>
    );
  }

  return (
    <>
      <AutoOnboardingDialog
        title={format('atlassian create password header')}
        closeDialog={onDismiss}
        image={image}
        mobileImage={mobileImage}
        className={styles.createPasswordImg}
      >
        <div className={styles.createPasswordBody}>
          <p>{format('finish account setup')}</p>
          <p>{format('atlassian create password msg')}</p>
        </div>
        <div className={styles.buttons}>
          <Button
            appearance="primary"
            onClick={atlassianLogin}
            isDisabled={isLoading}
          >
            {format('continue to atlassian')}
          </Button>
        </div>
      </AutoOnboardingDialog>
    </>
  );
};

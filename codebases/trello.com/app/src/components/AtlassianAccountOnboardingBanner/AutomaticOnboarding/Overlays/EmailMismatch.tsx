import { AutoOnboardingDialog } from './AutoOnboardingDialog';

// eslint-disable-next-line @trello/less-matches-component
import styles from './AutoOnboardingOverlayManager.less';
import React, { FunctionComponent, useCallback, useEffect } from 'react';
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
interface EmailMismatchProps {
  aaEmail: string;
  orgName?: string;
  image: HTMLElement;
  mobileImage: HTMLElement;
  onDismiss: () => void;
  onClickLogin: () => void;
  analyticsEventName: SourceType;
  analyticsContext: object;
  analyticsContainers: object;
}

export const EmailMismatch: FunctionComponent<EmailMismatchProps> = ({
  aaEmail,
  orgName,
  image,
  mobileImage,
  onDismiss,
  onClickLogin,
  analyticsEventName,
  analyticsContext,
  analyticsContainers,
}) => {
  const atlassianLogin = useCallback(async () => {
    try {
      const response = await defaultProfileSyncResponseProvider();
      window.location.assign(response.redirect_url);
      onClickLogin();
    } catch (err) {
      showFlag({
        id: 'aaProfileSync',
        title: formatError('something-went-wrong'),
        appearance: 'error',
        isAutoDismiss: true,
      });
    }
  }, [onClickLogin]);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: analyticsEventName,
      attributes: analyticsContext,
      containers: analyticsContainers,
    });
  }, [analyticsEventName, analyticsContext, analyticsContainers]);

  return (
    <>
      <AutoOnboardingDialog
        title={`${format('error title')} ${aaEmail}`}
        closeDialog={onDismiss}
        image={image}
        mobileImage={mobileImage}
        className={styles.emailMismatchTitle}
      >
        <div className={styles.emailMismatchContent}>
          <p>
            {format('error main message', {
              aaEmail: <strong key="aaEmail">{aaEmail}</strong>,
              orgDomain: orgName,
            })}
          </p>
          <p>{format('error second message')}</p>
        </div>
        <div className={styles.section}>
          <Button appearance="primary" onClick={atlassianLogin}>
            {format('log in to atlassian')}
          </Button>
        </div>
      </AutoOnboardingDialog>
    </>
  );
};

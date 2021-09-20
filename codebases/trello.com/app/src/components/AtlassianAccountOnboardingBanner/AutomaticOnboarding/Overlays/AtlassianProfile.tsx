import React, {
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useEffect,
} from 'react';
import { Button } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';
import { AutoOnboardingDialog } from './AutoOnboardingDialog';
import { Analytics, SourceType } from '@trello/atlassian-analytics';

// eslint-disable-next-line @trello/less-matches-component
import styles from './AutoOnboardingOverlayManager.less';

interface AtlassianProfileProps {
  aaEmail: string;
  name: string;
  orgName: string;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  onClickOk: () => void;
  onDismiss?: () => void;
  analyticsEventName: SourceType;
  analyticsContext: object;
  analyticsContainers: object;
}

const format = forNamespace(['aa onboarding', 'dialog'], {
  shouldEscapeStrings: false,
});

export const AtlassianProfile: FunctionComponent<AtlassianProfileProps> = ({
  aaEmail,
  name,
  orgName,
  image,
  mobileImage,
  onClickOk,
  onDismiss,
  analyticsEventName,
  analyticsContext,
  analyticsContainers,
}) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onClickOk();
      }
    },
    [onClickOk],
  );

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: analyticsEventName,
      attributes: analyticsContext,
      containers: analyticsContainers,
    });
  }, [analyticsEventName, analyticsContext, analyticsContainers]);

  return (
    <AutoOnboardingDialog
      closeDialog={onDismiss}
      title={format('new trello atlassian profile')}
      image={image}
      mobileImage={mobileImage}
      onKeyPressCapture={handleKeyPress}
    >
      <ul className={styles.atlassianProfileBody}>
        <li key={aaEmail}>
          {format('atlassian profile first li', {
            aaEmail: <strong key="email">{aaEmail}</strong>,
          })}
        </li>
        <li key="atlassian profile third li">
          {format('atlassian profile third li', { orgName })}
        </li>
        <li key="atlassian profile updated third li">
          {format('atlassian profile updated third li')}
        </li>
      </ul>
      <div className={styles.buttons}>
        <Button appearance="primary" onClick={onClickOk}>
          {format('continue')}
        </Button>
      </div>
      <div className={styles.profileInformation}>
        <p> {name} </p>
        <span> {aaEmail} </span>
      </div>
    </AutoOnboardingDialog>
  );
};

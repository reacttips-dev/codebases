import classNames from 'classnames';
import React, { FunctionComponent, useCallback } from 'react';
import { Button } from '@trello/nachos/button';

import styles from './ManagedAccountDialog.less';
import { Analytics } from '@trello/atlassian-analytics';
import { InformationIcon } from '@trello/nachos/icons/information';
import { CloseIcon } from '@trello/nachos/icons/close';

const WaveImageUrl = require('resources/images/onboarding-banner/Wave.svg');
const TacoImageUrl = require('resources/images/onboarding-banner/Taco.svg');
const ErrorImageUrl = require('resources/images/onboarding-banner/error-and-cloud.svg');

interface DialogProps {
  title: React.ReactNode;
  subtitle?: string;
  helpLink?: string;
  closeDialog?: () => void;
  className?: string;
  showError?: boolean;
}

export const preloadOnboardingImages = () => {
  new Image().src = WaveImageUrl;
  new Image().src = TacoImageUrl;
};

export const ManagedAccountDialog: FunctionComponent<DialogProps> = ({
  title,
  subtitle,
  helpLink,
  children,
  closeDialog,
  className,
  showError,
}) => {
  const onClickHelpLink = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'atlassianManagedAccountHelpLink',
      source: 'atlassianManagedAccountModal',
    });
    window.open(helpLink, '_blank');
  }, [helpLink]);

  const onClickClose = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      source: 'atlassianManagedAccountModal',
      buttonName: 'atlassianManagedAccountOverlayCloseButton',
    });
    closeDialog && closeDialog();
  }, [closeDialog]);

  return (
    <div className={styles.dialog}>
      <div className={styles.controls}>
        {helpLink && (
          <Button
            iconBefore={<InformationIcon size="large" />}
            className={styles.icon}
            color={'dark'}
            onClick={onClickHelpLink}
          />
        )}
        {closeDialog && (
          <Button
            iconBefore={<CloseIcon size="large" />}
            className={styles.icon}
            color={'dark'}
            onClick={onClickClose}
          />
        )}
      </div>
      <div className={classNames(styles.dialogContent, className)}>
        <header className={styles.header}>
          <h2 className={styles.dialogTitle}>
            {title}
            {subtitle ? <div>{subtitle}</div> : undefined}
          </h2>
        </header>
        <div className={styles.dialogBody}>{children}</div>
      </div>
      <img alt="" src={WaveImageUrl} className={styles.dialogWave} />
      {showError && (
        <img alt="" src={ErrorImageUrl} className={styles.dialogError} />
      )}
      {!showError && (
        <img alt="" src={TacoImageUrl} className={styles.dialogTaco} />
      )}
    </div>
  );
};

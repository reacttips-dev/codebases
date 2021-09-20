import React from 'react';
import classNames from 'classnames';
import styles from './UpgradePromptFullBase.less';
import { CloseIcon } from '@trello/nachos/icons/close';

/**
 * UpgradePromptFull props
 *
 * content: prompt copy, optionally rendered
 * cta: call to action of prompt
 * headline: prompt header
 * iconName: name of icon
 * isDarkTheme: controls dark theme
 * onDismiss: function expected to unmount prompt and make dismissal persistent for the user
 */

interface UpgradePromptFullProps {
  className?: string;
  content?: React.ReactNode;
  cta: React.ReactNode;
  headline: React.ReactNode;
  icon: JSX.Element;
  isDarkTheme?: boolean;
  onDismiss?: () => void;
  loading?: boolean;
  allowUpsell?: boolean;
}

export const UpgradePromptFullBase: React.FunctionComponent<UpgradePromptFullProps> = ({
  loading,
  className,
  content,
  cta,
  headline,
  icon,
  isDarkTheme,
  onDismiss,
  allowUpsell,
}) => {
  const promptClasses = classNames(
    styles.upgradePromptFull,
    isDarkTheme
      ? styles.upgradePromptFullDarkTheme
      : styles.upgradePromptFullLightTheme,
    className,
  );

  if (loading) {
    return <div className={styles.animation}></div>;
  }

  return (
    <div className={promptClasses}>
      <div className={styles.upgradePromptFullHeadline}>{headline}</div>
      <div className={styles.upgradePromptFullContent}>{content}</div>
      {cta}
      <div className={styles.upgradePromptFullIconBackground}>
        {React.cloneElement(icon, {
          dangerous_className: styles.upgradePromptFullIcon,
        })}
      </div>
      <div className={styles.upgradePromptFullIconClippedBackground} />
      {onDismiss && (
        <button
          className={styles.upgradePromptFullCloseButtonWrapper}
          onClick={onDismiss}
        >
          <CloseIcon
            size="small"
            dangerous_className={styles.upgradePromptFullCloseButton}
          />
        </button>
      )}
    </div>
  );
};

import React from 'react';
import classNames from 'classnames';
import styles from './UpgradePromptButtonBase.less';
import { BusinessClassIcon } from '@trello/nachos/icons/business-class';

/**
 * UpgradePromptButton props
 *
 * cta: call to action of prompt, navigates user within the page
 * ctaLink: link for call to action
 * ctaOnClick: function expected to fire side-effects like a trackUe event,
 *             fired on click of cta
 * isDarkTheme: controls dark theme
 */

interface UpgradePromptButtonProps {
  cta: string;
  ctaLink?: string;
  ctaOnClick?: () => void;
  isDarkTheme?: boolean;
  shouldFitContainer?: boolean;
  openInNewTab?: boolean;
  allowUpsell?: boolean;
  testId?: string;
}

export const UpgradePromptButtonBase: React.FunctionComponent<UpgradePromptButtonProps> = ({
  cta,
  ctaLink,
  ctaOnClick,
  isDarkTheme,
  shouldFitContainer,
  openInNewTab,
  testId,
}) => {
  const onClickCTA = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (ctaOnClick) {
      ctaOnClick();
    }
  };

  const promptClasses = classNames(styles.upgradePromptButton, {
    [styles.upgradePromptButtonDarkTheme]: isDarkTheme,
    [styles.upgradePromptButtonLightTheme]: !isDarkTheme,
    [styles.upgradePromptFitContainer]: shouldFitContainer,
  });

  return (
    <button
      data-test-id={testId}
      className={promptClasses}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={onClickCTA}
    >
      <div className={styles.upgradePromptButtonIconBackground}>
        <BusinessClassIcon
          size="small"
          dangerous_className={styles.upgradePromptButtonIcon}
        />
      </div>
      <div className={styles.upgradePromptButtonCTA}>{cta}</div>
    </button>
  );
};

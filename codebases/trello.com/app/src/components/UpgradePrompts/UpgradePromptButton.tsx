import React from 'react';
import classNames from 'classnames';
import styles from './UpgradePromptButton.less';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { dontUpsell } from '@trello/browser';

/**
 * UpgradePromptButton props
 *
 * cta: call to action of prompt, navigates user within the page
 * ctaLink: link for call to action
 * ctaOnClick: function expected to fire side-effects like a trackUe event,
 *             fired on click of cta
 * icon: the icon to render
 * isDarkTheme: controls dark theme
 */

interface UpgradePromptButtonProps {
  cta: string;
  ctaLink: string;
  ctaOnClick?: () => void;
  icon?: JSX.Element;
  isDarkTheme?: boolean;
  shouldFitContainer?: boolean;
  openInNewTab?: boolean;
  allowUpsell?: boolean;
  testId?: string;
}

export const UpgradePromptButton: React.FunctionComponent<UpgradePromptButtonProps> = ({
  cta,
  ctaLink,
  ctaOnClick,
  icon,
  isDarkTheme,
  shouldFitContainer,
  openInNewTab,
  allowUpsell,
  testId,
}) => {
  if (dontUpsell() && !allowUpsell) {
    return null;
  }

  const onClickCTA = () => {
    if (ctaOnClick) {
      ctaOnClick();
    }
  };

  const promptClasses = classNames(
    styles.upgradePromptButton,
    isDarkTheme
      ? styles.upgradePromptButtonDarkTheme
      : styles.upgradePromptButtonLightTheme,
    shouldFitContainer && styles.upgradePromptFitContainer,
  );

  let ClickableComponent = ctaLink === '/business-class' ? 'a' : RouterLink;

  if (!ctaLink) {
    ClickableComponent = 'button';
  }

  return (
    <ClickableComponent
      data-test-id={testId}
      href={ctaLink}
      className={promptClasses}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={onClickCTA}
      {...(openInNewTab ? { target: '_blank' } : {})}
    >
      {icon !== undefined && (
        <div className={styles.upgradePromptButtonIconBackground}>
          {React.cloneElement(icon, {
            dangerous_className: styles.upgradePromptButtonIcon,
            size: 'small',
          })}
        </div>
      )}
      <div className={styles.upgradePromptButtonCTA}>{cta}</div>
    </ClickableComponent>
  );
};

export const UpgradePromptButtonConnected: React.FunctionComponent<UpgradePromptButtonProps> = (
  props,
) => (
  <ComponentWrapper>
    <UpgradePromptButton {...props} />
  </ComponentWrapper>
);

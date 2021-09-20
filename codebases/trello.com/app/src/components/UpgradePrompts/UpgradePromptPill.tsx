import React from 'react';
import classNames from 'classnames';
import styles from './UpgradePromptPill.less';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { dontUpsell } from '@trello/browser';

/**
 * UpgradePromptPillProps props
 * isDarkTheme: For dark theme
 * cta: call to action of prompt, navigates user within the page
 * ctaLink: link for call to action
 * ctaLinkOpenNewTab: opens the link for call to action in a new tab
 * ctaOnClick: function expected to fire side-effects like a trackUe event,
 *             fired on click of cta
 */
interface UpgradePromptPillProps {
  isDarkTheme?: boolean;
  allowUpsell?: boolean;
  cta: string;
  ctaLink?: string;
  ctaLinkOpenNewTab?: boolean;
  ctaOnClick?: () => void;
  testId?: string;
  icon: JSX.Element;
}

export const UpgradePromptPill: React.FunctionComponent<UpgradePromptPillProps> = ({
  isDarkTheme,
  cta,
  ctaLink,
  ctaLinkOpenNewTab,
  ctaOnClick,
  icon,
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

  const upgradePromptPillClasses = classNames(
    styles.upgradePromptPill,
    isDarkTheme ? styles.upgradeDarkTheme : styles.upgradeLightTheme,
  );

  const LinkComponent =
    ctaLink === '/business-class' || ctaLink === '/enterprise'
      ? 'a'
      : RouterLink;

  const pillContent = (
    <>
      {React.cloneElement(icon, {
        dangerous_className: styles.upgradePromptPillIcon,
        size: 'small',
      })}
      <div className={styles.upgradePromptPillCTA}>{cta}</div>
    </>
  );

  if (!ctaLink) {
    return (
      <button
        className={upgradePromptPillClasses}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onClickCTA}
        data-test-id={testId}
      >
        {pillContent}
      </button>
    );
  }

  return (
    <LinkComponent
      href={ctaLink}
      {...(ctaLinkOpenNewTab
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className={upgradePromptPillClasses}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={onClickCTA}
      data-test-id={testId}
    >
      {pillContent}
    </LinkComponent>
  );
};

export const UpgradePromptPillConnected: React.FunctionComponent<UpgradePromptPillProps> = (
  props,
) => (
  <ComponentWrapper>
    <UpgradePromptPill {...props} />
  </ComponentWrapper>
);

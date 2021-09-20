import { Analytics } from '@trello/atlassian-analytics';
import { SourceType } from '@trello/atlassian-analytics/src/constants/Source';
import React, { useState } from 'react';
import classNames from 'classnames';
import { CloseIcon } from '@trello/nachos/icons/close';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { Button } from '@trello/nachos/button';
import { PlanSelectionOverlay } from 'app/src/components/FreeTrial';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import styles from './UpgradePromptFull.less';
import { isDesktop, dontUpsell } from '@trello/browser';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';
import { forNamespace } from '@trello/i18n';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';

const formatFreeTrialPrompt = forNamespace([
  'free trial existing',
  'upgrade prompt',
]);

/**
 * UpgradePromptFull props
 *
 * content: prompt copy, optionally rendered
 * cta: call to action of prompt, navigates user within the page
 * ctaLink: link for call to action
 * ctaOnClick: function expected to fire side-effects like a trackUe event,
 *             fired on click of cta
 * hidePlanOverlay: will use a link for CTA instead of showing the overlay
 * headline: prompt header
 * iconName: name of icon
 * isDarkTheme: controls dark theme
 * isDismissable: optonially renders close button
 * onDismiss: function expected to unmount prompt and make dismissal persistent for the user
 */

interface UpgradePromptFullProps {
  className?: string;
  content?: string;
  cta: string;
  ctaLink?: string;
  ctaOnClick?: () => void;
  hidePlanOverlay?: boolean;
  headline: string;
  icon: JSX.Element;
  isDarkTheme?: boolean;
  isDismissable?: boolean;
  onDismiss?: () => void;
  allowUpsell?: boolean;
  orgId?: string;
  source: SourceType;
  testId?: string;
}

export const UpgradePromptFull: React.FunctionComponent<UpgradePromptFullProps> = ({
  allowUpsell,
  className,
  content,
  cta,
  ctaLink,
  ctaOnClick,
  headline,
  hidePlanOverlay,
  icon,
  isDarkTheme,
  isDismissable,
  onDismiss,
  orgId,
  source,
  testId,
}) => {
  const { isEligible } = useFreeTrialEligibilityRules(orgId);
  const isFreeTrialUpgradePrompt = isEligible;
  const [showPlanOverlay, togglePlanOverlay] = useState(false);
  const closeOverlay = () => togglePlanOverlay(false);
  const openOverlay = () => togglePlanOverlay(true);

  const onClickCTA = () => {
    if (!hidePlanOverlay) {
      openOverlay();
    }

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'prompt',
      actionSubjectId: 'bcUpgradePrompt',
      source,
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        feature: isFreeTrialUpgradePrompt ? 'freeTrial' : undefined,
      },
    });

    if (ctaOnClick) {
      ctaOnClick();
    }
  };

  const promptClasses = classNames(
    styles.upgradePromptFull,
    isDarkTheme
      ? styles.upgradePromptFullDarkTheme
      : styles.upgradePromptFullLightTheme,
    className,
  );

  const contentBlock = content && (
    <div className={styles.upgradePromptFullContent}>{content}</div>
  );

  const closeButton = isDismissable && (
    <button
      className={styles.upgradePromptFullCloseButtonWrapper}
      onClick={onDismiss}
    >
      <CloseIcon
        dangerous_className={styles.upgradePromptFullCloseButton}
        size="small"
      />
    </button>
  );

  const LinkComponent = ctaLink === '/business-class' ? 'a' : RouterLink;

  if (dontUpsell() && !allowUpsell) {
    return null;
  }

  const ctaCopy = isFreeTrialUpgradePrompt ? formatFreeTrialPrompt('cta') : cta;

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: Feature.UpgradePrompt,
      }}
    >
      <div className={promptClasses}>
        <div className={styles.upgradePromptFullHeadline}>{headline}</div>
        {contentBlock}
        {hidePlanOverlay ? (
          <LinkComponent
            href={ctaLink}
            className={styles.upgradePromptFullCTA}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={onClickCTA}
            data-test-id={testId}
            target={
              isDesktop() && ctaLink === '/business-class'
                ? '_blank'
                : undefined
            }
          >
            {ctaCopy}
          </LinkComponent>
        ) : (
          <Button
            appearance="link"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={onClickCTA}
            data-test-id={testId}
            className={styles.upgradePromptFullCTA}
          >
            {ctaCopy}
          </Button>
        )}
        {!hidePlanOverlay && showPlanOverlay && orgId && (
          // eslint-disable-next-line react/jsx-no-bind
          <PlanSelectionOverlay onClose={closeOverlay} orgId={orgId} />
        )}
        <div className={styles.upgradePromptFullIconBackground}>
          {React.cloneElement(icon, {
            dangerous_className: styles.upgradePromptFullIcon,
            size: 'medium',
          })}
        </div>
        <div className={styles.upgradePromptFullIconClippedBackground} />
        {closeButton}
      </div>
    </ErrorBoundary>
  );
};

export const UpgradePromptFullConnected: React.FunctionComponent<UpgradePromptFullProps> = (
  props,
) => (
  <ComponentWrapper>
    <UpgradePromptFull {...props} />
  </ComponentWrapper>
);

import { forTemplate } from '@trello/i18n';
import React from 'react';
import { arrayRange } from 'app/gamma/src/util/array-range';
import styles from './UpgradePromptBanner.less';
import { dontUpsell } from '@trello/browser';
import { Button } from '@trello/nachos/button';
import { useUpgradePromptRules } from './useUpgradePromptRules';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial';
import { Analytics } from '@trello/atlassian-analytics';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

const format = forTemplate('paid_product_info');

export enum UpgradePromptBannerType {
  BusinessClass = 'business-class',
  BusinessClassUpgrade = 'business-class-upgrade',
  Gold = 'gold',
}

interface UpgradePromptBannerProps {
  type: UpgradePromptBannerType;
  orgId?: string;
  infoUrl: string;
  subtitleCount?: number;
  epilogueCount?: number;
  allowUpsell?: boolean;
}

const featureImagesMapping = {
  'business-class': [
    require('resources/images/business-class/feature-boards.svg'),
    require('resources/images/business-class/feature-powerups.svg'),
    require('resources/images/business-class/feature-butler.svg'),
    require('resources/images/business-class/feature-control.svg'),
  ],
  'business-class-upgrade': [
    require('resources/images/business-class-feature-boards.png'),
    require('resources/images/business-class-feature-integration.png'),
    require('resources/images/business-class-feature-roadmap.png'),
  ],
  gold: [
    require('resources/images/business-class-feature-boards.png'),
    require('resources/images/business-class-feature-integration.png'),
    require('resources/images/business-class-feature-roadmap.png'),
  ],
};

export const UpgradePromptBannerUnconnected: React.FC<UpgradePromptBannerProps> = ({
  type,
  orgId,
  infoUrl,
  subtitleCount = 0,
  epilogueCount = 0,
  allowUpsell,
}) => {
  // We're using the upgrade prompt hook
  // just to get a consistent way to render plan selection.
  // The Banner has some edge cases that prevent
  // us from using most of the hook, though
  const { openPlanSelection } = useUpgradePromptRules(orgId, '', {
    skip: type !== 'business-class',
  });
  const { isEligible } = useFreeTrialEligibilityRules(orgId, {
    skip: type !== 'business-class',
  });

  // We still need this conditional since
  // the banner still wants to show on desktop
  // This shouldn't be needed during the 2nd pass
  // on the UpgradeSmartComponent
  if (dontUpsell() && !allowUpsell) {
    return null;
  }

  const features = type === 'business-class' ? 4 : 3;
  const trackBCLink = () => {
    Analytics.sendClickedLinkEvent({
      linkName: 'seeAllBenefitsLink',
      source:
        type === 'gold' ? 'memberBillingScreen' : 'workspaceBillingScreen',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  };

  if (type !== 'business-class-upgrade' && epilogueCount > 1) {
    throw new Error(
      'Only use epilogueCount with the type business-class-upgrade',
    );
  }

  let showFreeTrialButton = false;
  let onFreeTrialClick = () => {};

  if (orgId && isEligible) {
    showFreeTrialButton = true;
    onFreeTrialClick = () => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'bcUpgradePrompt',
        source: 'workspaceBillingScreen',
        containers: {
          organization: {
            id: orgId,
          },
        },
        attributes: {
          isFreeTrial: isEligible,
          promptId: 'billingPageFreeTrialBannerButton',
        },
      });
      openPlanSelection();
    };
  }

  return (
    <div className={styles.upgradePromptBanner}>
      <header>
        <h2>{format([type, 'title'])}</h2>
        {subtitleCount > 0 &&
          arrayRange(0, subtitleCount - 1).map((i) => (
            <p key={`subtitles-${i}`}>
              {format([type, 'subtitles', i.toString()])}
            </p>
          ))}
      </header>

      <div className={styles.features}>
        {arrayRange(0, features - 1).map((i) => (
          <div className={styles.feature} key={`features-${i}`}>
            <img
              src={featureImagesMapping[type][i]}
              alt={format([type, 'featureHeaders', i.toString()])}
            />
            <h3>{format([type, 'featureHeaders', i.toString()])}</h3>
            <p>{format([type, 'featureBodies', i.toString()])}</p>
          </div>
        ))}
      </div>

      {epilogueCount > 0 && (
        <div className={styles.epilogue}>
          {arrayRange(0, epilogueCount - 1).map((i) => (
            <p key={`epilogue-${i}`}>
              {format(
                [type, 'epilogue recent', i.toString()],
                i === 1
                  ? {
                      smartBilling: (
                        <strong key="smartBilling">
                          {format('smartBilling')}
                        </strong>
                      ),
                    }
                  : {},
              )}
            </p>
          ))}
        </div>
      )}

      {showFreeTrialButton && (
        <Button
          className={styles.freeTrialButton}
          appearance="primary"
          onClick={onFreeTrialClick}
        >
          {format([type, 'startFreeTrial'])}
        </Button>
      )}

      <div>
        <a
          href={infoUrl}
          target="_blank"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={trackBCLink}
        >
          {format([type, 'link'])}
        </a>
      </div>
    </div>
  );
};

export const UpgradePromptBanner: React.FC<UpgradePromptBannerProps> = (
  props,
) => (
  <ComponentWrapper>
    <UpgradePromptBannerUnconnected {...props} />
  </ComponentWrapper>
);

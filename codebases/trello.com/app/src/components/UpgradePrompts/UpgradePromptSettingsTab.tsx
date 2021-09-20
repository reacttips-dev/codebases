import React, { useCallback } from 'react';
import { forTemplate } from '@trello/i18n';
import classNames from 'classnames';
import styles from './UpgradePromptSettingsTab.less';
import { useUpgradePromptRules } from './useUpgradePromptRules';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { Button } from '@trello/nachos/button';
import { Analytics } from '@trello/atlassian-analytics';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';
import { Tooltip, TooltipPrimitiveLight } from '@trello/nachos/tooltip';

const format = forTemplate('org_account');
const stars = require('resources/images/stars.svg');
interface ComponentProps {
  orgId: string;
  billingUrl: string;
  isStandard: boolean;
  isAdmin: boolean;
}

export const UpgradePromptSettingsTab: React.FC<ComponentProps> = ({
  billingUrl,
  orgId,
  isAdmin,
  isStandard,
}) => {
  const buttonUrl = isAdmin ? billingUrl : '/business-class';
  const buttonText = isStandard || isAdmin ? 'ads-upgrade' : 'ads-learn-more';

  const { openPlanSelection } = useUpgradePromptRules(
    orgId,
    `upgrade-prompt-settings-tab-${orgId}`,
  );

  const { isEligible } = useFreeTrialEligibilityRules(orgId);

  const onClick = useCallback(() => {
    openPlanSelection();

    Analytics.sendClickedButtonEvent({
      buttonName: 'bcUpgradePrompt',
      source: 'teamSettingsScreen',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        isFreeTrial: !!isEligible,
        promptId: 'teamSettingsButton',
      },
    });
  }, [openPlanSelection, orgId, isEligible]);

  const isStandardLinkDisabled = isStandard && !isAdmin;

  return (
    <div
      className={classNames(
        'window-module',
        'u-clearfix',
        styles.bcPromptHeader,
      )}
    >
      <div className={classNames('setting-item', styles.settingItem)}>
        <div className={styles.bcPromptSparkle}>
          <img alt="sparkle" src={stars} />
        </div>

        <div className="setting-item-detail">
          {format('more-settings', {
            boldTextUpgradeToBc: (
              <strong key="bold-text-upgrade-to-bc">
                {format('bold-text-upgrade-to-bc')}
              </strong>
            ),
          })}
        </div>

        <div className="setting-item-action">
          {!isStandard ? (
            // eslint-disable-next-line react/jsx-no-bind
            <Button appearance="primary" onClick={onClick} shouldFitContainer>
              {format(buttonText)}
            </Button>
          ) : isStandardLinkDisabled ? (
            <Tooltip
              content={format('tooltip-contact-admin-to-upgrade')}
              component={TooltipPrimitiveLight}
            >
              <span
                className={styles.tooltipDisabledHack}
                tabIndex={0}
                role="button"
              >
                <Button appearance="primary" isDisabled shouldFitContainer>
                  {format(buttonText)}
                </Button>
              </span>
            </Tooltip>
          ) : (
            <a
              className={classNames(
                'primary',
                'button-link',
                'u-text-align-center',
                styles.bcPromptUpgrade,
              )}
              href={buttonUrl}
            >
              {format(buttonText)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const UpgradePromptSettingsTabConnected: React.FC<ComponentProps> = (
  props,
) => (
  <ComponentWrapper>
    <UpgradePromptSettingsTab {...props} />
  </ComponentWrapper>
);

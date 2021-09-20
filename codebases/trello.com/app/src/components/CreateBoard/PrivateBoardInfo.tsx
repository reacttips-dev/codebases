import { forNamespace } from '@trello/i18n';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import React, { useCallback } from 'react';
import styles from './PrivateBoardInfo.less';
import { useUpgradePromptRules } from 'app/src/components/UpgradePrompts/useUpgradePromptRules';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';
import { Analytics } from '@trello/atlassian-analytics';
import { useStandard } from 'app/src/components/StandardGenerics';
import { useFeatureFlag } from '@trello/feature-flag-client';

const format = forNamespace('private board limit info', {
  shouldEscapeStrings: false,
});

interface PrivateBoardInfoProps {
  orgName: string;
  orgId: string;
  orgProduct?: number;
  upgradeUrl: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

interface PrivateBoardInfoTextProps {
  orgName: string;
  orgId: string;
  openPlanSelection: () => void;
  isEligible: boolean;
  isStandardVariationEnabled: boolean;
  isRepackagedGtm: boolean;
}

// It seems like this function is needed because of a weird JSX parsing edge case.
const PrivateBoardInfoText: React.FC<PrivateBoardInfoTextProps> = ({
  orgName,
  orgId,
  openPlanSelection,
  isEligible,
  isStandardVariationEnabled,
  isRepackagedGtm,
}) => {
  const openPlanSelectionWithAnalytics = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'bcUpgradePrompt',
      source: 'teamScreen',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        promptId: 'privateTeamBoardToolTipUpgradeLink',
        isFreeTrial: isEligible,
      },
    });

    openPlanSelection();
  }, [openPlanSelection, orgId, isEligible]);

  if (isStandardVariationEnabled || isRepackagedGtm) {
    return (
      <>
        {format('private board gtm')}
        <div>
          <a
            key="upgrade-link"
            href="#"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={openPlanSelectionWithAnalytics}
          >
            {isEligible ? format('start free trial') : format('upgrade now')}
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      {format('private board', {
        upgradeLink: (
          <a
            key="upgrade-link"
            href="#"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={openPlanSelectionWithAnalytics}
          >
            {format('upgrade to business class', { orgName })}
          </a>
        ),
      })}
    </>
  );
};

export const PrivateBoardInfo: React.FunctionComponent<PrivateBoardInfoProps> = ({
  onMouseEnter,
  onMouseLeave,
  orgId,
  orgProduct,
  orgName,
}) => {
  const { openPlanSelection } = useUpgradePromptRules(orgId);
  const { isEligible } = useFreeTrialEligibilityRules(orgId);
  const { isStandardVariationEnabled } = useStandard({ orgId });
  const isRepackagedGtm = useFeatureFlag(
    'nusku.repackaging-gtm.features',
    false,
  );

  return (
    <div
      className={styles.whiteBox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <PrivateBoardInfoText
        orgId={orgId}
        orgName={orgName}
        openPlanSelection={openPlanSelection}
        isEligible={!!isEligible}
        isStandardVariationEnabled={isStandardVariationEnabled}
        isRepackagedGtm={isRepackagedGtm}
      />
    </div>
  );
};

export const PrivateBoardInfoConnected: React.FC<PrivateBoardInfoProps> = (
  props,
) => (
  <ComponentWrapper>
    <PrivateBoardInfo {...props} />
  </ComponentWrapper>
);

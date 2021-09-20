import React from 'react';
import classNames from 'classnames';
import styles from './MiniPlanOverviewSection.less';
import { Tooltip, TooltipPrimitiveLight } from '@trello/nachos/tooltip';
import {
  freeTeamSelectionList,
  nuSkuFreeTeamSelectionList,
  freeFeatureList,
  staTeamSelectionList,
  standardFeatureList,
  bcPlanSelectionList,
  nuSkuBcPlanSelectionList,
  premiumFeatureList,
  FeatureListItem,
} from './getPlanFeatureStrings';
import { forNamespace, forTemplate } from '@trello/i18n';
import { useFeatureFlag } from '@trello/feature-flag-client';

// TODO: after GTM, remove old strings and only use template file
const formatNamespace = forNamespace(
  'upgrade-prompt-plan-selection-consolidated',
);
const formatTemplate = forTemplate('mini_plan_comparison');

export const renderTooltip = (
  tooltip: string | null,
  target: React.ReactNode,
) =>
  tooltip ? (
    <Tooltip content={tooltip} component={TooltipPrimitiveLight}>
      {target}
    </Tooltip>
  ) : (
    target
  );

interface MiniPlanOverviewSectionProps {
  plan: 'free' | 'standard' | 'premium';
  isStandardVariationEnabled?: boolean;
}

interface GetPlanDetailsParams extends MiniPlanOverviewSectionProps {
  isRepackagedGtm: boolean;
}

interface PlanOverviewDetails {
  list: FeatureListItem[];
  header: string;
  subtext?: string;
  subtextClassNames?: string;
  // TODO: remove containerClassNames after GTM as there will be no requirement for the individual plan boxes to have different styles
  containerClassNames: string;
}

const usePlanDetails = ({
  plan,
  isStandardVariationEnabled,
  isRepackagedGtm,
}: GetPlanDetailsParams): PlanOverviewDetails | undefined => {
  // 3 scenarios for gathering plan details: standard variation, gtm, and classic
  if (isRepackagedGtm) {
    // gtm details - this will be the only section we need to keep after gtm
    switch (plan) {
      case 'free':
        return {
          list: freeFeatureList,
          header: formatTemplate(['free', 'name']),
          containerClassNames: classNames(
            styles.freePlan,
            styles.freePlanRebrand,
          ),
        };
      case 'standard':
        return {
          list: standardFeatureList,
          header: formatTemplate(['standard', 'name']),
          containerClassNames: classNames(
            styles.staPlan,
            styles.staPlanRebrand,
          ),
        };
      case 'premium':
        return {
          list: premiumFeatureList,
          header: formatTemplate(['premium', 'name']),
          containerClassNames: styles.premiumPlan,
        };
      default:
        return;
    }
  } else if (isStandardVariationEnabled) {
    // standard variation details
    switch (plan) {
      case 'free':
        return {
          list: nuSkuFreeTeamSelectionList,
          header: formatNamespace(['free-team-nusku', 'headline']),
          containerClassNames: classNames(
            styles.freePlan,
            styles.freePlanNusku,
          ),
        };
      case 'standard':
        return {
          list: staTeamSelectionList,
          header: formatNamespace(['sta-team', 'headline']),
          containerClassNames: styles.staPlan,
        };
      case 'premium':
        return {
          list: nuSkuBcPlanSelectionList,
          header: formatNamespace(['bc-team-nusku', 'headline']),
          containerClassNames: classNames(styles.bcPlan, styles.bcPlanNusku),
        };
      default:
        return;
    }
  } else {
    // classic details
    switch (plan) {
      case 'free':
        return {
          list: freeTeamSelectionList,
          header: formatNamespace(['free-team', 'headline']),
          containerClassNames: classNames(styles.freePlan),
        };
      case 'standard':
        // should be no standard in classic
        return;
      case 'premium':
        return {
          list: bcPlanSelectionList,
          header: formatNamespace(['bc-team', 'headline']),
          containerClassNames: classNames(styles.bcPlan),
        };
      default:
        return;
    }
  }
};

export const MiniPlanOverviewSection: React.FC<MiniPlanOverviewSectionProps> = ({
  plan,
  isStandardVariationEnabled,
}) => {
  // TODO: should be moved to usePlanDetails after GTM when the icon conditional is removed
  const isRepackagedGtm = useFeatureFlag(
    'nusku.repackaging-gtm.features',
    false,
  );
  const planDetails = usePlanDetails({
    plan,
    isStandardVariationEnabled,
    isRepackagedGtm,
  });

  if (!planDetails) return null;
  return (
    <div className={planDetails.containerClassNames}>
      <h2>{planDetails.header}</h2>
      {planDetails.subtext && (
        <h3 className={planDetails.subtextClassNames}>{planDetails.subtext}</h3>
      )}
      <ul>
        {planDetails.list.map(({ icon: Icon, content, tooltip }, index) => (
          <li
            key={index}
            className={classNames(
              styles.featureItem,
              !!tooltip && styles.tooltipTarget,
            )}
          >
            {renderTooltip(
              tooltip,
              <div className={styles.featureItemWrapper}>
                {/* TODO: After GTM, this conditional can be removed and we only need the simpler second option */}
                {plan === 'premium' &&
                !isRepackagedGtm &&
                !isStandardVariationEnabled ? (
                  <Icon
                    size="medium"
                    dangerous_className={styles.featureIcon}
                  />
                ) : (
                  <Icon
                    color="quiet"
                    dangerous_className={styles.featureIcon}
                  />
                )}
                <div className={styles.featureTextWrapper}>
                  <span className={styles.featureContent}>
                    {content.replace(/&amp;/g, '&')}
                  </span>
                </div>
              </div>,
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

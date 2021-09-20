import React from 'react';
import styles from './PlanSelection.less';
import { TrialLength } from './types';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { MiniPlanOverviewSection } from './MiniPlanOverviewSection';

interface PlanSelectionProps {
  trialLength?: TrialLength;
  isStandardVariationEnabled?: boolean;
}

export const PlanSelection: React.FC<PlanSelectionProps> = ({
  trialLength,
  isStandardVariationEnabled,
}) => {
  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: !trialLength
          ? Feature.ExpiredFreeTrialExistingTeam
          : Feature.FreeTrialExistingTeam,
      }}
    >
      <div className={styles.bodyWrapper}>
        <MiniPlanOverviewSection
          plan="free"
          isStandardVariationEnabled={isStandardVariationEnabled}
        />
        <MiniPlanOverviewSection
          plan="standard"
          isStandardVariationEnabled={isStandardVariationEnabled}
        />
        <MiniPlanOverviewSection
          plan="premium"
          isStandardVariationEnabled={isStandardVariationEnabled}
        />
      </div>
    </ErrorBoundary>
  );
};

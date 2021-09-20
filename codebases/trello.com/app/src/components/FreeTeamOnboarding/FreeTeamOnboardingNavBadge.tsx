import React from 'react';

import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

import { useFreeTeamOnboardingChecklist } from './useFreeTeamOnboardingChecklist';
import styles from './FreeTeamOnboardingNavBadge.less';

interface FreeTeamTabBadgeProps {
  orgId: string;
}

const FreeTeamOnboardingNavBadgeNotWrapped: React.FC<FreeTeamTabBadgeProps> = ({
  orgId,
}) => {
  const {
    loading,
    checklistItems,
    completedCount,
  } = useFreeTeamOnboardingChecklist(orgId);

  const itemsLeft = checklistItems.length - completedCount;

  return !loading && itemsLeft > 0 ? (
    <div className={styles.freeTeamTabBadge}>{itemsLeft}</div>
  ) : null;
};

export const FreeTeamOnboardingNavBadge: React.FC<FreeTeamTabBadgeProps> = ({
  orgId,
}) => (
  <ComponentWrapper>
    <FreeTeamOnboardingNavBadgeNotWrapped orgId={orgId} />
  </ComponentWrapper>
);

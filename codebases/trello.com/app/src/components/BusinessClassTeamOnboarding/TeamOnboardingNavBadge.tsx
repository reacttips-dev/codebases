import React from 'react';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { useTeamOnboardingChecklist } from './useTeamOnboardingChecklist';
import styles from './TeamOnboardingNavBadge.less';

interface TeamTabBadgeProps {
  orgId: string;
}

const TeamOnboardingNavBadgeNotWrapped: React.FC<TeamTabBadgeProps> = ({
  orgId,
}) => {
  const {
    loading,
    checklistItems,
    completedCount,
  } = useTeamOnboardingChecklist(orgId);

  const itemsLeft = checklistItems.length - completedCount;

  return !loading && itemsLeft > 0 ? (
    <div className={styles.teamTabBadge}>{itemsLeft}</div>
  ) : null;
};

export const TeamOnboardingNavBadge: React.FC<TeamTabBadgeProps> = ({
  orgId,
}) => (
  <ComponentWrapper>
    <TeamOnboardingNavBadgeNotWrapped orgId={orgId} />
  </ComponentWrapper>
);

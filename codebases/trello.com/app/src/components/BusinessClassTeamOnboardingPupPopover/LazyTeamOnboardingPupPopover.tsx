import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';

interface TeamOnboardingPupPopoverProps {
  orgId: string;
  boardId: string;
  onShowPowerUps(): void;
  onDismissed(): void;
  renderTimeout?: number;
}

export const LazyTeamOnboardingPupPopover: React.FunctionComponent<TeamOnboardingPupPopoverProps> = (
  props,
) => {
  const TeamOnboardingPupPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "team-onboarding-pup-popover" */ './TeamOnboardingPupPopover'
      ),
    { namedImport: 'TeamOnboardingPupPopover' },
  );

  return (
    <Suspense fallback={null}>
      <TeamOnboardingPupPopover {...props} />
    </Suspense>
  );
};

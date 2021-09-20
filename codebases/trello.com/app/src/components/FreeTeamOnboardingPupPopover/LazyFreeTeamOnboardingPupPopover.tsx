import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';

interface FreeTeamOnboardingPupPopoverProps {
  orgId: string;
  teamName: string;
  boardId: string;
}

export const LazyFreeTeamOnboardingPupPopover: React.FunctionComponent<FreeTeamOnboardingPupPopoverProps> = (
  props,
) => {
  const FreeTeamOnboardingPupPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "free-team-onboarding-pup-popover" */ './FreeTeamOnboardingPupPopover'
      ),
    { namedImport: 'FreeTeamOnboardingPupPopover' },
  );

  return (
    <Suspense fallback={null}>
      <FreeTeamOnboardingPupPopover {...props} />
    </Suspense>
  );
};

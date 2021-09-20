import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';

interface TeamOnboardingPupTooltipProps {
  onDismiss(): void;
}

export const LazyTeamOnboardingPupTooltip: React.FunctionComponent<TeamOnboardingPupTooltipProps> = (
  props,
) => {
  const TeamOnboardingPupTooltip = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "team-onboarding-pup-tooltip" */ './TeamOnboardingPupTooltip'
      ),
    { namedImport: 'TeamOnboardingPupTooltip' },
  );

  return (
    <Suspense fallback={null}>
      <TeamOnboardingPupTooltip {...props} />
    </Suspense>
  );
};

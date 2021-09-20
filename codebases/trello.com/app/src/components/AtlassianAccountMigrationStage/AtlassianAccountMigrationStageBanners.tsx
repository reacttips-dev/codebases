import React, { Suspense, useEffect, useState } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';

import { useAtlassianAccountMigrationStageBanners } from './useAtlassianAccountMigrationStageBanners';
import { useInterruptibleRouteTransition } from './useInterruptibleRouteTransition';
import { AtlassianAccountMigrationStage as Stage } from './types';

import { HYGIENE_MESSAGE_ID } from 'app/src/components/EmailHygieneWizard';

// Wraps all banners related to managing Atlassian Account migration stages,
// which are by design exclusive from each other.
export const AtlassianAccountMigrationStageBanners: React.FC = ({
  children,
}) => {
  const AtlassianAutomaticMigrationBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-onboarding-banner" */ 'app/src/components/AtlassianAccountOnboardingBanner'
      ),
    { namedImport: 'AtlassianAutomaticMigrationBanner', preload: false },
  );
  const AtlassianManagedAccountBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-onboarding-banner" */ 'app/src/components/AtlassianAccountOnboardingBanner'
      ),
    { namedImport: 'AtlassianManagedAccountBanner', preload: false },
  );
  const AtlassianAccountMigrationBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-migration-banner" */ 'app/src/components/AtlassianAccountMigration'
      ),
    { namedImport: 'AtlassianAccountMigrationBanner', preload: false },
  );
  const EmailHygieneBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "email-hygiene-banner" */ 'app/src/components/EmailHygieneWizard'
      ),
    { namedImport: 'EmailHygieneBanner', preload: false },
  );
  const AtlassianAccountMigrationPrompt = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-migration-banner" */ 'app/src/components/AtlassianAccountMigrationPrompt'
      ),
    { namedImport: 'AtlassianAccountMigrationPrompt', preload: false },
  );

  const {
    me,
    stage,
    forceStage,
    prompt,
    shouldRenderBanner,
    shouldRenderPrompt,
  } = useAtlassianAccountMigrationStageBanners();

  const { interrupt, isInitialRoute } = useInterruptibleRouteTransition();
  const [shouldInterruptForHygiene, setShouldInterruptForHygiene] = useState(
    false,
  );
  const [isInitialRouteForHygiene, setIsInitialRouteForHygiene] = useState(
    false,
  );

  useEffect(() => {
    setShouldInterruptForHygiene(interrupt);
    setIsInitialRouteForHygiene(isInitialRoute);
  }, [interrupt, isInitialRoute]);

  const hasCompletedHygiene = me?.oneTimeMessagesDismissed?.includes(
    HYGIENE_MESSAGE_ID,
  );

  if (!shouldRenderBanner && !shouldRenderPrompt) {
    return null;
  }

  const renderBanner = () => {
    if (!shouldRenderBanner) {
      return <>{children}</>;
    }

    switch (stage) {
      case Stage.onboarding:
      case Stage.onboardingSuccess:
        return <AtlassianAutomaticMigrationBanner forceShow={!!forceStage} />;
      case Stage.newlyManaged:
        return <AtlassianManagedAccountBanner />;
      case Stage.inactiveMigration:
        return (
          <AtlassianAccountMigrationBanner
            forceShow={!!forceStage}
            wasActiveMigration={false}
            wasInactiveMigration={true}
          />
        );
      case Stage.migrationSuccess:
      case Stage.migration:
        return (
          <AtlassianAccountMigrationBanner
            forceShow={!!forceStage}
            wasActiveMigration={true}
            wasInactiveMigration={false}
          />
        );
      case Stage.emailHygiene:
        return (
          <EmailHygieneBanner
            forceShow={!!forceStage}
            shouldInterruptForHygiene={shouldInterruptForHygiene}
            shouldMigrate={isInitialRouteForHygiene}
            hasCompletedHygiene={hasCompletedHygiene}
          />
        );
      default:
        return null;
    }
  };

  const renderPrompt = () => {
    if (!shouldRenderPrompt) {
      return null;
    }
    return <AtlassianAccountMigrationPrompt prompt={prompt} />;
  };

  return (
    <>
      <Suspense fallback={null}>{renderBanner()}</Suspense>
      <Suspense fallback={null}>{renderPrompt()}</Suspense>
    </>
  );
};

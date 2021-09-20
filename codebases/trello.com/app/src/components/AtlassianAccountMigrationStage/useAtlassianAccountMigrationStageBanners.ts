import { useEffect, useState } from 'react';
import { memberId } from '@trello/session-cookie';

import { useAtlassianAccountMigrationStage } from './useAtlassianAccountMigrationStage';
import { AtlassianAccountMigrationStage as Stage } from './types';
import { showMigrationPrompt } from './showMigrationPrompt';

import { forceOnboardingQuery } from 'app/src/components/AtlassianAccountOnboardingBanner/AutomaticOnboarding/AtlassianAutomaticMigrationBanner';
import { forceEmailHygieneQuery } from 'app/src/components/EmailHygieneWizard/EmailHygieneBanner';
import {
  forceMigrationQuery,
  forceActiveMigrationQuery,
  forceInactiveMigrationQuery,
} from 'app/src/components/AtlassianAccountMigration/AtlassianAccountMigrationBanner';

import { useAtlassianAccountMigrationBanner } from 'app/src/components/AtlassianAccountMigration';
import {
  useAtlassianAutomaticMigrationBanner,
  useAtlassianManagedAccountBanner,
} from 'app/src/components/AtlassianAccountOnboardingBanner';
import { useEmailHygieneBanner } from 'app/src/components/EmailHygieneWizard';

export const useAtlassianAccountMigrationStageBanners = () => {
  const { stage, me } = useAtlassianAccountMigrationStage({
    skip: !memberId,
  });
  const [forceStage, setForceStage] = useState<Stage | null>(null);
  const [showPrompt, setShowPrompt] = useState('');
  const [shouldRenderBanner, setShouldRenderBanner] = useState(false);

  const effectiveStage = forceStage || stage;

  const {
    shouldRender: shouldRenderAutomaticMigrationBanner,
  } = useAtlassianAutomaticMigrationBanner({});

  const {
    shouldRender: shouldRenderManagedAccountBanner,
  } = useAtlassianManagedAccountBanner();

  const {
    shouldRender: shouldRenderAtlassianAccountMigrationBanner,
  } = useAtlassianAccountMigrationBanner();

  const {
    shouldRender: shouldRenderEmailHygieneBanner,
  } = useEmailHygieneBanner();

  useEffect(() => {
    switch (effectiveStage) {
      case Stage.onboarding:
      case Stage.onboardingSuccess:
        setShouldRenderBanner(shouldRenderAutomaticMigrationBanner);
        break;
      case Stage.newlyManaged:
        setShouldRenderBanner(shouldRenderManagedAccountBanner);
        break;
      case Stage.inactiveMigration:
      case Stage.migrationSuccess:
      case Stage.migration:
        setShouldRenderBanner(shouldRenderAtlassianAccountMigrationBanner);
        break;
      case Stage.emailHygiene:
        setShouldRenderBanner(shouldRenderEmailHygieneBanner);
        break;
      default:
        setShouldRenderBanner(false);
    }
  }, [
    effectiveStage,
    shouldRenderAtlassianAccountMigrationBanner,
    shouldRenderAutomaticMigrationBanner,
    shouldRenderEmailHygieneBanner,
    shouldRenderManagedAccountBanner,
  ]);

  // If forcing open a banner with a query parameter, override actual stage.
  useEffect(() => {
    const query = window.location.search;
    if (forceOnboardingQuery.test(query)) {
      setForceStage(Stage.onboarding);
    } else if (forceInactiveMigrationQuery.test(query)) {
      setForceStage(Stage.inactiveMigration);
    } else if (forceActiveMigrationQuery.test(query)) {
      setForceStage(Stage.migrationSuccess);
    } else if (forceMigrationQuery.test(query)) {
      setForceStage(Stage.migration);
    } else if (forceEmailHygieneQuery.test(query)) {
      setForceStage(Stage.emailHygiene);
    }
  }, [me]);

  useEffect(() => {
    const prompt = showMigrationPrompt(window.location.search);
    if (prompt) {
      setShowPrompt(prompt);
    }
  }, []);

  return {
    me,
    stage: effectiveStage,
    forceStage,
    prompt: showPrompt,
    shouldRenderBanner,
    shouldRenderPrompt: !!showPrompt,
  };
};

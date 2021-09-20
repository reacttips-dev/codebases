import { useEffect, useState, useCallback } from 'react';

import { useFeatureFlag } from '@trello/feature-flag-client';

import {
  AtlassianAccountMigrationErrorCodes,
  getErrorCode,
} from './AtlassianAccountMigrationErrorCodes';
import { useAtlassianAccountMigrationQuery } from './AtlassianAccountMigrationQuery.generated';

import { getQueryParameter } from './getQueryParameter';
import { removeQueryParameters } from './removeQueryParameters';

import { checkUserNeedsSyncUnblocked } from 'app/src/components/AtlassianAccountMigrationStage/checkUserNeedsSyncUnblocked';

export interface Options {
  forceShow?: boolean;
  wasInactiveMigration: boolean;
}

export function useAtlassianAccountMigrationBanner(
  { forceShow, wasInactiveMigration }: Options = {
    wasInactiveMigration: false,
  },
) {
  const [
    migrationErrorCode,
    setMigrationErrorCode,
  ] = useState<AtlassianAccountMigrationErrorCodes | null>(null);
  const [shouldShowBanner, setShouldShowBanner] = useState(false);
  const [shouldShowConfirmation, setShouldShowConfirmation] = useState(false);

  const isTargeted = useFeatureFlag('aaaa.aa-migration-banner', false);
  const isAaMigrationEnabled = useFeatureFlag('aaaa.web.aa-migration', false);

  const dataHook = useAtlassianAccountMigrationQuery({
    variables: { memberId: 'me' },
  });

  const me = dataHook.data && dataHook.data.member;

  const aaBlockSyncUntil = me?.aaBlockSyncUntil;

  const needsSyncUnblocked = checkUserNeedsSyncUnblocked(aaBlockSyncUntil);
  const isProfileSyncUnblocked = !!aaBlockSyncUntil && !needsSyncUnblocked;

  useEffect(() => {
    const shouldShowConfirmationOverlay =
      getQueryParameter('onboarding') === 'success' ||
      getQueryParameter('auto_onboarding') === 'success';

    setShouldShowConfirmation(shouldShowConfirmationOverlay);

    const onboardingValue = getQueryParameter('onboarding');
    const errorCode = onboardingValue && getErrorCode(onboardingValue);
    if (errorCode) {
      setMigrationErrorCode(errorCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Ensures we're done fetching data before opening the banner.
    if (!me) {
      return;
    }
    if (forceShow || (isTargeted && isAaMigrationEnabled)) {
      setShouldShowBanner(true);
    } else {
      setShouldShowBanner(false);
    }
  }, [me, forceShow, isTargeted, isAaMigrationEnabled]);

  const renderErrors = () => {
    if (!migrationErrorCode) {
      return false;
    }
    return true;
  };

  const renderBanner = () => {
    if (!shouldShowBanner || !me?.fullName || me?.isAaMastered) {
      return false;
    }

    return true;
  };

  const renderConfirmation = () => {
    if (!me?.isAaMastered || !shouldShowConfirmation) {
      return false;
    }

    // If a user was inactively migrated and has a value for aaBlockSyncUntil,
    // but that timestamp is not within the next 3 days, then they should not
    // be presented with a confirmation dialog.
    // Also, this shouldn't actually be possible, but just in case.
    if (wasInactiveMigration && !!aaBlockSyncUntil && !isProfileSyncUnblocked) {
      return false;
    }

    return true;
  };

  const dismissErrors = useCallback(() => {
    removeQueryParameters('onboarding', 'onboarding');
    setMigrationErrorCode(null);
  }, []);

  const dismissConfirmation = useCallback(() => {
    removeQueryParameters('onboarding', 'auto_onboarding');
    setShouldShowConfirmation(false);
  }, []);

  const shouldRenderBanner = renderBanner();
  const shouldRenderErrors = renderErrors();
  const shouldRenderConfirmation = renderConfirmation();

  return {
    me,
    migrationErrorCode,
    shouldRender:
      shouldRenderBanner || shouldRenderErrors || shouldRenderConfirmation,
    shouldRenderBanner,
    shouldRenderErrors,
    shouldRenderConfirmation,
    dismissErrors,
    dismissConfirmation,
  };
}

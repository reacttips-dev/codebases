import { useState, useCallback, useEffect } from 'react';
import { isEmpty } from 'underscore';

import { useAtlassianAccountOnboardingQuery } from '../AtlassianAccountOnboardingQuery.generated';
import { needsAtlassianAccountRelinkedConfirmation } from './needsAtlassianAccountRelinkedConfirmation';
import { ScreenType } from './Overlays/AutoOnboardingOverlayManager';
import { getQueryParameter } from '../getQueryParameter';
import { removeQueryParameters } from '../removeQueryParameters';
import { checkUserNeedsSyncUnblocked } from 'app/src/components/AtlassianAccountMigrationStage/checkUserNeedsSyncUnblocked';

export function useAtlassianAutomaticMigrationBanner({
  isOverlayOpen = false,
  forceShow = false,
}: {
  isOverlayOpen?: boolean;
  forceShow?: boolean;
}) {
  const [screen, setScreen] = useState<ScreenType | null>(null);

  const [shouldRenderBanner, setShouldRenderBanner] = useState(false);
  const [shouldRenderOverlay, setShouldRenderOverlay] = useState(false);
  const [shouldRenderConfirmation, setShouldRenderConfirmation] = useState(
    false,
  );

  const shouldShowAutomaticMigrationConfirmationOverlay =
    getQueryParameter('auto_onboarding') === 'success';

  const shouldShowEmailMismatchOverlay =
    getQueryParameter('auto_onboarding') === 'emailMismatchError';

  const shouldShowAtlassianProfile =
    getQueryParameter('show_atlassian_profile') === 'true';

  const shouldShowSuccessOverlay =
    getQueryParameter('onboarding') === 'success';

  const shouldShowOnboardingOverlay = useCallback(
    (oneTimeMessagesDismissed: string[]) => {
      return (
        shouldShowAutomaticMigrationConfirmationOverlay ||
        shouldShowEmailMismatchOverlay ||
        shouldShowAtlassianProfile ||
        needsAtlassianAccountRelinkedConfirmation(oneTimeMessagesDismissed)
      );
    },
    [
      shouldShowAtlassianProfile,
      shouldShowAutomaticMigrationConfirmationOverlay,
      shouldShowEmailMismatchOverlay,
    ],
  );

  const { data } = useAtlassianAccountOnboardingQuery({
    variables: { memberId: 'me' },
  });

  const me = data?.member;

  const dismissOverlay = useCallback(() => {
    removeQueryParameters(
      'onboarding',
      'auto_onboarding',
      'show_atlassian_profile',
    );

    setShouldRenderOverlay(false);
    setShouldRenderConfirmation(false);
  }, []);

  const showBannerAndOverlay = useCallback(() => {
    setShouldRenderBanner(true);
    setShouldRenderOverlay(true);
    setShouldRenderConfirmation(false);
  }, []);

  useEffect(() => {
    const isAllPersonalDataAvailable = !!(
      me &&
      me.id &&
      me.fullName &&
      me.email &&
      me.aaId
    );

    // Ensure we have all the data necessary to render (none of our fields are null)
    if (!me || !isAllPersonalDataAvailable) {
      setShouldRenderBanner(false);
      setShouldRenderOverlay(false);
      setShouldRenderConfirmation(false);
      return;
    }

    const aaLogin = me.logins.find((l) => l.email === me.aaEmail);
    const ent = !isEmpty(me.enterprises) ? me.enterprises[0] : undefined;

    const isAaOrgDataAvailable = !!(
      me.aaEmail &&
      aaLogin &&
      aaLogin.id &&
      ent?.displayName
    );

    const needsSyncUnblocked = checkUserNeedsSyncUnblocked(
      me?.aaBlockSyncUntil,
    );
    const oneTimeMessagesDismissed = me?.oneTimeMessagesDismissed || [];

    if (shouldShowAutomaticMigrationConfirmationOverlay) {
      setScreen(ScreenType.AUTOMATIC_MIGRATION_CONFIRMATION);
      setShouldRenderBanner(false);
      setShouldRenderOverlay(false);
      setShouldRenderConfirmation(true);
    } else if (shouldShowEmailMismatchOverlay) {
      setScreen(ScreenType.EMAIL_MISMATCH);
      showBannerAndOverlay();
    } else if (
      shouldShowAtlassianProfile ||
      needsAtlassianAccountRelinkedConfirmation(oneTimeMessagesDismissed)
    ) {
      setScreen(ScreenType.ATLASSIAN_PROFILE);
      showBannerAndOverlay();
    } else if (shouldShowSuccessOverlay) {
      setScreen(ScreenType.ACCOUNT_CONFIRMATION);
      showBannerAndOverlay();
    } else if ((!needsSyncUnblocked || !isAaOrgDataAvailable) && !forceShow) {
      setShouldRenderBanner(false);
      setShouldRenderOverlay(false);
      setShouldRenderConfirmation(false);
    } else if (
      (needsSyncUnblocked &&
        isAllPersonalDataAvailable &&
        isAaOrgDataAvailable) ||
      forceShow
    ) {
      setScreen(ScreenType.UPDATE_ACCOUNT);
      showBannerAndOverlay();
    }
  }, [
    me,
    forceShow,
    setShouldRenderBanner,
    setShouldRenderOverlay,
    setShouldRenderConfirmation,
    shouldShowAutomaticMigrationConfirmationOverlay,
    shouldShowEmailMismatchOverlay,
    shouldShowAtlassianProfile,
    shouldShowSuccessOverlay,
    shouldShowOnboardingOverlay,
    showBannerAndOverlay,
  ]);

  useEffect(() => {
    setShouldRenderOverlay(isOverlayOpen);
  }, [isOverlayOpen]);

  return {
    me,
    screen,
    shouldRender:
      shouldRenderBanner || shouldRenderOverlay || shouldRenderConfirmation,
    shouldRenderBanner,
    shouldRenderOverlay,
    shouldRenderConfirmation,
    setScreen,
    dismissOverlay,
  };
}

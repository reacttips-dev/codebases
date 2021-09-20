import { useEffect, useState, useCallback } from 'react';

import { idToDate } from '@trello/dates';
import { useFeatureFlag } from '@trello/feature-flag-client';

import { useEmailHygieneWizardQuery } from './EmailHygieneWizardQuery.generated';
import { CHANGE_EMAIL_MESSAGE_ID } from './emailHygieneOneTimeMessageIds';

interface Options {
  forceShow?: boolean;
  shouldInterruptForHygiene?: boolean;
  hasCompletedHygiene?: boolean;
}

export function useEmailHygieneBanner({
  forceShow,
  shouldInterruptForHygiene,
  hasCompletedHygiene,
}: Options = {}) {
  const [shouldShowHygiene, setShouldShowHygiene] = useState(false);
  const [shouldShowFinalHygiene, setShouldShowFinalHygiene] = useState(false);
  const [shouldOverlayAutoOpen, setOverlayAutoOpen] = useState(false);

  const isTargeted = useFeatureFlag('aa4a.show-email-hygiene', false);
  const isFinalHygieneEnabled = useFeatureFlag(
    'aaaa.final-email-hygiene',
    false,
  );

  const dataHook = useEmailHygieneWizardQuery({
    variables: { memberId: 'me' },
  });

  const me = dataHook.data && dataHook.data.member;

  const dismissFinalHygiene = useCallback(() => {
    setShouldShowFinalHygiene(false);
  }, []);

  useEffect(() => {
    if (!me?.logins) {
      return;
    }

    const didChangeEmail = !!me.oneTimeMessagesDismissed?.includes(
      CHANGE_EMAIL_MESSAGE_ID,
    );
    const sortedLogins = [...me.logins].sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    const oldestLogin = sortedLogins[0];
    const timeDiffInDays = oldestLogin
      ? (Date.now() - idToDate(oldestLogin.id).valueOf()) / 1000 / 60 / 60 / 24
      : 0;

    /**
     * These conditionals are a little complicated, and here's why:
     * We need to cover a few different cases, where a user may become
     * un-targeted while going through the steps in the PEH wizard.
     * For example, if they are being targeted because they fall into a
     * claimable email cohort, and we show them the wizard, then, in the
     * wizard, they change their email to a un-claimable email they might
     * fall out of the "claimable email cohort" and no
     * longer be `isTargeted: true`. In this case, we do not want to have the
     * wizard and banner be hidden, due to this change of email.
     */

    if (forceShow) {
      setShouldShowHygiene(true);
    } else if (timeDiffInDays <= 7 && !didChangeEmail) {
      setShouldShowHygiene(false);
    } else if (didChangeEmail || isTargeted) {
      setShouldShowHygiene(true);
    }
  }, [me, forceShow, isTargeted]);

  /**
   * We intentionally don't want the blocking final Hygiene dialog to be rendered
   * at the moment the user gets enrolled in the feature flag's `true` variation
   * We want to defer rendering until an interruptible moment which gets passed
   * to this component by way of the `shouldInterruptForHygiene` prop, but we
   * still need to check that the feature flag is enabled.
   */
  useEffect(() => {
    if (
      !hasCompletedHygiene &&
      shouldShowHygiene &&
      shouldInterruptForHygiene &&
      isFinalHygieneEnabled
    ) {
      setShouldShowFinalHygiene(true);
      setOverlayAutoOpen(true);
    }
    // See above comment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompletedHygiene, shouldShowHygiene, shouldInterruptForHygiene]);

  return {
    me,
    refetch: dataHook.refetch,
    shouldOverlayAutoOpen,
    shouldRender: shouldShowHygiene || shouldShowFinalHygiene,
    shouldShowHygiene,
    shouldShowFinalHygiene,
    dismissFinalHygiene,
  };
}

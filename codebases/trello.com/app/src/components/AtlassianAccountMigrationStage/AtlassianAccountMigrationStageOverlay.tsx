import React, { FunctionComponent, Suspense, useMemo } from 'react';
import { useEmailHygieneWizardQuery } from 'app/src/components/EmailHygieneWizard/EmailHygieneWizardQuery.generated';
import { useLazyComponent } from '@trello/use-lazy-component';

import { Spinner } from '@trello/nachos/spinner';
import {
  Overlay,
  OverlayAlignment,
  OverlayBackground,
} from 'app/src/components/Overlay';

import { AtlassianAccountMigrationStage } from './types';
import { aaMigrationRedirect } from 'app/src/components/AtlassianAccountMigration';
import { noop } from 'app/src/noop';

interface Props {
  stage: AtlassianAccountMigrationStage | null;
  attributes: object;
  onComplete: () => void;
  onDismiss: () => void;
}

export const AtlassianAccountMigrationStageOverlay: FunctionComponent<Props> = ({
  stage,
  attributes,
  onComplete,
  onDismiss,
}) => {
  const EmailHygieneWizard = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "email-hygiene-wizard" */ 'app/src/components/EmailHygieneWizard/EmailHygieneWizard'
      ),
    {
      preload: stage === AtlassianAccountMigrationStage.emailHygiene,
    },
  );

  /**
   * The wizards take in different props, but today the PEH query is a superset
   * of the latter (except email, which we're fetching extraneously in some
   * the banners to use useAtlassianAccountMigrationStage, and delegate the
   * cases), so we can get away with it.
   */
  const { loading, data } = useEmailHygieneWizardQuery({
    variables: { memberId: 'me' },
  });
  const me = data?.member;

  const logins = useMemo(() => {
    return (me && [...me?.logins]) || [];
  }, [me]);

  const analyticsContext = useMemo(
    () => ({
      ...attributes,
      organizationId: null,
      totalEmailAddresses: logins.length,
      totalClaimableEmailAddresses: logins.filter((l) => l.claimable).length,
    }),
    [logins, attributes],
  );

  const renderWizard = () => {
    if (me && stage === AtlassianAccountMigrationStage.emailHygiene) {
      return (
        <EmailHygieneWizard
          analyticsContext={analyticsContext}
          avatarUrl={me.avatarUrl ?? undefined}
          hasTwoFactor={!!me.prefs?.twoFactor?.enabled}
          initials={me.initials ?? undefined}
          logins={logins}
          id={me.id}
          name={me.fullName || me.username}
          onComplete={onComplete}
          onDismiss={onDismiss}
        />
      );
    }

    return null;
  };

  if (stage === AtlassianAccountMigrationStage.migration) {
    aaMigrationRedirect();
    return null;
  }

  return (
    <Overlay
      background={OverlayBackground.LIGHT}
      closeOnEscape={false}
      onClose={noop}
      alignment={OverlayAlignment.TOP}
    >
      {loading ? (
        <Spinner />
      ) : (
        <Suspense fallback={null}>{renderWizard()}</Suspense>
      )}
    </Overlay>
  );
};

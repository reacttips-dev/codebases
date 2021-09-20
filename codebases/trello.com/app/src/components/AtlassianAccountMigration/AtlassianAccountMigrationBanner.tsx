import React, {
  FunctionComponent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { Yellow50 } from '@trello/colors';
import { useLazyComponent } from '@trello/use-lazy-component';
import { forNamespace } from '@trello/i18n';

import { Banner } from 'app/src/components/Banner';
import {
  Overlay,
  OverlayAlignment,
  OverlayBackground,
} from 'app/src/components/Overlay';

import { useAtlassianAccountMigrationBanner } from './useAtlassianAccountMigrationBanner';
import { aaMigrationRedirect } from './aaMigrationRedirect';

import { checkUserNeedsSyncUnblocked } from 'app/src/components/AtlassianAccountMigrationStage/checkUserNeedsSyncUnblocked';

import styles from './AtlassianAccountMigrationBanner.less';
import { noop } from 'app/src/noop';

interface MigrationAnalyticsContext {
  organizationId?: string | null;
  totalEmailAddresses?: number;
  totalClaimableEmailAddresses?: number;
}

let analyticsContext: MigrationAnalyticsContext;

const format = forNamespace(['aa migration wizard', 'banner-v2'], {
  shouldEscapeStrings: false,
});

export const forceMigrationQuery = /[?&]forceMigration=true/i;
export const forceActiveMigrationQuery = /[?&]forceActiveMigration=true/i;
export const forceInactiveMigrationQuery = /[?&]forceInactiveMigration=true/i;

export interface AtlassianAccountMigrationBannerProps {
  forceShow?: boolean;
  wasActiveMigration: boolean;
  wasInactiveMigration: boolean;
}

const MigrationOverlay: FunctionComponent<object> = ({ children }) => (
  <Overlay
    background={OverlayBackground.LIGHT}
    closeOnEscape={false}
    onClose={noop}
    alignment={OverlayAlignment.TOP}
  >
    <Suspense fallback={null}>{children}</Suspense>
  </Overlay>
);

export const AtlassianAccountMigrationBanner: FunctionComponent<AtlassianAccountMigrationBannerProps> = ({
  forceShow,
  wasActiveMigration,
  wasInactiveMigration,
}) => {
  const AtlassianAccountMigrationError = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "aa-migration-error" */ './AtlassianAccountMigrationError'
      ),
  );
  const AtlassianAccountMigrationConfirmationDialog = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "aa-migration-confirmation" */ './AtlassianAccountMigrationConfirmationDialog'
      ),
  );

  const {
    me,
    migrationErrorCode,
    shouldRender,
    shouldRenderBanner,
    shouldRenderErrors,
    shouldRenderConfirmation,
    dismissErrors,
    dismissConfirmation,
  } = useAtlassianAccountMigrationBanner({
    forceShow,
    wasInactiveMigration,
  });

  const logins = useMemo(() => {
    return (me && [...me?.logins]) || [];
  }, [me]);

  const aaBlockSyncUntil = me?.aaBlockSyncUntil;

  const needsSyncUnblocked = checkUserNeedsSyncUnblocked(aaBlockSyncUntil);
  const isProfileSyncUnblocked = !!aaBlockSyncUntil && !needsSyncUnblocked;

  const onDismissError = useCallback(() => {
    dismissErrors();
  }, [dismissErrors]);

  const onRetry = useCallback(() => {
    aaMigrationRedirect();
  }, []);

  const onDismiss = useCallback(() => {
    dismissConfirmation();

    Analytics.sendClosedComponentEvent({
      componentType: 'overlay',
      componentName: 'atlassianAccountMigrationOverlay',
      source: 'atlassianAccountMigrationBanner',
      attributes: analyticsContext,
    });
  }, [dismissConfirmation]);

  const onClickConnectAccount = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'setupAtlassianAccountLink',
      source: 'atlassianAccountMigrationBanner',
      attributes: analyticsContext,
    });

    aaMigrationRedirect();
  }, []);

  if (!analyticsContext && !!me) {
    analyticsContext = {
      organizationId: null,
      totalEmailAddresses: logins.length,
      totalClaimableEmailAddresses: logins.filter((l) => l.claimable).length,
    };
  }

  useEffect(() => {
    if (shouldRenderBanner) {
      Analytics.sendViewedBannerEvent({
        bannerName: 'atlassianAccountMigrationBanner',
        source: getScreenFromUrl(),
        attributes: analyticsContext,
      });
    }
  }, [shouldRenderBanner]);

  const renderErrors = () => {
    return (
      <MigrationOverlay>
        <AtlassianAccountMigrationError
          code={migrationErrorCode}
          onRetry={onRetry}
          onDismiss={onDismissError}
        />
      </MigrationOverlay>
    );
  };

  const renderBanner = () => {
    return (
      <Banner
        className={styles.banner}
        bannerColor={Yellow50}
        alignCloseTop={true}
        shadow={true}
      >
        <p className={styles.text}>
          {format('main-message')}
          <a href="#" onClick={onClickConnectAccount}>
            {format('link-text')}
          </a>
        </p>
      </Banner>
    );
  };

  const renderConfirmation = () => {
    return (
      <MigrationOverlay>
        <AtlassianAccountMigrationConfirmationDialog
          id={me?.id || ''}
          name={me?.fullName || ''}
          email={me?.email || ''}
          isProfileSyncUnblocked={isProfileSyncUnblocked}
          wasActiveMigration={wasActiveMigration}
          wasInactiveMigration={wasInactiveMigration}
          onDismiss={onDismiss}
          analyticsContext={analyticsContext}
        />
      </MigrationOverlay>
    );
  };

  if (shouldRender) {
    return (
      <div>
        {shouldRenderBanner && renderBanner()}
        {shouldRenderErrors && renderErrors()}
        {shouldRenderConfirmation && renderConfirmation()}
      </div>
    );
  }
  return null;
};

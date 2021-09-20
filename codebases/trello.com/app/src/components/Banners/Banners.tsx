import React, { Suspense } from 'react';
import { memberId } from '@trello/session-cookie';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';

export const Banners = () => {
  const AtlassianAccountMigrationStageBanners = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-migration-stage-banners" */ 'app/src/components/AtlassianAccountMigrationStage'
      ),
    { namedImport: 'AtlassianAccountMigrationStageBanners', preload: false },
  );
  const SomethingsWrongBanner = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "somethings-wrong-banner" */ 'app/src/components/SomethingsWrongBanner'
      ),
    { namedImport: 'SomethingsWrongBanner', preload: false },
  );

  const BoardBannerList = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "board-banner-list" */ 'app/src/components/BoardBannerList'
      ),
    { namedImport: 'BoardBannerList', preload: false },
  );

  // Don't render any of the banners if the user isn't logged in
  if (!memberId) {
    return null;
  }

  return (
    <ComponentWrapper>
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <SomethingsWrongBanner />
        </ChunkLoadErrorBoundary>
        <ChunkLoadErrorBoundary fallback={null}>
          <AtlassianAccountMigrationStageBanners />
        </ChunkLoadErrorBoundary>
        <ChunkLoadErrorBoundary fallback={null}>
          <BoardBannerList />
        </ChunkLoadErrorBoundary>
      </Suspense>
    </ComponentWrapper>
  );
};

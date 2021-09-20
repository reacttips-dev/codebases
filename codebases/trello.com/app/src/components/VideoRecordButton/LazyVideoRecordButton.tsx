import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import type { VideoRecordButtonProps } from './VideoRecordButton';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { Null } from 'app/src/components/Null';

export const LazyVideoRecordButton: React.FunctionComponent<VideoRecordButtonProps> = (
  props,
) => {
  const isLoomIntegrationEnabled = useFeatureFlag(
    'teamplates.web.loom-integration',
    false,
  );

  const VideoRecordButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "video-record-button" */ './VideoRecordButton'
      ),
    { namedImport: 'VideoRecordButton', preload: isLoomIntegrationEnabled },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.VideoRecordButton,
      }}
      errorHandlerComponent={Null}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <VideoRecordButton {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};

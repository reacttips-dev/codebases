import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';
import { ErrorProps } from './Error.types';

export const LazyError: React.FunctionComponent<ErrorProps> = (props) => {
  const Error = useLazyComponent(
    () => import(/* webpackChunkName: "error" */ 'app/src/components/Error'),
    { namedImport: 'Error' },
  );
  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <Error {...props} />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};

import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { useFeatureFlag } from '@trello/feature-flag-client';

export const LazyApolloSandbox = () => {
  const ApolloSandbox = useLazyComponent(
    () => import(/* webpackChunkName: "apollo-sandbox" */ './ApolloSandbox'),
    { namedImport: 'ApolloSandbox', preload: false },
  );

  const apolloSandboxEnabled = useFeatureFlag('fep.apollo_sandbox', false);

  return apolloSandboxEnabled ? (
    <Suspense fallback={null}>
      <ApolloSandbox />
    </Suspense>
  ) : null;
};

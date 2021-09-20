import React from 'react';

import { ApolloProvider } from '@trello/graphql';
import { ReduxProvider } from 'app/src/components/ReduxProvider';

import { useFeatureFlag } from '@trello/feature-flag-client';

export const ComponentWrapper: React.FunctionComponent = ({ children }) => {
  // If this feature flag is on, we want to disable the suppression of the existing
  // global click handling code. To do this, we'll omit the `div.js-react-root`
  // wrapper below when rendering (which means clicks that occur within this content
  // will be handled by the existing global click handling code).
  const enableGlobalClickHandling = useFeatureFlag(
    'fep.enable-global-click-handling',
    false,
  );

  const content = (
    <ApolloProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </ApolloProvider>
  );

  return enableGlobalClickHandling ? (
    content
  ) : (
    <div className="js-react-root">{content}</div>
  );
};

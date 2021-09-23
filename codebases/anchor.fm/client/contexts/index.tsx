import React from 'react';
import { BrowserSizeProvider } from './BrowserSize';
import { NetworkRoleProvider } from './NetworkRole';
import { UnsavedChangesWarningProvider } from './UnsavedChangesWarning';
import { FeatureFlagsProvider } from './FeatureFlags';
import { CurrentUserProvider } from './CurrentUser';
import { ExperimentationProvider } from './Experimentation';
import { ReactQueryProvider } from './ReactQuery';

export function AppProviders({ children }: { children: JSX.Element }) {
  return (
    <ReactQueryProvider>
      <CurrentUserProvider>
        <ExperimentationProvider>
          <FeatureFlagsProvider>
            <UnsavedChangesWarningProvider>
              <NetworkRoleProvider>
                <BrowserSizeProvider>{children}</BrowserSizeProvider>
              </NetworkRoleProvider>
            </UnsavedChangesWarningProvider>
          </FeatureFlagsProvider>
        </ExperimentationProvider>
      </CurrentUserProvider>
    </ReactQueryProvider>
  );
}

import * as React from 'react';
import { isCdsTypographyMigrationEnabled } from 'bundles/authoring/featureFlags';
import { CmlCdsContextProvider } from 'bundles/cml/components/CmlCdsContext';

export const CdsTypographyMigrationContext = React.createContext({ isCdsTypographyMigrationEnabled: false });
export const CdsTypographyMigrationContextProvider: React.FC = ({ children }) => (
  <CdsTypographyMigrationContext.Provider
    value={{ isCdsTypographyMigrationEnabled: isCdsTypographyMigrationEnabled() }}
  >
    <CmlCdsContextProvider isCdsEnabled={isCdsTypographyMigrationEnabled()}>{children}</CmlCdsContextProvider>
  </CdsTypographyMigrationContext.Provider>
);

import React from 'react';
import { MigrationWizardProvider } from './MigrationWizardContext';
import { MigrationWizardBanner } from './MigrationWizardBanner';

export const MigrationWizard = () => {
  return (
    <MigrationWizardProvider>
      <MigrationWizardBanner />
    </MigrationWizardProvider>
  );
};

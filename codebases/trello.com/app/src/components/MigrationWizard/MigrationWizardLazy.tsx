import React, { Suspense } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

export const MigrationWizardLazy = () => {
  const MigrationWizard = useLazyComponent(
    () =>
      import(/* webpackChunkName: "migration-wizard" */ './MigrationWizard'),
    { namedImport: 'MigrationWizard' },
  );

  return (
    <Suspense fallback={null}>
      <MigrationWizard />
    </Suspense>
  );
};

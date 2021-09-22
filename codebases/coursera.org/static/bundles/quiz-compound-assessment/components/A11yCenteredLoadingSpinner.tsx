import React from 'react';
import CenteredLoadingSpinner from 'bundles/assess-common/components/CenteredLoadingSpinner';

const A11yCenteredLoadingSpinner: React.FC<{}> = () => (
  <div role="alert" aria-live="assertive">
    <CenteredLoadingSpinner />
  </div>
);

export default A11yCenteredLoadingSpinner;

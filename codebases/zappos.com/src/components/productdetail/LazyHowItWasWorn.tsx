import React from 'react';

import { HowItWasWornProps } from 'components/productdetail/HowItWasWorn';
import LazyComponent from 'components/common/LazyComponent';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

const HowItWasWorn = React.lazy(() => import('components/productdetail/HowItWasWorn'));

const LazyHowItWasWorn = (props: HowItWasWornProps) => (
  <LazyComponent>
    <HowItWasWorn {...props} />
  </LazyComponent>
);

LazyHowItWasWorn.displayName = 'LazyHowItWasWorn';

export default withErrorBoundary(LazyHowItWasWorn.displayName, LazyHowItWasWorn);

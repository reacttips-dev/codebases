import React, { Suspense } from 'react';

import IntersectionObserver from 'components/common/IntersectionObserver';
import { SmallLoader } from 'components/Loader';

const Loader = <SmallLoader />;

const options = {
  rootMargin: '800px 0px'
};

const LazyComponent = ({ children }) => (
  <IntersectionObserver options={options}>
    <Suspense fallback={Loader}>
      {children}
    </Suspense>
  </IntersectionObserver>
);

export default LazyComponent;

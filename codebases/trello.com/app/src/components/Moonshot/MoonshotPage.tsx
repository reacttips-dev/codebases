import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { usePossibleNewSignup } from './usePossibleNewSignup';

export const MoonshotPage: React.FunctionComponent = () => {
  const Moonshot = useLazyComponent(
    () => import(/* webpackChunkName: "moonshot" */ './Moonshot'),
    { namedImport: 'Moonshot' },
  );
  usePossibleNewSignup();

  return (
    <Suspense fallback={null}>
      <Moonshot />
    </Suspense>
  );
};

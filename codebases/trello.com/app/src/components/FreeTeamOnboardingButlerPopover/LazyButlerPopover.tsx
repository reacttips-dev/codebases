import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyButlerPopover: React.FunctionComponent<{
  boardId: string;
}> = (props) => {
  const ButlerPopover = useLazyComponent(
    () => import(/* webpackChunkName: "butler-popover" */ './ButlerPopover'),
    { namedImport: 'ButlerPopover' },
  );
  return (
    <Suspense fallback={null}>
      <ButlerPopover {...props} />
    </Suspense>
  );
};

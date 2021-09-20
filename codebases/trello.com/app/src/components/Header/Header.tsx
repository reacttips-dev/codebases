import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { HeaderSkeleton } from 'app/src/components/HeaderSkeleton';
import { useWorkspaceNavigation } from 'app/src/components/WorkspaceNavigation';

export const Header = () => {
  const ReduxHeader = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "header" */ 'app/gamma/src/components/header'
      ),
  );
  const [{ enabled: workspaceNavigationEnabled }] = useWorkspaceNavigation();

  return (
    <div
      data-desktop-id="header"
      // needed for hiding the header in madlibs and moonshot
      // create-first-board and create-first-team
      data-js-id="header-container"
      style={{
        // 32px tall, plus 4px padding-{top,bottom}. The {min,max}-height
        // combo alongside overflow: hidden is necessary to prevent render
        // jank (specifically on the home route). We should fix this at some
        // point
        minHeight: workspaceNavigationEnabled ? '44px' : '40px',
        maxHeight: workspaceNavigationEnabled ? '44px' : '40px',
        overflow: 'hidden',
      }}
    >
      <Suspense fallback={<HeaderSkeleton />}>
        <ReduxHeader />
      </Suspense>
    </div>
  );
};

import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyTemplateTipsPopover: React.FunctionComponent<{
  boardId: string;
  isInGallery: boolean;
  name: string;
  username: string;
  toggleAboutThisTemplate: () => void;
  toggleBackgroundSelector: () => void;
}> = ({
  boardId,
  isInGallery,
  name,
  username,
  toggleAboutThisTemplate,
  toggleBackgroundSelector,
}) => {
  const TemplateTipsPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "template-tips-popovers" */ './TemplateTipsPopover'
      ),
  );
  return (
    <Suspense fallback={null}>
      <TemplateTipsPopover
        boardId={boardId}
        isInGallery={isInGallery}
        name={name}
        username={username}
        toggleAboutThisTemplate={toggleAboutThisTemplate}
        toggleBackgroundSelector={toggleBackgroundSelector}
      />
    </Suspense>
  );
};

import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const globalClickHandler = require('app/scripts/views/internal/global-click-handler');

/**
 * NOTE:
 * If you are building components in the new GraphQL stack, you should be
 * using the renderComponent/ComponentWrapper combination. This react root
 * is for legacy React components in the classic stack only
 */

export const ReactRootComponent: React.FC = ({ children }) => {
  const onClick = (e: React.MouseEvent) => {
    if (e.isDefaultPrevented()) {
      return;
    }
    globalClickHandler(e);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="js-react-root"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onClick}
      >
        {children}
      </div>
    </DndProvider>
  );
};

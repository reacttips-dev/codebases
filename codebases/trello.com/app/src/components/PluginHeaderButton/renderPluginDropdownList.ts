import React from 'react';
import type { Board } from './PluginHeaderButton.types';

import { PluginListButton } from './PluginListButton';
import { renderComponent } from 'app/src/components/ComponentWrapper';

export const renderPluginDropdownList = (
  container: Element,
  board: Board,
  openEnabled: () => object,
  openDirectory: () => object,
) => {
  if (!container) {
    return;
  }

  return renderComponent(
    React.createElement(PluginListButton, {
      container: container,
      board: board,
      openEnabled: openEnabled,
      openDirectory: openDirectory,
    }),
    container,
  );
};

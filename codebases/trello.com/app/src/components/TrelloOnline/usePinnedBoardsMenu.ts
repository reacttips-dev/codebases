// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';
import { SidebarState } from 'app/scripts/view-models/sidebar-state';
import { useEffect } from 'react';
import Backbone from '@trello/backbone';

function updatePinnedDrawer() {
  $('#trello-root').toggleClass(
    'body-pinned-drawer',
    SidebarState.getPinSidebar(),
  );
}

export const usePinnedBoardsMenu = () => {
  useEffect(() => {
    updatePinnedDrawer();
    Backbone.Events.listenTo(
      SidebarState,
      'change:pinBoardsListSidebar',
      updatePinnedDrawer,
    );

    return () => {
      Backbone.Events.stopListening(
        SidebarState,
        'change:pinBoardsListSidebar',
        updatePinnedDrawer,
      );
    };
  }, []);
};

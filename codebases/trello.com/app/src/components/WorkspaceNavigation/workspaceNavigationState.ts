import { memberId } from '@trello/session-cookie';
import { PersistentSharedState } from '@trello/shared-state';

interface WorkspaceNavigationState {
  expanded: boolean;
  enabled: boolean;
  expandedViewStatus:
    | 'visible-transition-complete'
    | 'visible-in-transition'
    | 'hidden-transition-complete'
    | 'hidden-in-transition';
}

// this only applies to the very first time the user view workspace nav
// after that, PersistentSharedState will read expanded/collapse from local storage
const initializeExpanded = false;

// eslint-disable-next-line @trello/no-module-logic
export const workspaceNavigationState = new PersistentSharedState<WorkspaceNavigationState>(
  {
    expanded: initializeExpanded,
    enabled: false,
    expandedViewStatus: initializeExpanded
      ? 'visible-transition-complete'
      : 'hidden-transition-complete',
  },
  { storageKey: `workspaceNavigation-${memberId ?? 'anonymous'}` },
);

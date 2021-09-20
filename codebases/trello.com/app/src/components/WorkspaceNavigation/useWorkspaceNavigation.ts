import { useSharedState } from '@trello/shared-state';

import { workspaceNavigationState } from './workspaceNavigationState';

export function useWorkspaceNavigation() {
  return useSharedState(workspaceNavigationState);
}

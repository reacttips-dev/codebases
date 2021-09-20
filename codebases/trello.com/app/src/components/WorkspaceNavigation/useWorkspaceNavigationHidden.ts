import { useSharedState } from '@trello/shared-state';

import { workspaceNavigationHiddenState } from './workspaceNavigationHiddenState';

export function useWorkspaceNavigationHidden() {
  return useSharedState(workspaceNavigationHiddenState);
}

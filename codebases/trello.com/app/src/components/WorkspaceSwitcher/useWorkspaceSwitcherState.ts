import { useSharedState } from '@trello/shared-state';

import { workspaceSwitcherState } from './workspaceSwitcherState';

export function useWorkspaceSwitcherState() {
  return useSharedState(workspaceSwitcherState);
}

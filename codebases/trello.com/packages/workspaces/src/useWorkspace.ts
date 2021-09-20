import { useSharedState } from '@trello/shared-state';

import { workspaceState } from './workspaceState';

export function useWorkspace() {
  const [workspace] = useSharedState(workspaceState);
  return workspace;
}

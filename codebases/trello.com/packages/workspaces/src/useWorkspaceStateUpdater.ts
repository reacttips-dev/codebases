import isEqual from 'react-fast-compare';
import { useEffect } from 'react';

import { useLocation } from '@trello/router';
import { useSharedState } from '@trello/shared-state';

import { workspaceState } from './workspaceState';
import { useWorkspaceForPathname } from './useWorkspaceForPathname';

export function useWorkspaceStateUpdater() {
  const { pathname } = useLocation();
  const nextWorkspace = useWorkspaceForPathname(pathname);
  const [workspace, setWorkspace] = useSharedState(workspaceState);

  useEffect(() => {
    if (isEqual(workspace, nextWorkspace)) {
      return;
    }

    setWorkspace(nextWorkspace);
  }, [workspace, nextWorkspace, setWorkspace]);
}

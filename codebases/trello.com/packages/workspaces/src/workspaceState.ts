import { SharedState } from '@trello/shared-state';

export interface WorkspaceState {
  idWorkspace: string | null;
  isGlobal: boolean;
  isLoading: boolean;
  idBoard: string | null;
  idCard: string | null;
  idWorkspaceView: string | null;
}

export const workspaceState = new SharedState<WorkspaceState>({
  idWorkspace: null,
  isGlobal: false,
  isLoading: false,
  idBoard: null,
  idCard: null,
  idWorkspaceView: null,
});

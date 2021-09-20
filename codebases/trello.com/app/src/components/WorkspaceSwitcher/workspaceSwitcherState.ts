import { SharedState } from '@trello/shared-state';

interface WorkspaceSwitcherState {
  visible: boolean;
}

export const workspaceSwitcherState = new SharedState<WorkspaceSwitcherState>({
  visible: false,
});

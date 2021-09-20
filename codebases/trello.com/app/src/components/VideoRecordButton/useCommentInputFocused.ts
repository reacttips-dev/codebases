import { useSharedState } from '@trello/shared-state';

import { commentInputFocusedState } from './commentInputFocusedState';

export function useCommentInputFocused() {
  return useSharedState(commentInputFocusedState);
}

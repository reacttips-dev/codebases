import { featureFlagClient } from '@trello/feature-flag-client';

export function maxSelectableBoards(): number {
  return featureFlagClient.get('remarkable.org-table-view-board-limit', 10);
}

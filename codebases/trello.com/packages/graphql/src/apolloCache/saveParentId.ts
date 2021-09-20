import { FieldReadFunction } from '@apollo/client';
import { featureFlagClient } from '@trello/feature-flag-client';

export const saveParentId: FieldReadFunction = (
  existing,
  { readField, storage },
) => {
  if (featureFlagClient.get('fep.apollo_cache_realtime_filters', false)) {
    storage.parentId = readField<string>('id');
  }
  // Persist parent id for using in merge function
  return existing;
};

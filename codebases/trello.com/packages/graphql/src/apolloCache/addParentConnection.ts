import { FieldMergeFunction } from '@apollo/client';
import { featureFlagClient } from '@trello/feature-flag-client';
import { addChildrenToParentConnection } from './relation';
import { OneToManyRelation } from './relation.types';

export const addParentConnection: (
  relation: OneToManyRelation,
) => FieldMergeFunction = (relation) => (_, incoming, options) => {
  if (featureFlagClient.get('fep.apollo_cache_realtime_filters', false)) {
    const parentId = options.storage?.parentId;
    parentId &&
      addChildrenToParentConnection(
        incoming ?? [],
        parentId,
        relation,
        options,
      );
  }
  return incoming;
};

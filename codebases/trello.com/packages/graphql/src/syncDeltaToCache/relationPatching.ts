import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { featureFlagClient } from '@trello/feature-flag-client';
import {
  writeSingleRelation,
  writeMultipleRelation,
  RelatedIdMap,
  writeBatchSingleRelations,
  readBatchMultipleRelations,
  writeBatchMultipleRelations,
} from './cacheOperations';

export interface RelationToSingleData {
  modelName: string;
  id: string;
  relatedModelName: string;
  relatedId: string | null;
  previousRelatedId: string | null | undefined;
  updateRelatedFilters: () => void;
}

export interface RelationToMultipleData {
  modelName: string;
  id: string;
  relatedModelName: string;
  relatedIds: string[];
  previousRelatedIds: string[] | undefined;
  updateRelatedFilters?: () => void;
}

export const patchSimpleSingleRelation = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { modelName, id, relatedModelName, relatedId }: RelationToSingleData,
) => {
  writeSingleRelation(apolloClient, {
    modelName,
    id,
    relatedModelName,
    relatedId,
  });

  // We are only patching a single one-way relation here
  return 1;
};

export const patchSimpleMultipleRelation = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { modelName, id, relatedModelName, relatedIds }: RelationToMultipleData,
) => {
  writeMultipleRelation(apolloClient, {
    modelName,
    id,
    relatedModelName,
    relatedIds,
  });

  // We are only patching a single one-way relation here
  return 1;
};

export const patchOneToOneRelation = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    modelName,
    id,
    relatedModelName,
    relatedId,
    previousRelatedId,
  }: RelationToSingleData,
) => {
  // Write the simple relation
  writeSingleRelation(apolloClient, {
    modelName,
    id,
    relatedModelName,
    relatedId,
  });

  // We need to update the previous related entity to remove the relation
  const relatedIdMap: RelatedIdMap = {};
  if (previousRelatedId && previousRelatedId !== relatedId) {
    relatedIdMap[previousRelatedId] = null;
  }

  // For the related id, we need to make the association _back to us_
  if (relatedId !== null) {
    relatedIdMap[relatedId] = id;
  }

  writeBatchSingleRelations(apolloClient, {
    modelName: relatedModelName,
    relatedModelName: modelName,
    relatedIdMap,
  });

  // Return the number of relatedIds we had to write with the batch
  return Object.keys(relatedIdMap).length;
};

export const patchOneToManyRelation = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    modelName,
    id,
    relatedModelName,
    relatedId,
    previousRelatedId,
    updateRelatedFilters,
  }: RelationToSingleData,
) => {
  // Write the simple relation
  writeSingleRelation(apolloClient, {
    modelName,
    id,
    relatedModelName,
    relatedId,
  });

  const ids = [previousRelatedId, relatedId].filter(
    (nullableId) => !!nullableId,
  ) as string[];
  const relatedIdsMap = readBatchMultipleRelations(apolloClient, {
    ids,
    modelName: relatedModelName,
    relatedModelName: modelName,
  });

  if (featureFlagClient.get('fep.apollo_cache_realtime_filters', false)) {
    updateRelatedFilters();
  }

  // We need to update the _old_ related entity to remove us from its list
  if (previousRelatedId && previousRelatedId !== relatedId) {
    const reverseRelatedIds = relatedIdsMap[previousRelatedId];
    if (reverseRelatedIds && reverseRelatedIds.includes(id)) {
      relatedIdsMap[previousRelatedId] = reverseRelatedIds.filter(
        (reverseRelatedId) => reverseRelatedId !== id,
      );
    }
  }

  // Ensure that our id is in our related model's array of ids
  if (relatedId !== null) {
    const reverseRelatedIds = relatedIdsMap[relatedId];
    if (reverseRelatedIds && !reverseRelatedIds.includes(id)) {
      relatedIdsMap[relatedId] = [...reverseRelatedIds, id];
    }
  }

  writeBatchMultipleRelations(apolloClient, {
    modelName: relatedModelName,
    relatedModelName: modelName,
    relatedIdsMap,
  });

  // Return the number of relatedIds we had to write with the batch
  return Object.keys(relatedIdsMap).length;
};

export const patchManyToOneRelation = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    modelName,
    id,
    relatedModelName,
    relatedIds,
    previousRelatedIds,
  }: RelationToMultipleData,
) => {
  const removedRelatedIds =
    previousRelatedIds &&
    previousRelatedIds.filter(
      (previousRelatedId) => !relatedIds.includes(previousRelatedId),
    );

  // Write the simple relation
  writeMultipleRelation(apolloClient, {
    modelName,
    id,
    relatedModelName,
    relatedIds,
  });

  // We need to update the previous related entity to remove the relation to us
  const relatedIdMap: RelatedIdMap = {};
  if (removedRelatedIds && removedRelatedIds.length > 0) {
    removedRelatedIds.forEach((removedId) => {
      relatedIdMap[removedId] = null;
    });
  }

  // For every related id, we need to make the single association _back to us_
  relatedIds.forEach((relatedId) => {
    relatedIdMap[relatedId] = id;
  });

  writeBatchSingleRelations(apolloClient, {
    modelName: relatedModelName,
    relatedModelName: modelName,
    relatedIdMap,
  });

  // Return the number of relatedIds we had to write with the batch
  return Object.keys(relatedIdMap).length;
};

export const patchManyToManyRelation = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    modelName,
    id,
    relatedModelName,
    relatedIds = [],
    previousRelatedIds,
    updateRelatedFilters,
  }: RelationToMultipleData,
) => {
  const removedRelatedIds =
    previousRelatedIds &&
    previousRelatedIds.filter(
      (previousRelatedId) => !relatedIds.includes(previousRelatedId),
    );

  // Write the simple relation
  writeMultipleRelation(apolloClient, {
    modelName,
    id,
    relatedModelName,
    relatedIds,
  });

  const ids = removedRelatedIds
    ? [...removedRelatedIds, ...relatedIds]
    : relatedIds;
  const relatedIdsMap = readBatchMultipleRelations(apolloClient, {
    ids,
    modelName: relatedModelName,
    relatedModelName: modelName,
  });

  // We need to update the previous related entity to remove the relation to us
  if (removedRelatedIds && removedRelatedIds.length > 0) {
    removedRelatedIds.forEach((removedId) => {
      const reverseRelatedIds = relatedIdsMap[removedId];
      if (reverseRelatedIds && reverseRelatedIds.includes(id)) {
        relatedIdsMap[removedId] = reverseRelatedIds.filter(
          (reverseRelatedId) => reverseRelatedId !== id,
        );
      }
    });
  }

  // For every related id, we need to ensure our it has _us_ in its list of models
  relatedIds.forEach((relatedId) => {
    const reverseRelatedIds = relatedIdsMap[relatedId];
    if (reverseRelatedIds && !reverseRelatedIds.includes(id)) {
      relatedIdsMap[relatedId] = [...reverseRelatedIds, id];
    }
  });

  writeBatchMultipleRelations(apolloClient, {
    modelName: relatedModelName,
    relatedModelName: modelName,
    relatedIdsMap,
  });

  if (
    featureFlagClient.get('fep.apollo_cache_realtime_filters', false) &&
    updateRelatedFilters
  ) {
    updateRelatedFilters();
  }

  // Return the number of related ids we had to write with the batch
  return Object.keys(relatedIdsMap).length;
};

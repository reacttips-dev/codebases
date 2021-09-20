import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { DataWithId, JSONArray, TypedJSONValue } from '../types';

import { firstLetterToLower, pluralize } from '../stringOperations';
import memoizeOne from 'memoize-one';
import { DocumentNode } from 'graphql';
import { queryFromPojo } from './queryFromPojo';

const areArraysEqualSets = (a1: string[], a2: string[]) => {
  return a1.length === a2.length && a1.every((v) => a2.includes(v));
};

/**
 * Writes data directly to the cache and silences warnings
 */
export const writeDirect = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { modelName, data }: WriteDirectArgs,
) => {
  const r = {
    [firstLetterToLower(modelName)]: data,
  };
  try {
    apolloClient.writeQuery({
      query: queryFromPojo(r),
      data: r,
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
  }
};

/**
 * Creates a graphql query for reading/writing a single relation to/from the cache
 * For example, a List->Board relation (a List is owned by a single Board)
 * Note that we don't pass the actual id in here, instead we have a $id variable that
 * will be passed in as a variable for the actual cache operation. According to our measurements
 * this is much faster than string substitution of the id
 */
// eslint-disable-next-line @trello/no-module-logic
const createSingleRelationQuery = memoizeOne(
  (modelName: string, relatedModelName: string) => {
    return gql`
    query {
      ${firstLetterToLower(modelName)}(id: $id) @client {
        id
        ${firstLetterToLower(relatedModelName)} {
          id
        }
      }
    }
  `;
  },
);

/**
 * Creates a graphql query for reading/writing a multiple relation to/from the cache
 * For example, a Member->Board relation (a Member is on many Boards)
 * Note that we don't pass the actual id in here, instead we have a $id variable that
 * will be passed in as a variable for the actual cache operation. According to our measurements
 * this is much faster than string substitution of the id
 */
// eslint-disable-next-line @trello/no-module-logic
const createMultipleRelationQuery = memoizeOne(
  (modelName: string, relatedModelName: string) => {
    return gql`
    query {
      ${firstLetterToLower(modelName)}(id: $id) @client {
        id
        ${pluralize(firstLetterToLower(relatedModelName))} {
          id
        }
      }
    }
  `;
  },
);

/**
 * Creates a graphql query for reading/writing many _multiple_ relations to/from the cache
 * For example, reading the Member ids corresponding to every Board id passed in
 * Note that we pass the 'ids' in here and string substitute it directly into the query, rather
 * than having a $ids query variable, because its much faster according to our measurments... (?)
 */
const createBatchMultipleRelationQuery = (
  modelName: string,
  relatedModelName: string,
  ids: string[],
) => {
  const parent = pluralize(firstLetterToLower(modelName));
  const child = pluralize(firstLetterToLower(relatedModelName));
  const idsArg = JSON.stringify(ids);
  return gql`
    query {
      ${parent}(ids: ${idsArg}) @client {
        id
        ${child} {
          id
        }
      }
    }
  `;
};

interface CreateSingleRelationDataArgs {
  modelName: string;
  id: string;
  relatedModelName: string;
  relatedId: string;
}

/**
 * Creates a 'blob' of data for writing a single relationship to the cache (eg. card->list)
 */
const createSingleRelationData = ({
  modelName,
  id,
  relatedModelName,
  relatedId,
}: CreateSingleRelationDataArgs) => {
  return {
    id,
    __typename: modelName,
    [firstLetterToLower(relatedModelName)]: {
      id: relatedId,
      __typename: relatedModelName,
    },
  };
};

interface CreateRemoveSingleRelationDataArgs {
  modelName: string;
  id: string;
  relatedModelName: string;
}

/**
 * Creates a 'blob' of data for removing a single relationship to the cache (eg. board->organization)
 */
const createRemoveSingleRelationData = ({
  modelName,
  id,
  relatedModelName,
}: CreateRemoveSingleRelationDataArgs) => {
  return {
    id,
    __typename: modelName,
    [firstLetterToLower(relatedModelName)]: null,
  };
};

interface CreateMultipleRelationDataArgs {
  modelName: string;
  id: string;
  relatedModelName: string;
  relatedIds: string[];
}

/**
 * Creates a 'blob' of data for writing a multiple relationship to the cache (eg. board->members)
 */
const createMultipleRelationData = ({
  modelName,
  id,
  relatedModelName,
  relatedIds,
}: CreateMultipleRelationDataArgs) => {
  return {
    id,
    __typename: modelName,
    [pluralize(firstLetterToLower(relatedModelName))]: relatedIds.map(
      (relatedId) => ({
        id: relatedId,
        __typename: relatedModelName,
      }),
    ),
  };
};

export interface RelatedIdMap {
  [id: string]: string | null;
}

export interface RelatedIdsMap {
  [id: string]: string[];
}

interface ReadSingleRelationWithQueryArgs {
  modelName: string;
  id: string;
  relatedModelName: string;
}

/**
 * Reads an existing 'single' relation to get the associated item's id from the cache
 * if it exists.
 */
const readSingleRelationWithQuery = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { id, modelName, relatedModelName }: ReadSingleRelationWithQueryArgs,
): string | null | undefined => {
  // We want to check our cache to see if a relationship already exists
  const query = createSingleRelationQuery(modelName, relatedModelName);

  let value = undefined;
  try {
    // Attempting to read this query will either give us _something_, or it will throw if
    // the query could not be resolved by the cache
    value = apolloClient.readQuery({ query, variables: { id } });
  } catch (e) {
    // Do nothing, an error here means we couldn't resolve the query from the cache
    // so the relationship doesn't exist
  }

  // A falsy value on the read means this relationship doesn't exist
  if (!value) {
    return undefined;
  }
  const outerName = firstLetterToLower(modelName);
  const innerName = firstLetterToLower(relatedModelName);

  // This is a paranoid check. If a resolver has failed a fetch, it may have
  // nuked the parent of the relationship, so we should be paranoid about
  // ensuring it exists.
  if (
    value[outerName] === undefined ||
    value[outerName] === null ||
    value[outerName][innerName] === undefined
  ) {
    return undefined;
  }

  // A null value for the related entity means the relation _exists_, it's just empty
  if (value[outerName][innerName] === null) {
    return null;
  }

  return value[outerName][innerName].id;
};

interface ReadSingleRelationWithFragmentArgs<T> {
  modelName: string;
  id: string;
  relatedIdFragment: DocumentNode;
  getRelatedId: (fragmentResult: T) => string | null | undefined;
}

/**
 * Reads an existing related id by using a fragment, combined with a getRelatedId
 * function to unpack the results
 */
const readSingleRelationWithFragment = <T>(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    id,
    modelName,
    relatedIdFragment,
    getRelatedId,
  }: ReadSingleRelationWithFragmentArgs<T>,
): string | null | undefined => {
  let value: T | undefined = undefined;
  try {
    value = apolloClient.cache.readFragment({
      id: `${modelName}:${id}`,
      fragment: relatedIdFragment,
    }) as T;
  } catch {
    // no previous value found
  }

  if (value) {
    return getRelatedId(value);
  } else {
    return undefined;
  }
};

type ReadSingleRelationArgs<T> = ReadSingleRelationWithFragmentArgs<T> &
  ReadSingleRelationWithQueryArgs;

export const readSingleRelation = <T>(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    id,
    modelName,
    relatedModelName,
    relatedIdFragment,
    getRelatedId,
  }: ReadSingleRelationArgs<T>,
): string | null | undefined => {
  // First read related id from the fragment (eg. idOrganization)
  const relatedIdFromFragment = readSingleRelationWithFragment(apolloClient, {
    id,
    modelName,
    relatedIdFragment,
    getRelatedId,
  });

  if (relatedIdFromFragment !== undefined) {
    return relatedIdFromFragment;
  }

  // If we could not read from the fragment, attempt to read as a query on the
  // relation itself(eg. board -> organization)
  return readSingleRelationWithQuery(apolloClient, {
    id,
    modelName,
    relatedModelName,
  });
};

interface ReadMultipleRelationWithQueryArgs {
  modelName: string;
  id: string;
  relatedModelName: string;
}

/**
 * Reads an existing 'multiple' relation to get the associated items' ids from the cache
 * if they exist.
 */
const readMultipleRelationWithQuery = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { id, modelName, relatedModelName }: ReadMultipleRelationWithQueryArgs,
): string[] | undefined => {
  // We want to check our cache to see if a relationship already exists
  const query = createMultipleRelationQuery(modelName, relatedModelName);

  let value = undefined;
  try {
    // Attempting to read this query will either give us _something_, or it will throw if
    // the query could not be resolved by the cache
    value = apolloClient.readQuery({ query, variables: { id } });
  } catch (e) {
    // Do nothing, an error here means we couldn't resolve the query from the cache
    // so the relationship doesn't exist
  }

  // A falsy value on the read means this relationship doesn't exist
  if (!value) {
    return undefined;
  }

  const outerName = firstLetterToLower(modelName);
  const innerName = pluralize(firstLetterToLower(relatedModelName));

  // This is a paranoid check. If a resolver has failed a fetch, it may have
  // nuked the parent of the relationship, so we should be paranoid about
  // ensuring it exists.
  if (
    value[outerName] === undefined ||
    value[outerName] === null ||
    value[outerName][innerName] === undefined ||
    !Array.isArray(value[outerName][innerName])
  ) {
    return undefined;
  }

  return value[outerName][innerName].map((item: DataWithId) => item.id);
};

interface ReadMultipleRelationWithFragmentArgs<T> {
  modelName: string;
  id: string;
  relatedIdsFragment: DocumentNode;
  getRelatedIds: (fragmentResult: T) => string[] | undefined;
}

/**
 * Reads existing related ids by using a fragment, combined with a getRelatedId
 * function to unpack the results
 */
const readMultipleRelationWithFragment = <T>(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    id,
    modelName,
    relatedIdsFragment,
    getRelatedIds,
  }: ReadMultipleRelationWithFragmentArgs<T>,
): string[] | undefined => {
  let value: T | undefined = undefined;
  try {
    value = apolloClient.cache.readFragment({
      id: `${modelName}:${id}`,
      fragment: relatedIdsFragment,
    }) as T;
  } catch {
    // no previous value found
  }

  if (value) {
    return getRelatedIds(value);
  } else {
    return undefined;
  }
};

type ReadMultipleRelationArgs<T> = ReadMultipleRelationWithFragmentArgs<T> &
  ReadMultipleRelationWithQueryArgs;

export const readMultipleRelation = <T>(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    id,
    modelName,
    relatedModelName,
    relatedIdsFragment,
    getRelatedIds,
  }: ReadMultipleRelationArgs<T>,
): string[] | undefined => {
  // First read related ids from the fragment (eg. idMembers)
  const relatedIdsFromFragment = readMultipleRelationWithFragment(
    apolloClient,
    {
      id,
      modelName,
      relatedIdsFragment,
      getRelatedIds,
    },
  );

  if (relatedIdsFromFragment !== undefined) {
    return relatedIdsFromFragment;
  }

  // If we could not read from the fragment, attempt to read as a query on the
  // relation itself(eg. board -> members)
  return readMultipleRelationWithQuery(apolloClient, {
    id,
    modelName,
    relatedModelName,
  });
};

interface ReadBatchMultipleRelationsArgs {
  modelName: string;
  ids: string[];
  relatedModelName: string;
}

/**
 * Reads an existing 'multiple' relation to get the associated items' ids from the cache
 * if they exist.
 */
export const readBatchMultipleRelations = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { ids, modelName, relatedModelName }: ReadBatchMultipleRelationsArgs,
): RelatedIdsMap => {
  // We want to check our cache to see if a relationship already exists
  const query = createBatchMultipleRelationQuery(
    modelName,
    relatedModelName,
    ids,
  );

  let value = undefined;
  try {
    value = apolloClient.readQuery({ query });
  } catch (e) {
    // We couldn't read the whole thing in a batch, fallback to multiple reads
  }

  const relatedIdsMap: RelatedIdsMap = {};

  // If we couldn't perform a speedy batch read, fall back to doing a read per id
  if (!value || !value[pluralize(firstLetterToLower(modelName))]) {
    ids.forEach((id) => {
      const relatedIds = readMultipleRelationWithQuery(apolloClient, {
        modelName,
        relatedModelName,
        id,
      });
      if (relatedIds !== undefined) {
        relatedIdsMap[id] = relatedIds;
      }
    });
    return relatedIdsMap;
  }

  // Unpack the batched results into a simple relatedIdsMap
  value[pluralize(firstLetterToLower(modelName))].forEach(
    (model: DataWithId) => {
      const relatedModels = model[
        pluralize(firstLetterToLower(relatedModelName))
      ] as JSONArray;
      if (relatedModels) {
        relatedIdsMap[model.id] = relatedModels.map(
          // @ts-ignore
          (relatedModel: DataWithId) => relatedModel.id,
        );
      }
    },
  );

  return relatedIdsMap;
};

interface WriteSingleRelationArgs {
  modelName: string;
  id: string;
  relatedModelName: string;
  relatedId: string | null;
}

/**
 * Writes an assocation from one entity to another to the cache (eg. list->board)
 */
export const writeSingleRelation = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { id, modelName, relatedModelName, relatedId }: WriteSingleRelationArgs,
) => {
  const existingRelatedId = readSingleRelationWithQuery(apolloClient, {
    modelName,
    id,
    relatedModelName,
  });

  // If we read a value, we can early exit if the relationship is already present
  // in the cache
  if (existingRelatedId !== undefined && existingRelatedId === relatedId) {
    return;
  }

  // If related id is null, we are removing an existing relationship
  const data =
    relatedId !== null
      ? createSingleRelationData({
          modelName,
          id,
          relatedModelName,
          relatedId,
        })
      : createRemoveSingleRelationData({
          modelName,
          id,
          relatedModelName,
        });

  writeDirect(apolloClient, { modelName, data });
};

interface WriteMultipleRelationArgs {
  modelName: string;
  id: string;
  relatedModelName: string;
  relatedIds: string[];
}

/**
 * Writes an assocation from one entity to multiple other entities to the cache (eg. list->cards)
 * This 'overwrites' the entire existing relationship with a new one.
 */
export const writeMultipleRelation = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { id, modelName, relatedModelName, relatedIds }: WriteMultipleRelationArgs,
) => {
  const existingRelatedIds = readMultipleRelationWithQuery(apolloClient, {
    modelName,
    id,
    relatedModelName,
  });

  // If we read a value, we can early exit if the relationship is already present
  // in the cache, and all the relatedIds are the same
  if (
    existingRelatedIds !== undefined &&
    areArraysEqualSets(existingRelatedIds, relatedIds)
  ) {
    return;
  }

  // If we didn't have this relationship in the cache, we can write a small query
  // to form the relationship
  const data = createMultipleRelationData({
    modelName,
    id,
    relatedModelName,
    relatedIds,
  });

  writeDirect(apolloClient, { modelName, data });
};

interface WriteBatchSingleRelationsArgs {
  modelName: string;
  relatedModelName: string;
  relatedIdMap: RelatedIdMap;
}

/**
 * Writes many _single_ relations from one entity to another to the cache (eg. list->board)
 */
export const writeBatchSingleRelations = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  { modelName, relatedModelName, relatedIdMap }: WriteBatchSingleRelationsArgs,
) => {
  Object.entries(relatedIdMap).forEach(([id, relatedId]) => {
    writeSingleRelation(apolloClient, {
      id,
      modelName,
      relatedModelName,
      relatedId,
    });
  });
};

interface WriteBatchMultipleRelationsArgs {
  modelName: string;
  relatedModelName: string;
  relatedIdsMap: RelatedIdsMap;
}

/**
 * Writes many _multiple_ relations from one entity to another to the cache (eg. board->member)
 */
export const writeBatchMultipleRelations = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  {
    modelName,
    relatedModelName,
    relatedIdsMap,
  }: WriteBatchMultipleRelationsArgs,
) => {
  Object.entries(relatedIdsMap).forEach(([id, relatedIds]) => {
    writeMultipleRelation(apolloClient, {
      modelName,
      id,
      relatedModelName,
      relatedIds,
    });
  });
};

interface WriteDirectArgs {
  modelName: string;
  data: TypedJSONValue;
}

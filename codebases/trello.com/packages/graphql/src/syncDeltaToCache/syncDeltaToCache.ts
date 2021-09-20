import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { addTypenames } from '../prepareDataForApolloCache';
import { firstLetterToLower } from '../stringOperations';
import { DataWithId, QueryParams, JSONObject } from '../types';
import {
  writeDirect,
  readMultipleRelation,
  readSingleRelation,
} from './cacheOperations';
import {
  Member,
  Organization,
  Card,
  Board,
  List,
  Label,
  Checklist,
} from '../generated';
import {
  RelationToSingleData,
  RelationToMultipleData,
  patchSimpleSingleRelation,
  patchSimpleMultipleRelation,
  patchOneToOneRelation,
  patchOneToManyRelation,
  patchManyToOneRelation,
  patchManyToManyRelation,
} from './relationPatching';
import { getUnsafeFields } from './getUnsafeFields';
import { featureFlagClient } from '@trello/feature-flag-client';
import { DocumentNode } from 'graphql';
import { Analytics } from '@trello/atlassian-analytics';
import { removeDeleted, assignListToFilters } from './filteredListPatching';
import {
  assignCardToFilters,
  updateCardsInVisibleList,
} from './filteredCardsPatching/filteredCardsPatching';
import {
  CardsOnListFragment,
  CardsOnListFragmentDoc,
  CheckItemsAssignedCardsOnListFragment,
  CheckItemsAssignedCardsOnListFragmentDoc,
  ClosedCardsOnListFragment,
  ClosedCardsOnListFragmentDoc,
  OpenCardsOnListFragment,
  OpenCardsOnListFragmentDoc,
  TemplateCardsOnListFragment,
  TemplateCardsOnListFragmentDoc,
  VisibleCardsOnListFragment,
  VisibleCardsOnListFragmentDoc,
} from './CardsOnListFragment.generated';
import {
  ClosedListFragment,
  ClosedListFragmentDoc,
} from './ClosedListFragment.generated';
import {
  assignBoardToFilters,
  BoardFilter,
} from './filteredBoardsPatching/filteredBoardsPatching';

interface EventContext {
  [key: string]: string | number | boolean;
}

interface ImpliedRelationToMany {
  hasMany: true;
  isImplied: true;
}

interface ActualRelationToMany {
  hasMany: true;
  getRelatedIds: <TDelta>(delta: TDelta) => string[] | undefined;
  relatedIdsFragment: DocumentNode;
  updateRelatedFilters?: <TDelta>(
    client: ApolloClient<NormalizedCacheObject>,
    delta: TDelta,
    relatedIds?: string[],
    previousRelatedIds?: string[],
  ) => () => void;
}

type RelationToMany = ImpliedRelationToMany | ActualRelationToMany;

interface RelationToSingle {
  hasMany: false;
  getRelatedId: <TDelta>(delta: TDelta) => string | null | undefined;
  relatedIdFragment: DocumentNode;
  updateRelatedFilters: <TDelta>(
    client: ApolloClient<NormalizedCacheObject>,
    delta: TDelta,
    relatedId: string | null,
    previousRelatedId: string | null | undefined,
  ) => () => void;
}

type SyncedRelation = RelationToMany | RelationToSingle;

export interface SyncedRelations {
  [modelName: string]: { [relatedModelName: string]: SyncedRelation };
}

const isImpliedRelationToMany = (
  relation: RelationToMany,
): relation is ImpliedRelationToMany => {
  return (relation as ImpliedRelationToMany).isImplied;
};

const ALLOWED_MODELS = [
  'Board',
  'Card',
  'Member',
  'Organization',
  'List',
  'Label',
  'Checklist',
];

const SYNCED_RELATIONS: SyncedRelations = {
  Card: {
    Board: {
      hasMany: false,
      getRelatedId: (card: Partial<Card>) => card.idBoard,
      relatedIdFragment: gql`
        fragment cardIdBoard on Card {
          idBoard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        card: Partial<Card>,
        boardId: string | null,
        previousBoardId: string | null | undefined,
      ) => {
        return () => {
          if (boardId && card.id) {
            if (previousBoardId && previousBoardId !== boardId) {
              // We are moving the card between boards
              assignCardToFilters({
                removeFrom: ['closed', 'open', 'visible'],
                cache: client.cache,
                parentType: 'board',
                parentIds: [previousBoardId],
                cardId: card.id,
              });
            }
            const assignOptions = {
              cache: client.cache,
              parentIds: [boardId],
              cardId: card.id,
            };
            if (card.closed) {
              // We are closing a card, so we need to remove it from the "open" and "visible" lists, and add it to the
              // "closed" list
              assignCardToFilters({
                ...assignOptions,
                parentType: 'board',
                removeFrom: ['open', 'visible'],
                addTo: ['closed'],
              });
            } else if (card.closed === false) {
              // We are reopening a card (or it is new), so need to add it to the "open" and "visible" lists, and
              // remove it from the "closed" list
              assignCardToFilters({
                ...assignOptions,
                parentType: 'board',
                removeFrom: ['closed'],
                addTo: ['open', 'visible'],
              });
            }
          }
        };
      },
    },
    List: {
      hasMany: false,
      getRelatedId: (card: Partial<Card>) => card.idList,
      relatedIdFragment: gql`
        fragment cardIdList on Card {
          idList
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        card: Partial<Card>,
      ) => {
        return () => {
          if (card.id && card.idList && card.closed !== undefined) {
            const listInCache = client.readFragment<ClosedListFragment>({
              id: `List:${card.idList}`,
              fragment: ClosedListFragmentDoc,
            });
            if (listInCache) {
              if (card.idBoard) {
                updateCardsInVisibleList(
                  client.cache,
                  'board',
                  [card.idBoard],
                  [{ id: card.id, closed: card.closed, __typename: 'Card' }],
                  listInCache.closed,
                );
              }
              updateCardsInVisibleList(
                client.cache,
                'member',
                card.idMembers ?? [],
                [{ id: card.id, closed: card.closed, __typename: 'Card' }],
                listInCache.closed,
              );
            }
          }
        };
      },
    },
    Member: {
      hasMany: true,
      getRelatedIds: (card: Partial<Card>) => card.idMembers,
      relatedIdsFragment: gql`
        fragment cardIdMembers on Card {
          idMembers
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        card: Partial<Card>,
        memberIds: string[] = [],
        previousMemberIds: string[] = [],
      ) => {
        return () => {
          if (card.id) {
            if (previousMemberIds.length > 0) {
              const removedMembers = previousMemberIds.filter(
                (id) => !memberIds.includes(id),
              );
              assignCardToFilters({
                removeFrom: ['closed', 'open', 'visible'],
                cache: client.cache,
                parentType: 'member',
                parentIds: removedMembers,
                cardId: card.id,
              });
            }
            const assignOptions = {
              cache: client.cache,
              parentIds: memberIds,
              cardId: card.id,
            };
            if (card.closed) {
              // We are closing a card, so we need to remove it from the "open" and "visible" lists, and add it to the
              // "closed" list
              assignCardToFilters<Member>({
                ...assignOptions,
                parentType: 'member',
                removeFrom: ['open', 'visible'],
                addTo: ['closed'],
              });
            } else if (card.closed === false) {
              // We are reopening a card (or it is new), so need to add it to the "open" and "visible" lists, and
              // remove it from the "closed" list
              assignCardToFilters({
                ...assignOptions,
                parentType: 'member',
                removeFrom: ['closed'],
                addTo: ['open', 'visible'],
              });
            }
          }
        };
      },
    },
    Label: {
      hasMany: true,
      getRelatedIds: (card: Partial<Card>) => card.idLabels,
      relatedIdsFragment: gql`
        fragment cardIdLabels on Card {
          idLabels
        }
      `,
    },
    Checklist: {
      hasMany: true,
      getRelatedIds: (card: Partial<Card>) => card.idChecklists,
      relatedIdsFragment: gql`
        fragment cardIdChecklists on Card {
          idChecklists
        }
      `,
    },
  },

  Label: {
    Board: {
      hasMany: false,
      getRelatedId: (label: Partial<Label>) => label.idBoard,
      relatedIdFragment: gql`
        fragment labelIdBoard on Label {
          idBoard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        label: Partial<Label>,
      ) => {
        return () => {};
      },
    },
  },

  Checklist: {
    Card: {
      hasMany: false,
      getRelatedId: (checklist: Partial<Checklist>) => checklist.idCard,
      relatedIdFragment: gql`
        fragment checklistIdCard on Card {
          idCard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        checklist: Partial<Checklist>,
      ) => {
        return () => {};
      },
    },
  },

  Member: {
    Board: {
      hasMany: true,
      isImplied: true,
    },
    Organization: {
      hasMany: true,
      getRelatedIds: (member: Partial<Member>) => member.idOrganizations,
      relatedIdsFragment: gql`
        fragment memberIdOrganizations on Organization {
          idOrganizations
        }
      `,
    },
    Card: {
      hasMany: true,
      isImplied: true,
    },
  },

  Board: {
    Card: {
      hasMany: true,
      isImplied: true,
    },
    List: {
      hasMany: true,
      isImplied: true,
    },
    Label: {
      hasMany: true,
      isImplied: true,
    },
    Member: {
      hasMany: true,
      getRelatedIds: (board: Partial<Board>) =>
        board.memberships &&
        board.memberships.map((membership) => membership.idMember),
      relatedIdsFragment: gql`
        fragment boardIdMembers on Board {
          memberships {
            idMember
          }
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        board: Partial<Board>,
        memberIds: string[] = [],
      ) => {
        return () => {
          const requiredBoardProperties = [board.closed].some(
            (property) => typeof property !== 'undefined',
          );

          if (!board.id || !memberIds.length || !requiredBoardProperties) {
            return;
          }

          const filters = board.closed
            ? {
                removeFrom: ['open' as BoardFilter],
                addTo: ['closed' as BoardFilter],
              }
            : {
                removeFrom: ['closed' as BoardFilter],
                addTo: ['open' as BoardFilter],
              };

          assignBoardToFilters({
            ...filters,
            cache: client.cache,
            parentType: 'member',
            parentIds: memberIds,
            boardId: board.id,
          });
        };
      },
    },
    Organization: {
      hasMany: false,
      getRelatedId: (board: Partial<Board>) => board.idOrganization,
      relatedIdFragment: gql`
        fragment boardIdOrganization on Board {
          idBoard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        board: Partial<Board>,
        organizationId: string | null,
      ) => {
        return () => {
          const requiredBoardProperties = [
            board.closed,
            board.prefs?.isTemplate,
            board.prefs?.permissionLevel,
          ].some((property) => typeof property !== 'undefined');

          if (!board.id || !organizationId || !requiredBoardProperties) {
            return;
          }

          const filters = board.closed
            ? {
                removeFrom: ['open' as BoardFilter],
                addTo: ['closed' as BoardFilter],
              }
            : {
                removeFrom: ['closed' as BoardFilter],
                addTo: ['open' as BoardFilter],
              };

          assignBoardToFilters({
            ...filters,
            cache: client.cache,
            parentType: 'organization',
            parentIds: [organizationId],
            boardId: board.id,
          });
        };
      },
    },
  },

  Organization: {
    Board: {
      hasMany: true,
      getRelatedIds: (organization: Partial<Organization>) =>
        organization.idBoards,
      relatedIdsFragment: gql`
        fragment organizationIdBoards on Organization {
          idBoards
        }
      `,
    },
    Member: {
      hasMany: true,
      getRelatedIds: (organization: Partial<Organization>) =>
        organization.memberships &&
        organization.memberships.map((membership) => membership.idMember),
      relatedIdsFragment: gql`
        fragment organizationIdMembers on Organization {
          memberships {
            idMember
          }
        }
      `,
    },
  },

  List: {
    Board: {
      hasMany: false,
      getRelatedId: (list: Partial<List>) => list.idBoard,
      relatedIdFragment: gql`
        fragment listIdBoard on List {
          idBoard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        list: Partial<List>,
        boardId: string | null | undefined,
        previousBoardId: string | null | undefined,
      ) => {
        return () => {
          if (boardId && list.id) {
            if (previousBoardId && previousBoardId !== boardId) {
              // We are moving the list between boards
              assignListToFilters({
                removeFrom: ['closed', 'open'],
                cache: client.cache,
                boardId: previousBoardId,
                listId: list.id,
              });
            }
            if (list.closed) {
              // We are closing a list, so we need to remove it from the "open" list, and add it to the "closed" list
              assignListToFilters({
                removeFrom: ['open'],
                addTo: ['closed'],
                cache: client.cache,
                boardId,
                listId: list.id,
              });
              // We need to remove all the cards in this list from the "visible" list.
              const getCardsByFragment = <
                T extends
                  | CardsOnListFragment
                  | OpenCardsOnListFragment
                  | ClosedCardsOnListFragment
                  | VisibleCardsOnListFragment
                  | TemplateCardsOnListFragment
                  | CheckItemsAssignedCardsOnListFragment
              >(
                fragment: DocumentNode,
              ) =>
                client.readFragment<T>({
                  id: client.cache.identify({ ...list, __typename: 'List' }),
                  fragment,
                })?.cards ?? [];

              const cards = getCardsByFragment<CardsOnListFragment>(
                CardsOnListFragmentDoc,
              );
              const openCards = getCardsByFragment<OpenCardsOnListFragment>(
                OpenCardsOnListFragmentDoc,
              );
              const closedCards = getCardsByFragment<ClosedCardsOnListFragment>(
                ClosedCardsOnListFragmentDoc,
              );
              const visibleCards = getCardsByFragment<VisibleCardsOnListFragment>(
                VisibleCardsOnListFragmentDoc,
              );
              const templateCards = getCardsByFragment<TemplateCardsOnListFragment>(
                TemplateCardsOnListFragmentDoc,
              );
              const checkItemsAssignedCards = getCardsByFragment<CheckItemsAssignedCardsOnListFragment>(
                CheckItemsAssignedCardsOnListFragmentDoc,
              );

              // Merge and deduplicate cards associated with the list
              // using all possible filter shapes
              const listCards = [
                ...new Set([
                  ...cards,
                  ...openCards,
                  ...closedCards,
                  ...visibleCards,
                  ...templateCards,
                  ...checkItemsAssignedCards,
                ]),
              ];
              updateCardsInVisibleList(
                client.cache,
                'board',
                [boardId],
                listCards,
                list.closed,
              );

              const memberCardMap: Record<
                string,
                Pick<Card, '__typename' | 'id' | 'closed'>[]
              > = {};
              listCards.forEach((card) => {
                if (card.idMembers) {
                  card.idMembers.forEach((memberId) => {
                    memberCardMap[memberId] = [
                      ...(memberCardMap[memberId] ?? []),
                      card,
                    ];
                  });
                }
              });

              for (const memberId in memberCardMap) {
                updateCardsInVisibleList(
                  client.cache,
                  'member',
                  [memberId],
                  memberCardMap[memberId],
                  list.closed,
                );
              }
            } else {
              // We are reopening a list (or it is new), so need to add it to the "open" list, and remove it from the
              // "closed" list
              assignListToFilters({
                removeFrom: ['closed'],
                addTo: ['open'],
                cache: client.cache,
                boardId,
                listId: list.id,
              });
            }
          }
        };
      },
    },
    Card: {
      hasMany: true,
      isImplied: true,
    },
  },
};

const segmentRelationsByType = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  modelName: string,
  id: string,
  delta: DataWithId,
  syncedRelations: SyncedRelations,
) => {
  const simpleSingleRelations: RelationToSingleData[] = [];
  const simpleMultipleRelations: RelationToMultipleData[] = [];
  const oneToOneRelations: RelationToSingleData[] = [];
  const oneToManyRelations: RelationToSingleData[] = [];
  const manyToOneRelations: RelationToMultipleData[] = [];
  const manyToManyRelations: RelationToMultipleData[] = [];

  // Get the relations defined for this model
  const relationsToModel = syncedRelations[modelName];
  if (!relationsToModel) {
    return {
      simpleSingleRelations,
      simpleMultipleRelations,
      oneToOneRelations,
      oneToManyRelations,
      manyToOneRelations,
      manyToManyRelations,
    };
  }

  Object.entries(relationsToModel).forEach(([relatedModelName, relationTo]) => {
    // Get the relation that goes back the other way (if it exists)
    const relationFrom =
      syncedRelations[relatedModelName] &&
      syncedRelations[relatedModelName][modelName];

    if (!relationTo.hasMany) {
      const relatedId = relationTo.getRelatedId(delta);

      if (relatedId === undefined) {
        return;
      }

      // Read the previous related id from the Apollo Cache, using either the
      // fragment combined with the getRelatedId function (eg. board.idOrganization),
      // or failing that, reading from the relation itself (eg. board -> organization)
      const previousRelatedId = readSingleRelation(apolloClient, {
        id,
        modelName,
        relatedModelName,
        relatedIdFragment: relationTo.relatedIdFragment,
        getRelatedId: relationTo.getRelatedId,
      });

      const relation = {
        modelName,
        id,
        relatedModelName,
        relatedId,
        previousRelatedId,
        updateRelatedFilters: relationTo.updateRelatedFilters(
          apolloClient,
          delta,
          relatedId,
          previousRelatedId,
        ),
      };

      if (!relationFrom) {
        simpleSingleRelations.push(relation);
      } else if (!relationFrom.hasMany) {
        oneToOneRelations.push(relation);
      } else if (relationFrom.hasMany) {
        oneToManyRelations.push(relation);
      }
    } else if (relationTo.hasMany && !isImpliedRelationToMany(relationTo)) {
      const relatedIds = relationTo.getRelatedIds(delta);

      if (!relatedIds) {
        return;
      }

      // Read the previous related ids from the Apollo Cache, using either the
      // fragment combined with the getRelatedIds function (eg. card.idMembers),
      // or failing that, reading from the relation itself (eg. card -> members)
      const previousRelatedIds = readMultipleRelation(apolloClient, {
        id,
        modelName,
        relatedModelName,
        relatedIdsFragment: relationTo.relatedIdsFragment,
        getRelatedIds: relationTo.getRelatedIds,
      });

      const relation = {
        modelName,
        id,
        relatedModelName,
        relatedIds,
        previousRelatedIds,
        updateRelatedFilters:
          relationTo.updateRelatedFilters &&
          relationTo.updateRelatedFilters(
            apolloClient,
            delta,
            relatedIds,
            previousRelatedIds,
          ),
      };

      if (!relationFrom) {
        simpleMultipleRelations.push(relation);
      } else if (!relationFrom.hasMany) {
        manyToOneRelations.push(relation);
      } else if (relationFrom.hasMany) {
        manyToManyRelations.push(relation);
      }
    }
  });

  return {
    simpleSingleRelations,
    simpleMultipleRelations,
    oneToOneRelations,
    oneToManyRelations,
    manyToOneRelations,
    manyToManyRelations,
  };
};

interface PerformanceMetrics {
  model: string;
  totalMs: number;
  directMs: number;
  typesMs: number;
  segmentMs: number;
  simple1: number;
  simple1Ms: number;
  simpleN: number;
  simpleNMs: number;
  broadcastMs: number;
  '1->1': number;
  '1->1Ms': number;
  '1->n': number;
  '1->nMs': number;
  'n->1': number;
  'n->1Ms': number;
  'n->n': number;
  'n->nMs': number;
}

const truncateMetrics = (perfMetrics: PerformanceMetrics): EventContext => {
  const truncatedMetrics: EventContext = {};
  Object.entries(perfMetrics).forEach(([key, value]) => {
    // Pass any non-numbers straight through
    if (typeof value !== 'number') {
      truncatedMetrics[key] = value;
      return;
    }

    // Round the value to the nearest integer
    const roundedValue = Math.round(value);

    // Only log non 0 rounded values
    if (roundedValue !== 0) {
      truncatedMetrics[key] = roundedValue;
    }
  });

  return truncatedMetrics;
};

const shouldLogMetrics = (perfMetrics: PerformanceMetrics) => {
  if (!featureFlagClient.get('fep.apollo_cache_hydrator.metrics', false)) {
    return false;
  }

  return (
    perfMetrics.simple1 > 0 ||
    perfMetrics.simpleN > 0 ||
    perfMetrics['1->1'] > 0 ||
    perfMetrics['1->n'] > 0 ||
    perfMetrics['n->1'] > 0 ||
    perfMetrics['n->n'] > 0 ||
    perfMetrics['segmentMs'] > 5 ||
    perfMetrics['directMs'] > 5
  );
};

/**
 * There is a known issue with the Apollo 2 `writeData` method, where
 * Apollo is unable to determine the selectionSet of a field due to it being
 * null. When this happens, the non-null instances of that field in the cache
 * can get corrupted, essentially breaking any queries or mutation that use
 * that data.
 *
 * This will be fixed when we switch to Apollo 3 and remove our usages of `writeData`,
 * but for now, this function will apply necessary data patching to appease the cache.
 *
 * See:
 * https://github.com/apollographql/apollo-client/issues/4785
 * https://github.com/apollographql/apollo-client/issues/4498
 */
const __patchDelta__ = (modelName: string, delta: DataWithId) => {
  if (modelName === 'Board') {
    if (delta.dashboardViewTiles && Array.isArray(delta.dashboardViewTiles)) {
      // This patches the issue when the first tile on a dashboard is a non-history
      // tile, meaning it will have a `null` `from` field, and hit the Apollo writeData
      // issue. If the first tile has a null `from`, we patch it to have a default value
      const firstTile = delta.dashboardViewTiles[0] as JSONObject | undefined;
      if (firstTile) {
        firstTile.from = firstTile.from ?? {
          dateType: 'relative',
          value: -604800000,
        };
      }
    }
  }

  return delta;
};

export const syncDeltaToCache = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  modelName: string,
  _delta: DataWithId,
  fromQuery?: QueryParams,
  syncedRelations: SyncedRelations = SYNCED_RELATIONS,
  allowedModels: string[] = ALLOWED_MODELS,
) => {
  // Paranoid check for an id on our delta
  if (!_delta.id) {
    return;
  }

  if (featureFlagClient.get('fep.apollo_cache_realtime_filters', false)) {
    if (_delta.deleted) {
      removeDeleted(apolloClient, modelName, _delta.id);
      return;
    }
  }

  // Only allow certain models to be synced
  if (!allowedModels.includes(modelName)) {
    return;
  }
  const delta = { ..._delta };
  __patchDelta__(modelName, delta);

  if (fromQuery) {
    for (const unsafeField of getUnsafeFields(fromQuery)) {
      delete delta[unsafeField];
    }
  }

  const perfMetrics: PerformanceMetrics = {
    model: modelName,
    totalMs: 0,
    directMs: 0,
    typesMs: 0,
    segmentMs: 0,
    simple1: 0,
    simple1Ms: 0,
    simpleN: 0,
    simpleNMs: 0,
    broadcastMs: 0,
    '1->1': 0,
    '1->1Ms': 0,
    '1->n': 0,
    '1->nMs': 0,
    'n->1': 0,
    'n->1Ms': 0,
    'n->n': 0,
    'n->nMs': 0,
  };

  const startTime = performance.now();
  let cursorTime = performance.now();
  const id = delta.id;

  const deltaWithTypenames = addTypenames(
    'Query',
    firstLetterToLower(modelName),
    delta,
  );

  // This should never actually happen, but addTypenames is designed to be recursive
  // so could return undefined for a primitive value that is not in the schema. Given
  // our delta is always an object, this will never be the case
  if (!deltaWithTypenames) {
    return;
  }

  perfMetrics.typesMs += performance.now() - cursorTime;
  cursorTime = performance.now();

  // Segment the relationships by their type. During segmenting, we also read the _current_ values
  // for all the relevant relationships if they exist in the cache (either via a relationship in Apollo,
  // or by some 'idSomething' field on the item)
  const {
    simpleSingleRelations,
    simpleMultipleRelations,
    oneToOneRelations,
    oneToManyRelations,
    manyToOneRelations,
    manyToManyRelations,
  } = segmentRelationsByType(
    apolloClient,
    modelName,
    id,
    delta,
    syncedRelations,
  );
  perfMetrics.segmentMs += performance.now() - cursorTime;
  cursorTime = performance.now();

  // Sync the flat delta, ensuring we do this _after_ all the existing relationships have been read as
  // part of the segmentation
  writeDirect(apolloClient, { modelName, data: deltaWithTypenames });
  perfMetrics.directMs += performance.now() - cursorTime;
  cursorTime = performance.now();

  simpleSingleRelations.forEach((relation) => {
    perfMetrics.simple1 += patchSimpleSingleRelation(apolloClient, relation);
  });
  perfMetrics.simple1Ms += performance.now() - cursorTime;
  cursorTime = performance.now();

  simpleMultipleRelations.forEach((relation) => {
    perfMetrics.simpleN += patchSimpleMultipleRelation(apolloClient, relation);
  });
  perfMetrics.simpleNMs += performance.now() - cursorTime;
  cursorTime = performance.now();

  oneToOneRelations.forEach((relation) => {
    perfMetrics['1->1'] += patchOneToOneRelation(apolloClient, relation);
  });
  perfMetrics['1->1Ms'] += performance.now() - cursorTime;
  cursorTime = performance.now();

  oneToManyRelations.forEach((relation) => {
    perfMetrics['1->n'] += patchOneToManyRelation(apolloClient, relation);
  });
  perfMetrics['1->nMs'] += performance.now() - cursorTime;
  cursorTime = performance.now();

  manyToOneRelations.forEach((relation) => {
    perfMetrics['n->1'] += patchManyToOneRelation(apolloClient, relation);
  });
  perfMetrics['n->1Ms'] += performance.now() - cursorTime;
  cursorTime = performance.now();

  manyToManyRelations.forEach((relation) => {
    perfMetrics['n->n'] += patchManyToManyRelation(apolloClient, relation);
  });
  perfMetrics['n->nMs'] += performance.now() - cursorTime;
  cursorTime = performance.now();

  perfMetrics.broadcastMs += performance.now() - cursorTime;

  perfMetrics.totalMs += performance.now() - startTime;

  // Only log the performance metrics if expensive writes or relation patching occured
  if (shouldLogMetrics(perfMetrics)) {
    const truncatedMetrics = truncateMetrics(perfMetrics);
    Analytics.sendOperationalEvent({
      source: '@trello/graphql',
      action: 'synced',
      actionSubject: 'cacheSyncing',
      attributes: {
        truncatedMetrics,
      },
    });
  }
};

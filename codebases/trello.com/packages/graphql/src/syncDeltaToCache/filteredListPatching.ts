/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ApolloCache,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client';
import { OpenListsDocument } from './OpenListsQuery.generated';
import { ClosedListsDocument } from './ClosedListsQuery.generated';
import { Maybe, Board, Card } from '../../generated';

export type GeneralizedCardsQuery = { __typename: 'Query' } & {
  board?: Maybe<
    { __typename: 'Board' } & Pick<Board, 'id'> & {
        cards: Array<{ __typename: 'Card' } & Pick<Card, 'id' | 'closed'>>;
      }
  >;
};

export type GeneralizedListsQuery = { __typename: 'Query' } & {
  board?: Maybe<
    { __typename: 'Board' } & Pick<Board, 'id'> & {
        lists: Array<{ __typename: 'List' } & Pick<Card, 'id' | 'closed'>>;
      }
  >;
};

export function removeDeleted(
  client: ApolloClient<unknown>,
  type: string,
  id: string,
) {
  client.cache.evict({ id: `${type}:${id}` });
  client.cache.gc();
}

type ListFilter = 'open' | 'closed';

export function assignListToFilters({
  addTo,
  removeFrom,
  cache,
  boardId,
  listId,
}: {
  addTo?: ListFilter[];
  removeFrom?: ListFilter[];
  cache: ApolloCache<NormalizedCacheObject>;
  boardId: string;
  listId: string;
}) {
  if (addTo && addTo.length > 0) {
    addTo.forEach((filter) => {
      addListToFilteredListOnBoard({
        filter,
        cache,
        boardId,
        listId,
        closed: filter === 'closed',
      });
    });
  }
  if (removeFrom && removeFrom.length > 0) {
    removeFrom.forEach((filter) => {
      removeListFromFilteredListOnBoard({
        filter,
        cache,
        boardId,
        listId,
      });
    });
  }
}

function getListQueryForFilter(filter: ListFilter) {
  switch (filter) {
    case 'open':
      return OpenListsDocument;
    case 'closed':
      return ClosedListsDocument;
    default:
      throw new Error('Unsupported filter');
  }
}

function removeListFromFilteredListOnBoard({
  filter,
  cache,
  boardId,
  listId,
}: {
  filter: ListFilter;
  cache: ApolloCache<NormalizedCacheObject>;
  boardId: string;
  listId: string;
}) {
  const query = getListQueryForFilter(filter);
  const existingListsMatchingFilter = cache.readQuery<GeneralizedListsQuery>({
    query,
    variables: {
      boardId,
    },
  });

  const newListsMatchingFilter = existingListsMatchingFilter?.board?.lists.filter(
    (list) => list.id !== listId,
  );

  cache.writeQuery({
    query,
    data: {
      __typename: 'Query',
      board: {
        id: boardId,
        lists: [...(newListsMatchingFilter ?? [])],
        __typename: 'Board',
      },
    },
    variables: {
      boardId,
    },
  });
}

function addListToFilteredListOnBoard({
  filter,
  cache,
  boardId,
  listId,
  closed,
}: {
  filter: ListFilter;
  cache: ApolloCache<NormalizedCacheObject>;
  boardId: string;
  listId: string;
  closed: boolean;
}) {
  const query = getListQueryForFilter(filter);

  const existingListsMatchingFilter = cache.readQuery<GeneralizedListsQuery>({
    query,
    variables: {
      boardId,
    },
  });

  const newListsMatchingFilter = existingListsMatchingFilter?.board?.lists.filter(
    (list) => list.id !== listId,
  );

  cache.writeQuery({
    query,
    data: {
      __typename: 'Query',
      board: {
        id: boardId,
        lists: [
          ...(newListsMatchingFilter ?? []),
          {
            id: listId,
            closed,
            __typename: 'List',
          },
        ],
        __typename: 'Board',
      },
    },
    variables: {
      boardId,
    },
  });
}

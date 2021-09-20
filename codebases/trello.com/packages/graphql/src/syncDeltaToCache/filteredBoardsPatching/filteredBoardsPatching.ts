/* eslint-disable @typescript-eslint/no-use-before-define */
import { Board, Maybe, Member, Organization } from '../../generated';
import { DocumentNode } from 'graphql';
import { MemberOpenBoardsDocument } from './MemberOpenBoardsQuery.generated';
import { MemberClosedBoardsDocument } from './MemberClosedBoardsQuery.generated';
import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { firstLetterToUpper } from '../../stringOperations';
import { OrganizationClosedBoardsDocument } from './OrganizationClosedBoardsQuery.generated';
import { OrganizationOpenBoardsDocument } from './OrganizationOpenBoardsQuery.generated';

export type BoardFilter =
  | 'open'
  | 'closed'
  | 'private'
  | 'organization'
  | 'public'
  | 'template';

type SupportedParent = Member | Organization;

export type GeneralizedBoardsQuery<T extends SupportedParent> = {
  __typename: 'Query';
} & {
  [K in Lowercase<T['__typename']>]?: Maybe<
    Pick<T, 'id' | '__typename'> & {
      boards: Array<{ __typename: 'Board' } & Pick<Board, 'id' | 'closed'>>;
      idBoards: string[];
    }
  >;
};

const QUERY_MAP: Record<
  Lowercase<SupportedParent['__typename']>,
  Record<BoardFilter, DocumentNode | undefined>
> = {
  member: {
    open: MemberOpenBoardsDocument,
    closed: MemberClosedBoardsDocument,
    private: undefined, // Not supported
    organization: undefined, // Not supported
    public: undefined, // Not supported
    template: undefined, // Not supported
  },
  organization: {
    open: OrganizationOpenBoardsDocument,
    closed: OrganizationClosedBoardsDocument,
    private: undefined, // Not supported
    organization: undefined, // Not supported
    public: undefined, // Not supported
    template: undefined, // Not supported
  },
};

export function assignBoardToFilters<Parent extends SupportedParent>({
  addTo,
  removeFrom,
  cache,
  parentType,
  parentIds,
  boardId,
}: {
  addTo?: BoardFilter[];
  removeFrom?: BoardFilter[];
  cache: ApolloCache<NormalizedCacheObject>;
  parentType: Lowercase<Parent['__typename']>;
  parentIds: string[];
  boardId: string;
}) {
  parentIds.forEach((parentId) => {
    if (addTo && addTo.length > 0) {
      addTo.forEach((filter) => {
        addBoardToFilteredList({
          filter,
          cache,
          parentType,
          parentId,
          boardId,
          closed: filter === 'closed',
        });
      });
    }
    if (removeFrom && removeFrom.length > 0) {
      removeFrom.forEach((filter) => {
        removeBoardFromFilteredList({
          filter,
          cache,
          parentType,
          parentId,
          boardId,
        });
      });
    }
  });
}

function addBoardToFilteredList<Parent extends SupportedParent>({
  filter,
  cache,
  parentType,
  parentId,
  boardId,
  closed,
}: {
  filter: BoardFilter;
  cache: ApolloCache<NormalizedCacheObject>;
  parentType: Lowercase<Parent['__typename']>;
  parentId: string;
  boardId: string;
  closed: boolean;
}) {
  const query = QUERY_MAP[parentType][filter];
  if (!query) {
    return;
  }
  const params = { cache, query, parentType, parentId };
  const existingBoardsMatchingFilter = readBoardsFromCache(params);

  if (typeof existingBoardsMatchingFilter === 'undefined') {
    return;
  }

  const newBoardsMatchingFilter = existingBoardsMatchingFilter?.filter(
    (board) => board.id !== boardId,
  );
  writeBoardsToCache({
    ...params,
    boards: [
      ...(newBoardsMatchingFilter ?? []),
      {
        id: boardId,
        closed,
        __typename: 'Board',
      },
    ],
  });
}

function removeBoardFromFilteredList<Parent extends SupportedParent>({
  filter,
  cache,
  parentType,
  parentId,
  boardId,
}: {
  filter: BoardFilter;
  cache: ApolloCache<NormalizedCacheObject>;
  parentType: Lowercase<Parent['__typename']>;
  parentId: string;
  boardId: string;
}) {
  const query = QUERY_MAP[parentType][filter];
  if (!query) {
    return;
  }
  const params = { cache, query, parentType, parentId };
  const existingBoardsMatchingFilter = readBoardsFromCache(params);

  if (typeof existingBoardsMatchingFilter === 'undefined') {
    return;
  }

  const newBoardsMatchingFilter = existingBoardsMatchingFilter?.filter(
    (board) => board.id !== boardId,
  );

  writeBoardsToCache({
    ...params,
    boards: [...(newBoardsMatchingFilter ?? [])],
  });
}

function readBoardsFromCache<Parent extends SupportedParent>({
  cache,
  query,
  parentType,
  parentId,
}: {
  cache: ApolloCache<NormalizedCacheObject>;
  query: DocumentNode;
  parentType: Lowercase<Parent['__typename']>;
  parentId: string;
}) {
  const data = cache.readQuery<GeneralizedBoardsQuery<Parent>>({
    query,
    variables: {
      parentId,
    },
  });

  return data?.[parentType]?.boards;
}

function writeBoardsToCache<Parent extends SupportedParent>({
  cache,
  query,
  parentType,
  parentId,
  boards,
}: {
  cache: ApolloCache<NormalizedCacheObject>;
  query: DocumentNode;
  parentType: Lowercase<Parent['__typename']>;
  parentId: string;
  boards: Partial<Board>[];
}) {
  return cache.writeQuery({
    query,
    data: {
      __typename: 'Query',
      [`${parentType}`]: {
        id: parentId,
        boards,
        __typename: firstLetterToUpper(parentType),
      },
    },
    variables: {
      parentId,
    },
  });
}

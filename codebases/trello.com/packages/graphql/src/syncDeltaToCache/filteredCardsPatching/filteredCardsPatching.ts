/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ApolloCache,
  DocumentNode,
  NormalizedCacheObject,
} from '@apollo/client';
import { BoardOpenCardsDocument } from './BoardOpenCardsQuery.generated';
import { BoardClosedCardsDocument } from './BoardClosedCardsQuery.generated';
import { BoardVisibleCardsDocument } from './BoardVisibleCardsQuery.generated';
import { MemberOpenCardsDocument } from './MemberOpenCardsQuery.generated';
import { MemberClosedCardsDocument } from './MemberClosedCardsQuery.generated';
import { MemberVisibleCardsDocument } from './MemberVisibleCardsQuery.generated';
import { Maybe, Board, Card, Member } from '../../../generated';
import { firstLetterToUpper } from '../../stringOperations';

type CardFilter = 'open' | 'closed' | 'visible';

type SupportedParent = Board | Member;

export type GeneralizedCardsQuery<T extends SupportedParent> = {
  __typename: 'Query';
} & {
  [K in Lowercase<T['__typename']>]?: Maybe<
    Pick<T, 'id' | '__typename'> & {
      cards: Array<{ __typename: 'Card' } & Pick<Card, 'id' | 'closed'>>;
    }
  >;
};

const QUERY_MAP: Record<
  Lowercase<SupportedParent['__typename']>,
  Record<CardFilter, DocumentNode>
> = {
  board: {
    open: BoardOpenCardsDocument,
    closed: BoardClosedCardsDocument,
    visible: BoardVisibleCardsDocument,
  },
  member: {
    open: MemberOpenCardsDocument,
    closed: MemberClosedCardsDocument,
    visible: MemberVisibleCardsDocument,
  },
};

export function removeDeleted(
  cache: ApolloCache<NormalizedCacheObject>,
  type: string,
  id: string,
) {
  cache.evict({ id: `${type}:${id}` });
  cache.gc();
}

function readCardsFromCache<Parent extends SupportedParent>({
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
  return cache.readQuery<GeneralizedCardsQuery<Parent>>({
    query,
    variables: {
      parentId,
    },
  })?.[parentType]?.cards;
}

function writeCardsToCache<Parent extends SupportedParent>({
  cache,
  query,
  parentType,
  parentId,
  cards,
}: {
  cache: ApolloCache<NormalizedCacheObject>;
  query: DocumentNode;
  parentType: Lowercase<Parent['__typename']>;
  parentId: string;
  cards: Partial<Card>[];
}) {
  return cache.writeQuery({
    query,
    data: {
      __typename: 'Query',
      [`${parentType}`]: {
        id: parentId,
        cards,
        __typename: firstLetterToUpper(parentType),
      },
    },
    variables: {
      parentId,
    },
  });
}

export function assignCardToFilters<Parent extends SupportedParent>({
  addTo,
  removeFrom,
  cache,
  parentType,
  parentIds,
  cardId,
}: {
  addTo?: CardFilter[];
  removeFrom?: CardFilter[];
  cache: ApolloCache<NormalizedCacheObject>;
  parentType: Lowercase<Parent['__typename']>;
  parentIds: string[];
  cardId: string;
}) {
  parentIds.forEach((parentId) => {
    if (addTo && addTo.length > 0) {
      addTo.forEach((filter) => {
        addCardToFilteredList({
          filter,
          cache,
          parentType,
          parentId,
          cardId,
          closed: filter === 'closed',
        });
      });
    }
    if (removeFrom && removeFrom.length > 0) {
      removeFrom.forEach((filter) => {
        removeCardFromFilteredList({
          filter,
          cache,
          parentType,
          parentId,
          cardId,
        });
      });
    }
  });
}

function removeCardFromFilteredList<Parent extends SupportedParent>({
  filter,
  cache,
  parentType,
  parentId,
  cardId,
}: {
  filter: CardFilter;
  cache: ApolloCache<NormalizedCacheObject>;
  parentType: Lowercase<Parent['__typename']>;
  parentId: string;
  cardId: string;
}) {
  const query = QUERY_MAP[parentType][filter];
  const params = { cache, query, parentType, parentId };
  const existingCardsMatchingFilter = readCardsFromCache(params);

  const newCardsMatchingFilter = existingCardsMatchingFilter?.filter(
    (card) => card.id !== cardId,
  );

  writeCardsToCache({
    ...params,
    cards: [...(newCardsMatchingFilter ?? [])],
  });
}

function addCardToFilteredList<Parent extends SupportedParent>({
  filter,
  cache,
  parentType,
  parentId,
  cardId,
  closed,
}: {
  filter: CardFilter;
  cache: ApolloCache<NormalizedCacheObject>;
  parentType: Lowercase<Parent['__typename']>;
  parentId: string;
  cardId: string;
  closed: boolean;
}) {
  const query = QUERY_MAP[parentType][filter];
  const params = { cache, query, parentType, parentId };
  const existingCardsMatchingFilter = readCardsFromCache(params);

  const newCardsMatchingFilter = existingCardsMatchingFilter?.filter(
    (card) => card.id !== cardId,
  );
  writeCardsToCache({
    ...params,
    cards: [
      ...(newCardsMatchingFilter ?? []),
      {
        id: cardId,
        closed,
        __typename: 'Card',
      },
    ],
  });
}

export function updateCardsInVisibleList<Parent extends SupportedParent>(
  cache: ApolloCache<NormalizedCacheObject>,
  parentType: Lowercase<Parent['__typename']>,
  parentIds: string[],
  cards: Pick<Card, 'id' | 'closed' | '__typename'>[],
  listClosed: boolean,
) {
  if (cards.length === 0) {
    // No changes required
    return;
  }
  const query = QUERY_MAP[parentType]['visible'];
  const cardIds = cards.map((card) => card.id);
  const openCards = cards.filter((card) => !card.closed);
  parentIds.forEach((parentId) => {
    const existingVisibleCards =
      readCardsFromCache({
        cache,
        query,
        parentType,
        parentId,
      }) || [];
    const otherVisibleCards = existingVisibleCards.filter(
      (card) => !cardIds.includes(card.id),
    );
    const newVisibleCards = listClosed
      ? otherVisibleCards
      : [...otherVisibleCards, ...openCards];

    // It's possible we could incorrectly hit this scenario. For example, if we
    // miss an "add" delta, but receive a "delete" delta, the lengths will be the
    // same, but the cache will not be updated correctly. This is self healing as
    // more deltas come in, and we believe it is a slim enough edge case that the
    // performance optimization is worthwhile.
    if (existingVisibleCards.length === newVisibleCards.length) {
      // we end up with the same list as already in cache
      // let's skip writing to cache
      return;
    }

    writeCardsToCache({
      cache,
      query,
      parentType,
      parentId,
      cards: newVisibleCards,
    });
  });
}

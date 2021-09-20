import React, { AnchorHTMLAttributes } from 'react';
import { ApolloError } from '@apollo/client';
import { MultiBoardViewProviderCardsQuery } from './MultiBoardViewProviderCardsQuery.generated';
import { SingleBoardDataQuery } from './SingleBoardDataQuery.generated';
import { MultiBoardViewProviderBoardsQuery } from './MultiBoardViewProviderBoardsQuery.generated';

/**
 * Represents the type of cards provided by a `BoardViewContext`.
 *
 * This is constructed as the union type of the cards query for single-board
 * views data and the cards query for multi-board views data.
 */
export type ViewCard =
  | NonNullable<
      MultiBoardViewProviderCardsQuery['organization']
    >['cards']['cards'][number]
  | NonNullable<SingleBoardDataQuery['board']>['cards'][number];

export type CardWithChecklistDefined = ViewCard & {
  checklists: NonNullable<
    SingleBoardDataQuery['board']
  >['cards'][number]['checklists'];
};

export type Checklist = CardWithChecklistDefined['checklists'][number];

export type ChecklistItem = Checklist['checkItems'][number];

/**
 * Represents the type of boards provided by a `BoardViewContext`.
 *
 * Like `ViewCard`, this is the union type of the single-board data query and
 * the multi-board data query.
 */
export type ViewBoard =
  | Omit<NonNullable<SingleBoardDataQuery['board']>, 'cards'>
  | NonNullable<
      MultiBoardViewProviderBoardsQuery['organization']
    >['boards'][number];

/**
 * Board and card data provided to "views" by the Trello Views Architecture.
 * This is the set of shared data that views (both single- and multi-board)
 * consume.
 */
export interface BoardViewContextValue {
  /**
   * Which kind of context this is, can be used to do things conditionally in a
   * consumer based on whether it is single- or multi-board.
   */
  contextType: 'workspace' | 'board';
  boardsData: {
    /**
     * Should be an singleton array for single-board views, or an array of all
     * boards for multi-board views.
     */
    boards?: ViewBoard[];
    isLoading: boolean;
    error?: ApolloError;
  };
  cardsData: {
    cards: ViewCard[];
    error?: ApolloError;

    /** Should reflect the Apollo loading state of the query for cards data. */
    isLoading: boolean;

    /**
     * Should be true if a query for cards is being run initial, but false if
     * the query is being re-run due to variables changes, such as filters
     * changing.
     */
    isLoadingInitial: boolean;
    loadMore: () => void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
  };
  checklistItemData?: {
    checklistItems: {
      item: ChecklistItem;
      checklist: Checklist;
      card: ViewCard;
    }[];
  };
  navigateToCard: (cardUrl: string) => void;

  /**
   * Returns props for an anchor tag which will either open the card link in a
   * new tab or open the card back, depending on which view provider the
   * function is called in.
   */
  getLinkToCardProps: ({
    idCard,
    cardUrl,
    onClick,
  }: {
    idCard?: string;
    cardUrl?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  }) => Partial<AnchorHTMLAttributes<HTMLAnchorElement>>;
  closeView?: () => void;
  idBoard?: string;
  idOrg?: string;
  canEditBoard: (idBoard: string) => boolean;
}

export function boardViewContextEmptyValue(): BoardViewContextValue {
  return {
    contextType: 'workspace',
    boardsData: {
      boards: undefined,
      isLoading: false,
      error: undefined,
    },
    cardsData: {
      cards: [],
      isLoading: false,
      isLoadingInitial: false,
      loadMore: () => {},
      canLoadMore: false,
      isLoadingMore: false,
    },
    navigateToCard: () => {},
    getLinkToCardProps: ({ idCard, cardUrl, onClick }) => {
      return {
        href: cardUrl,
        onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          onClick?.(e);
        },
      };
    },
    canEditBoard: (idBoard: string) => false,
  };
}

export const BoardViewContext = React.createContext<BoardViewContextValue>(
  // eslint-disable-next-line @trello/no-module-logic
  boardViewContextEmptyValue(),
);

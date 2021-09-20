import { BoardResponse, SearchResponse } from 'app/gamma/src/types/responses';

export interface SearchResultsPayload {
  query: string;
  limit: number;
  cardsPage: number;
  idBoards: string[];
  idCards: string[];
  idMembers: string[];
  idTeams: string[];
  noMatchesFound: boolean;
}

export interface BoardSearchResultsPayload {
  boards: BoardResponse[];
}

export const normalizeSearchResults = ({
  boards = [],
  cards = [],
  query,
  cardsPage = 0,
  limit = 8,
  members = [],
  organizations = [],
}: SearchResponse): SearchResultsPayload => {
  return {
    cardsPage,
    query,
    limit,
    idBoards: boards.map(({ id }) => id),
    idCards: cards.map(({ id }) => id),
    idMembers: members.map(({ id }) => id),
    idTeams: organizations.map(({ id }) => id),
    noMatchesFound:
      !boards.length &&
      !cards.length &&
      !members.length &&
      !organizations.length,
  };
};

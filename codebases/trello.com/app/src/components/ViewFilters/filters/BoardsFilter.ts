import {
  BoardTableViewFilter,
  UrlParams,
  CardFilterCriteria,
} from './BoardTableViewFilter';
import { isShortLink } from '@trello/shortlinks';

const shortLinksFromUrlParams = (idBoards?: string | null) => {
  return idBoards?.split(',').filter(isShortLink) ?? [];
};

type BoardIdOrShortLink = { id: string } | { shortLink: string };

export interface BoardIdAndShortLink {
  id: string;
  shortLink: string;
}

export class BoardsFilter implements BoardTableViewFilter {
  boards: BoardIdOrShortLink[] = [];

  filterLength(): number {
    return this.getBoardShortLinksOrIds().length;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  // Enforce that any UI calling setBoards includes both the id and
  // shortLink so that it can be serialized to either a View or UrlParams
  setBoards(boards: BoardIdAndShortLink[]) {
    this.boards = boards;
  }

  // Return either shortLinks or Ids, since we may have only one or the other
  // after deserializing from a View or UrlParams. (Most call sites will just
  // pass this result into a graphql query, which will accept shortLinks or ids)
  getBoardShortLinksOrIds(): string[] {
    return this.boards.map((board) => {
      if ('shortLink' in board) {
        return board.shortLink;
      } else {
        return board.id;
      }
    });
  }

  isEnabled({ id, shortLink }: Partial<BoardIdAndShortLink>): boolean {
    return !!this.getBoardShortLinksOrIds().find(
      (shortLinkOrId) => id === shortLinkOrId || shortLink === shortLinkOrId,
    );
  }

  toUrlParams() {
    return {
      // URL params incorrectly refer to shortLinks as ids
      idBoards:
        this.boards
          .filter(
            (board): board is { shortLink: string } => 'shortLink' in board,
          )
          .map((board) => board.shortLink)
          .join(',') || null,
    };
  }

  fromUrlParams(urlParams: UrlParams) {
    this.boards = shortLinksFromUrlParams(
      urlParams.idBoards,
    ).map((shortLink) => ({ shortLink }));
  }

  serializeToView() {
    return {
      idBoards: this.boards
        .filter((board): board is { id: string } => 'id' in board)
        .map((board) => board.id),
    };
  }

  deserializeFromView(cardFilterCriteria: CardFilterCriteria) {
    this.boards = (cardFilterCriteria.idBoards || []).map((id) => ({ id }));
  }
}

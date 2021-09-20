import { isShortLink } from './isShortLink';
import { checkId } from './checkId';

export class IdCache {
  _shortLinkToId: {
    Card: {
      [key: string]: string;
    };
    Board: {
      [key: string]: string;
    };
  };
  constructor() {
    this._shortLinkToId = {
      Card: {},
      Board: {},
    };
  }

  getId(typeName: 'Card' | 'Board', shortLink: string) {
    if (checkId(shortLink)) {
      return shortLink;
    } else if (isShortLink(shortLink)) {
      return this._shortLinkToId[typeName][shortLink];
    }
  }

  setId(typeName: 'Card' | 'Board', shortLink: string, id: string) {
    if (!checkId(id)) {
      throw new Error(`Not an id: ${id}`);
    }
    if (!isShortLink(shortLink)) {
      throw new Error(`Not a shortLink: ${shortLink}`);
    }
    return (this._shortLinkToId[typeName][shortLink] = id);
  }

  setCardId(shortLink: string, id: string) {
    return this.setId('Card', shortLink, id);
  }

  setBoardId(shortLink: string, id: string) {
    return this.setId('Board', shortLink, id);
  }

  getCardId(id: string) {
    return this.getId('Card', id);
  }

  getBoardId(id: string) {
    return this.getId('Board', id);
  }
}

import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface BoardStarAttributes extends TrelloModelAttributes {
  idBoard: string;
}

class BoardStar extends TrelloModel<BoardStarAttributes> {
  static initClass() {
    this.prototype.typeName = 'BoardStar';
  }
  getBoard() {
    return this.modelCache.get('Board', this.get('idBoard'));
  }
}
BoardStar.initClass();

export { BoardStar };

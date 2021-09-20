import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface BoardBackgroundAttributes extends TrelloModelAttributes {}

class BoardBackground extends TrelloModel<BoardBackgroundAttributes> {
  static initClass() {
    this.prototype.typeName = 'CustomBoardBackground';
  }
}
BoardBackground.initClass();

export { BoardBackground };

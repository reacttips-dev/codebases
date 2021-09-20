import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface StickerAttributes extends TrelloModelAttributes {}

class Sticker extends TrelloModel<StickerAttributes> {
  static initClass() {
    this.prototype.typeName = 'Sticker';
  }
}
Sticker.initClass();

export { Sticker };

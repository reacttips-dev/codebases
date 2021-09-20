import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface CustomerStickerAttributes extends TrelloModelAttributes {}

class CustomSticker extends TrelloModel<CustomerStickerAttributes> {
  static initClass() {
    this.prototype.typeName = 'CustomSticker';
  }
}
CustomSticker.initClass();

export { CustomSticker };

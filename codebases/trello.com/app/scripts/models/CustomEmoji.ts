import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface CustomEmojiAttributes extends TrelloModelAttributes {}

class CustomEmoji extends TrelloModel<CustomEmojiAttributes> {
  static initClass() {
    this.prototype.typeName = 'CustomEmoji';
  }
}
CustomEmoji.initClass();

export { CustomEmoji };

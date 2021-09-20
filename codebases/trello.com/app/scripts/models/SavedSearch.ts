import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface SavedSearchAttributes extends TrelloModelAttributes {}

class SavedSearch extends TrelloModel<SavedSearchAttributes> {
  static initClass() {
    this.prototype.typeName = 'SavedSearch';
  }
}
SavedSearch.initClass();

export { SavedSearch };

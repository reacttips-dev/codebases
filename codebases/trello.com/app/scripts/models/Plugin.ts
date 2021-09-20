import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface PluginAttributes extends TrelloModelAttributes {}

class Plugin extends TrelloModel<PluginAttributes> {
  static initClass() {
    this.prototype.typeName = 'Plugin';
  }
}
Plugin.initClass();

export { Plugin };

import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface PluginDataAttributes extends TrelloModelAttributes {
  idPlugin: string;
  scope: string;
  idModel: string;
}

class PluginData extends TrelloModel<PluginDataAttributes> {
  static initClass() {
    this.prototype.typeName = 'PluginData';
  }

  urlRoot() {
    return `/1/${this.get('scope')}/${this.get('idModel')}/pluginData`;
  }
}
PluginData.initClass();

export { PluginData };

const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { PluginData } = require('app/scripts/models/PluginData');
const _ = require('underscore');
const xtend = require('xtend');

class PluginDataList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = PluginData;
  }

  initialize(models, options) {
    return (this.scopeModel = options.scopeModel);
  }

  scope() {
    return this.scopeModel.typeName.toLowerCase();
  }

  for(idPlugin, visibility) {
    return _.find(this.models, (model) => {
      return (
        model.get('idPlugin') === idPlugin &&
        model.get('access') === visibility &&
        model.get('scope') === this.scope() &&
        model.get('idModel') === this.scopeModel.id
      );
    });
  }

  create(attributes, options) {
    attributes = xtend(attributes, {
      scope: this.scope(),
      idModel: this.scopeModel.id,
      access: attributes.visibility,
    });

    return super.create(attributes, options);
  }

  dataForPlugin(idPlugin) {
    return _.chain(this.models)
      .filter((entry) => entry.get('idPlugin') === idPlugin)
      .groupBy((entry) => entry.get('scope'))
      .mapObject((val) =>
        _.chain(val)
          .groupBy((entry) => entry.get('access'))
          .mapObject((val) => val[0].get('value'))
          .value(),
      )
      .value();
  }

  getPluginDataByKey(idPlugin, visibility, key, defaultVal) {
    const data = this.dataForPlugin(idPlugin);
    const scope = this.scope();
    const unparsed = data && data[scope] && data[scope][visibility];

    if (typeof unparsed === 'string') {
      const parsed = JSON.parse(unparsed);
      if (typeof parsed === 'object' && parsed[key] !== undefined) {
        return parsed[key];
      }
    }
    return defaultVal;
  }

  snoopDataForPlugin(idPlugin) {
    if (!this.signalCache) {
      this.signalCache = {};
    }
    if (!this.signalCache[idPlugin]) {
      this.signalCache[idPlugin] = this.snoop('value').map(() =>
        this.dataForPlugin(idPlugin),
      );
      // Temporary solution to avoid error caused from issue with guest members
      // Will address more long-term fix moving forward with DACI: https://tinyurl.com/4bpbvvjb
      this.signalCache[idPlugin].addDisposer(() => {
        if (this.signalCache) {
          delete this.signalCache[idPlugin];
        }
      });
    }
    return this.signalCache[idPlugin];
  }

  upsert(idPlugin, visibility, data) {
    const pluginData = this.for(idPlugin, visibility);
    if (pluginData) {
      pluginData.update('value', data);
    } else {
      this.create({
        idPlugin,
        visibility,
        value: data,
      });
    }
  }

  setPluginDataByKey(idPlugin, visibility, key, val) {
    const data = this.dataForPlugin(idPlugin);
    const scope = this.scope();
    const unparsed = data && data[scope] && data[scope][visibility];

    let updatedData = {};
    updatedData[key] = val;
    if (typeof unparsed === 'string') {
      const parsed = JSON.parse(unparsed);
      if (typeof parsed === 'object') {
        parsed[key] = val;
        updatedData = parsed;
      }
    }
    return this.upsert(idPlugin, visibility, JSON.stringify(updatedData));
  }
}
PluginDataList.initClass();

module.exports.PluginDataList = PluginDataList;

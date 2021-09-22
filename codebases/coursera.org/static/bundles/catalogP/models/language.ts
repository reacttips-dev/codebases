import _tLanguage from 'i18n!js/json/nls/languages';
import CatalogModel from 'bundles/catalogP/models/catalogModel';

const Language = CatalogModel.extend({
  fields: ['name'],

  resourceName: 'languages.v1',

  get(key: $TSFixMe) {
    const parentValue = this.constructor.__super__.get.apply(this, arguments);
    switch (key) {
      case 'name':
        return _tLanguage(parentValue);
      default:
        return parentValue;
    }
  },

  getUnlocalizedName() {
    return this.constructor.__super__.get.apply(this, 'name');
  },
});

export default Language;

import CatalogModel from 'bundles/catalogP/models/catalogModel';
import _tCategories from 'i18n!js/json/nls/categories';

const Category = CatalogModel.extend({
  resourceName: 'categories.v1',

  get(key: $TSFixMe) {
    const parentValue = this.constructor.__super__.get.apply(this, arguments);

    switch (key) {
      case 'name':
        return _tCategories(parentValue);
      default:
        return parentValue;
    }
  },
});

export default Category;

import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Category from 'bundles/catalogP/models/category';

const Categories = CatalogCollection.extend({
  model: Category,
  resourceName: 'categories.v1',
});

export default Categories;

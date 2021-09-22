import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import v1Detail from 'bundles/catalogP/models/v1Detail';

const v1Details = CatalogCollection.extend({
  model: v1Detail,
  resourceName: 'v1details.v1',
});

export default v1Details;

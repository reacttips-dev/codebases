import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import v2Detail from 'bundles/catalogP/models/v2Detail';

const v2Details = CatalogCollection.extend({
  model: v2Detail,
  resourceName: 'v2Details.v1',
});

export default v2Details;

import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import v1VcDetail from 'bundles/catalogP/models/v1VcDetail';

const v1VcDetails = CatalogCollection.extend({
  model: v1VcDetail,
  resourceName: 'v1VcDetails.v1',
});

export default v1VcDetails;

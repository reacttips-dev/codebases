import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import VcMembership from 'bundles/catalogP/models/vcMembership';

const VcMemberships = CatalogCollection.extend({
  model: VcMembership,
  resourceName: 'vcMemberships.v1',
});

export default VcMemberships;

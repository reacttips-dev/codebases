import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Specialization from 'bundles/catalogP/models/specialization';

const Specializations = CatalogCollection.extend({
  model: Specialization,
  resourceName: 'specializations.v1',

  includes: {},
});

export default Specializations;

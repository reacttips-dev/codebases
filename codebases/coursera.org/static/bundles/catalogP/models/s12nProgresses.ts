import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import S12nProgress from 'bundles/catalogP/models/s12nProgress';

const S12nProgressCollection = CatalogCollection.extend({
  model: S12nProgress,
  resourceName: 'onDemandSpecializationProgress.v1',
});

export default S12nProgressCollection;

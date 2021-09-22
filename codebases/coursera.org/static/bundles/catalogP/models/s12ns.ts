/* A collection for S12n (on-demand specialization) models.
 */
import CatalogCollection from 'bundles/catalogP/models/catalogCollection';

import S12n from 'bundles/catalogP/models/s12n';
import _ from 'underscore';

const S12nCollection = CatalogCollection.extend({
  model: S12n,
  resourceName: 'onDemandSpecializations.v1',
  includes: {},
  sortByFeaturedIndex() {
    this.models = _(this.models).sortBy(function (item) {
      const metadata = item.get('metadata') || item.get('details'); // handle both s12n and specialization models
      if (metadata && metadata.featuredIndex) {
        return metadata.featuredIndex;
      } else {
        return 1000000;
      }
    });
  },
});

export default S12nCollection;

import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import OnDemandSessionMembership from 'bundles/catalogP/models/onDemandSessionMembership';

const OnDemandSessionMemberships = CatalogCollection.extend({
  model: OnDemandSessionMembership,
  resourceName: 'onDemandSessionMemberships.v1',
});

export default OnDemandSessionMemberships;

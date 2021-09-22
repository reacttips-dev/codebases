import Backbone from 'backbone-associations';
import Q from 'q';
import _ from 'underscore';
import { memoizedCatalogData } from 'bundles/catalogP/api/api.promise';

const CatalogModel = Backbone.AssociatedModel.extend({
  // These are overwritten in models that extend CatalogModel
  defaults: {
    fields: [],
    includes: {},
    resourceName: '',
  },

  getIncludeAttribute(include: $TSFixMe) {
    if (_(this.includes).has(include)) {
      return this.includes[include].attribute;
    } else {
      return include;
    }
  },

  getIncludeResource(include: $TSFixMe) {
    if (_(this.includes).has(include)) {
      return this.includes[include].resource;
    } else {
      return undefined;
    }
  },

  // Overrides the default sync function to return a promise and use
  // catalogData for read api calls
  sync(method: $TSFixMe, model: $TSFixMe, options: $TSFixMe) {
    if (method === 'read') {
      const promise = memoizedCatalogData(model.url())
        .then(options && options.success)
        .catch(options && options.error);
      promise.done();
      return promise;
    } else {
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'IArguments' is not assignable to... Remove this comment to see the full error message
      return Q(Backbone.AssociatedModel.prototype.sync.apply(this, arguments));
    }
  },
});

export default CatalogModel;

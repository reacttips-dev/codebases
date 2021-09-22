import _ from 'lodash';
import Uri from 'jsuri';
import { NaptimeResourceType } from 'bundles/naptimejs/resources/NaptimeResource';
import NaptimeClient, { NaptimeClientQuery, NaptimeClientDataProcessor } from './NaptimeClient';

import Get from './Get';

class MultiGet<Result, Resource extends NaptimeResourceType> extends NaptimeClient<Result, Resource> {
  ids: Array<string | number>;

  constructor(
    resource: Resource,
    ids: Array<string | number>,
    params?: NaptimeClientQuery,
    dataProcessor?: NaptimeClientDataProcessor<Result, Resource[]>
  ) {
    super(resource, Object.assign({ ids }, params), dataProcessor);
    this.ids = ids;
  }

  getBaseUri() {
    const uri = new Uri(`/api/${this.resourceName}`);
    uri.addQueryParam('ids', this.ids.join(','));
    return uri;
  }

  isValid() {
    return this.ids !== undefined;
  }

  getClientIdentifier() {
    return `Get:${this.ids.join(',')}|${super.getClientIdentifier()}`;
  }

  getGetClients() {
    return this.ids.map((id) => {
      return new Get(this.resource, id, _.omit(this.data, 'ids'));
    });
  }
}

export default MultiGet;

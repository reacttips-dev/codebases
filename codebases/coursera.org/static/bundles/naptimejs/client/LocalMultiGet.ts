import Uri from 'jsuri';
import { NaptimeResourceType } from 'bundles/naptimejs/resources/NaptimeResource';
import NaptimeClient, { NaptimeClientQuery, NaptimeClientDataProcessor } from './NaptimeClient';

class LocalMultiGet<Result, Resource extends NaptimeResourceType> extends NaptimeClient<Result, Resource> {
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
    return `LocalGet:${this.ids.join(',')}|${super.getClientIdentifier()}`;
  }
}

export default LocalMultiGet;

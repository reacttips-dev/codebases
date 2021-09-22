import Uri from 'jsuri';
import { NaptimeResourceType } from 'bundles/naptimejs/resources/NaptimeResource';
import NaptimeClient, { NaptimeClientQuery, NaptimeClientDataProcessor } from './NaptimeClient';

class Get<Result, Resource extends NaptimeResourceType> extends NaptimeClient<Result, Resource> {
  id: string | number;

  constructor(
    resource: Resource,
    id: string | number,
    data?: NaptimeClientQuery,
    dataProcessor?: NaptimeClientDataProcessor<Result, Resource>
  ) {
    super(resource, data, dataProcessor);
    this.id = id;
  }

  getBaseUri() {
    return new Uri(`/api/${this.resourceName}/${this.id}`);
  }

  isValid() {
    return this.id !== undefined;
  }

  getClientIdentifier() {
    return `Get:${this.id}|${super.getClientIdentifier()}`;
  }
}

export default Get;

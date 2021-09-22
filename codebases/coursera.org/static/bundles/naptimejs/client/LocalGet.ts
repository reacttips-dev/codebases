import Uri from 'jsuri';
import { NaptimeResourceType } from 'bundles/naptimejs/resources/NaptimeResource';
import NaptimeClient, { NaptimeClientQuery } from './NaptimeClient';

class LocalGet<Resource extends NaptimeResourceType> extends NaptimeClient<InstanceType<Resource>> {
  id: string | number;

  constructor(resource: Resource, id: string | number, params?: NaptimeClientQuery) {
    super(resource, params);
    this.id = id;
  }

  getBaseUri() {
    return new Uri(`/api/${this.resourceName}/${this.id}`);
  }

  isValid() {
    return this.id !== undefined;
  }

  getClientIdentifier() {
    return `LocalGet:${this.id}|${super.getClientIdentifier()}`;
  }
}

export default LocalGet;

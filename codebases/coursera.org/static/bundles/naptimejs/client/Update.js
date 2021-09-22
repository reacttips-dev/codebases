import Uri from 'jsuri';
import NaptimeMutationClient from './NaptimeMutationClient';

class Update extends NaptimeMutationClient {
  constructor(resource, id, params) {
    super(resource, params);
    this.id = id;
  }

  getBaseUri() {
    return new Uri(`/api/${this.resourceName}/${this.id}`);
  }

  isValid() {
    return this.id !== undefined;
  }

  method = 'put';

  getClientIdentifier() {
    return `Update:${this.id}|${super.getClientIdentifier()}`;
  }
}

export default Update;

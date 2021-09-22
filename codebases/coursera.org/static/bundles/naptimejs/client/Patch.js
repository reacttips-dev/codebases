import Uri from 'jsuri';
import NaptimeMutationClient from './NaptimeMutationClient';

class Patch extends NaptimeMutationClient {
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

  method = 'patch';

  getClientIdentifier() {
    return `Patch:${this.id}|${super.getClientIdentifier()}`;
  }
}

export default Patch;

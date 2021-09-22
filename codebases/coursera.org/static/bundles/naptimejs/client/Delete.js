import Uri from 'jsuri';
import NaptimeMutationClient from './NaptimeMutationClient';

class Delete extends NaptimeMutationClient {
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

  method = 'delete';

  getClientIdentifier() {
    return `Delete:${this.actionName}|${super.getClientIdentifier()}`;
  }
}

export default Delete;

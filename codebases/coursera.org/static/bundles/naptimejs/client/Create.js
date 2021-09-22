import NaptimeMutationClient from './NaptimeMutationClient';

class Create extends NaptimeMutationClient {
  method = 'post';

  getClientIdentifier() {
    return `Create:${this.actionName}|${super.getClientIdentifier()}`;
  }
}

export default Create;

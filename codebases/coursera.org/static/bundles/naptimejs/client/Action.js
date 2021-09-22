import NaptimeMutationClient from './NaptimeMutationClient';

class Action extends NaptimeMutationClient {
  constructor(resource, actionName, data) {
    data.params.action = actionName;
    super(resource, data);
    this.actionName = actionName;
  }

  method = 'post';

  getClientIdentifier() {
    return `Action:${this.actionName}|${super.getClientIdentifier()}`;
  }
}

export default Action;

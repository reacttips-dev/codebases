import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import NaptimeResource from './NaptimeResource';

const makeKeyForUser = (userId, key) => tupleToStringKey([userId, key]);

class OnDemandSpecializationMembership extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandSpecializationMemberships.v1';

  static me(userId, s12nId, params = {}) {
    return this.get(makeKeyForUser(userId, s12nId), params);
  }
}

export default OnDemandSpecializationMembership;

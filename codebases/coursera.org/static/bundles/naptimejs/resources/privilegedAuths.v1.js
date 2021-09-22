import { isOutsourcing } from 'bundles/outsourcing/utils';
import NaptimeResource from './NaptimeResource';

class PrivilegedAuths extends NaptimeResource {
  static RESOURCE_NAME = 'privilegedAuths.v1';

  static me(opts) {
    return this.finder('me', opts, (profiles) => profiles[0]);
  }

  static getIsOutsourcingAgent(user) {
    // check the hacky isOutsourcing util first to avoid making an extra api call for most users
    if (isOutsourcing(user)) {
      return this.finder(
        'me',
        {
          fields: ['outsourcingPermissions'],
        },
        (profiles) => !!profiles[0] && !!profiles[0].outsourcingPermissions
      );
    } else {
      return false;
    }
  }
}

export default PrivilegedAuths;

import CurrentUserController from '../modules/controllers/CurrentUserController';
import { deterministicUUID } from './uuid-helper';

/**
 * DO-NOT-USE-THIS
 * THIS FUNCTION WILL BE REMOVED SOON AND WE WOULD NOT HAVE DEFAULT WORKSPACE
 */
export function defaultUserWorkspaceId () {
  return CurrentUserController
    .get()
    .then((currentUser) => {
      return deterministicUUID(`user:${currentUser.id}`);
    });
}

/**
 * DO-NOT-USE-THIS
 * THIS FUNCTION WILL BE REMOVED SOON AND WE WOULD NOT HAVE DEFAULT WORKSPACE
 */
export function defaultTeamWorkspaceId () {
  return CurrentUserController
    .get()
    .then((currentUser) => {
      let organizations = currentUser.organizations;

      if (_.isEmpty(organizations)) {
       return Promise.reject(`Organization not found for the user:${currentUser.id}`);
      }

      return deterministicUUID(`team:${organizations[0].id}`);
    });
}

/**
 *
 */
export function defaultOfflineWorkspaceId () {
  return Promise.resolve(deterministicUUID('user:0'));
}

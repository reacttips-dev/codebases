import PersistentStorage from '../persistent-storage/PersistentStorage';
import RemoteSyncRequestService from './RemoteSyncRequestService';

/**
 * Perform sign out flow on the web
 */
function signOutOnWeb () {
  // Cleanup the storage for the active partition. This is done to cleanup the data
  // for the user who's logging out.
  // The active partition can be used to store data like variable sessions, oauth2 tokens, etc
  // for the user. This is sensitive data and so we need to wipe it out as soon as the user
  // logs out.
  // This is a blocking step to ensure that the cleanup has been completed before we redirect
  // to the logout page. Otherwise, the data might only have been cleared partially before
  // the redirect happens.
  return RemoteSyncRequestService.request('/ws/proxy', {
    method: 'post',
    data: {
      service: 'identity',
      method: 'put',
      path: '/logout'
    }
  })

  // We do not want to treat authenticationError as an error in logging out user.
  // As this means user session has already expired which was original intent of his.
  // Therefore we will consider this as successful response.
  .catch((e) => {
    if (e.status === 403 && _.get(e, 'error.name') === 'authenticationError') { return; }

    throw e;
  })
  .then(() => {
    return PersistentStorage.cleanupActivePartition()
      .finally(() => {
          // Redirect to identity for clearing cookies
          window.location.assign(`${pm.identityUrl}/clear`);
      });
  });
}

export {
  signOutOnWeb
};

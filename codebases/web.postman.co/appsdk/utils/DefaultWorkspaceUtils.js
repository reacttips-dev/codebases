import { SyncRemoteFetcherService, SyncWorkspaceController } from '../../onboarding/src/common/dependencies';

let defaultWorkspace = null;

/**
 * Returns the default workspace for the user
 */
export async function getDefaultWorkspace () {

  /**
   * Internal function to filter out default workspace for the user
   */
  function filterDefaultWorkspace (workspaces) {
    return _.find(workspaces, (workspace) => {
      return workspace &&
        workspace.type === 'personal' &&
        _.get(workspace, 'state.isDefault') === true;
    });
  }

  if (defaultWorkspace) {
    return Promise.resolve(defaultWorkspace);
  }

  let workspaces = [];

  try {
    defaultWorkspace = await SyncRemoteFetcherService.remoteFetch('workspace', 'default');
    return defaultWorkspace;
  }
  catch (err) {
    pm.logger.error('Could not find workspaces', err);
    return Promise.reject(new Error('Could not get the default workspace of the user'));
  }
}

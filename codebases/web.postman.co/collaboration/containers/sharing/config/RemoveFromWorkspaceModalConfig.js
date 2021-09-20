export const ENTITY_CONFIG = {
  collection: {
    helpText: 'Removing this collection will also remove any monitors, mock servers and integrations created on this collection from this workspace.'
  },
  environment: {
    helpText: 'Removing this environment might cause any monitors or mock servers using it in this workspace to stop functioning properly.'
  },
  api: {
    helpText: 'The mock servers, documentation, environments, test suites and monitors linked to this API won\'t be affected.',
    userFriendlyEntityName: 'API'
  }
};

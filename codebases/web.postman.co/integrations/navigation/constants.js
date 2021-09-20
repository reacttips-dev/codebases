import { OPEN_API_VERSION_URL, OPEN_API_URL } from '../../api-dev/navigation/constants';

export const OPEN_IMPORT_IDENTIFIER = 'build.import',
  OPEN_IMPORT_URL = 'import',
  OPEN_INTEGRATIONS_HOME_IDENTIFIER = 'integrations',
  OPEN_INTEGRATIONS_HOME_URL = 'integrations',
  TEAM_INTEGRATIONS_URL = 'integrations/service/:serviceId/:ruleId',
  TEAM_INTEGRATIONS_IDENTIFIER = 'integrations.openInDetails',
  BROWSE_INTEGRATIONS_URL = 'integrations/browse',
  BROWSE_INTEGRATIONS_IDENTIFIER = 'integrations.browse',
  INTEGRATIONS_SERVICE_DETAILS_PAGE_IDENTIFIER = 'integrations.serviceDetails',
  INTEGRATIONS_SERVICE_DETAILS_PAGE_URL = 'integrations/service/:serviceId',
  ADD_INTEGRATIONS_URL = 'integrations/service/:serviceId/add/:ruleId',
  ADD_INTEGRATIONS_IDENTIFIER = 'integrations.add',
  INTEGRATIONS_AUTH_REDIRECT_URL = 'integrations/services/:serviceId/:ruleId/auth-redirect',
  INTEGRATIONS_AUTH_REDIRECT_IDENTIFIER = 'integrations.authRedirect',
  AUTHORIZED_INTEGRATIONS_URL = 'integrations/service/:serviceId/add/:ruleId/authorized',
  AUTHORIZED_INTEGRATIONS_IDENTIFIER = 'integrations.authorized',
  INTEGRATIONS_RUNS_PAGE_IDENTIFIER = 'integrations.runLog',
  INTEGRATIONS_RUNS_PAGE_URL = 'integrations/:integrationId/runs',
  EDIT_INTEGRATIONS_URL = 'integrations/:integrationId',
  EDIT_INTEGRATIONS_IDENTIFIER = 'integrations.edit',

  // Prodash Routes Identifier and URL
  PRODASH_OPEN_INTEGRATIONS_HOME_IDENTIFIER = 'prodash.integrations',
  PRODASH_OPEN_INTEGRATIONS_HOME_URL = 'workspaces/:wid/integrations',
  PRODASH_CONFIGURED_INTEGRATIONS_SERVICE_IDENTIFIER = 'prodash.integrations.configuredServiceDetails',
  PRODASH_CONFIGURED_INTEGRATIONS_SERVICE_URL = 'integrations/services/:serviceId/configured',
  PRODASH_INTEGRATIONS_SERVICE_DETAILS_PAGE_IDENTIFIER = 'prodash.integrations.serviceDetails',
  PRODASH_INTEGRATIONS_SERVICE_DETAILS_PAGE_URL = 'integrations/services/:serviceId',
  PRODASH_AUTHORIZED_INTEGRATIONS_IDENTIFIER = 'prodash.integrations.authorized',
  PRODASH_AUTHORIZED_INTEGRATIONS_URL = 'integrations/services/:serviceId/add/:rule/authorized',
  PRODASH_ADD_INTEGRATIONS_IDENTIFIER = 'prodash.integrations.add',
  PRODASH_ADD_INTEGRATIONS_URL = 'integrations/services/:serviceId/add/:ruleId';

export const API_CI_INTEGRATION_URL = OPEN_API_VERSION_URL + '/integrations/ci/add';
export const API_EDIT_CI_INTEGRATION_URL = OPEN_API_VERSION_URL + '/integrations/ci/:integrationId/edit';
export const API_CI_CONFIGURE_NEWMAN = OPEN_API_VERSION_URL + '/integrations/ci/:integrationId/configure-newman';
export const API_CI_VIEW_BUILDS_URL = OPEN_API_VERSION_URL + '/integrations/ci/:integrationId/builds';
export const API_OBSERVABILITY_URL = OPEN_API_VERSION_URL + '/integrations/observability';
export const API_OBSERVABILITY_EDIT_URL = OPEN_API_VERSION_URL + '/integrations/observability/:integrationId/edit';
export const API_MONITORING_URL = OPEN_API_VERSION_URL + '/integrations/apm/add';
export const API_MONITORING_EDIT_URL = OPEN_API_VERSION_URL + '/integrations/apm/:integrationId/edit';
export const API_MONITORING_DASHBOARD_URL = OPEN_API_VERSION_URL + '/integrations/apm/:integrationId/dashboard';



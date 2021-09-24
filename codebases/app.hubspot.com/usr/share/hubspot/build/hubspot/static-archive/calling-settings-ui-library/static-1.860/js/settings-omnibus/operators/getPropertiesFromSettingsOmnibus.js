'use es6';

import getIn from 'transmute/getIn';
export var getPortalSettingsFromOmnibus = getIn(['portalSummary']);
export var getAircallInstalledFromOmnibus = getIn(['installedCallingSettings', 'result', 'aircallInstalled']);
export var getInstalledCallingApplicationsFromOmnibus = getIn(['installedCallingSettings', 'result', 'results']);
export var getCallingAdminSettingsFromOmnibus = getIn(['data', 'callingAdminSettings', 'result']);
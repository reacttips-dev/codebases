'use es6';

import getIn from 'transmute/getIn';
export var getPortalSettingsFromOmnibus = getIn(['portalSummary']);
export var getInstalledPortalApplicationsFromOmnibus = getIn(['installedPortalApplications', '@ok']);
export var getConnectedCallingSettingsFromOmnibus = getIn(['connectedCallingSettings', '@ok']);
export var getCallingAdminSettingsFromOmnibus = getIn(['callingAdminSettings', 'result']);
'use es6'; // The following disable directive for no-restricted-imports is intentional. We need to mport it for setup.
// eslint-disable-next-line no-restricted-imports

import GlobalLimitsContainer from 'crm-legacy-global-containers/GlobalLimitsContainer';
import LimitsContainer from '../containers/LimitsContainer';
var _limitsToCheck = [// fewer lists allowed for marketing-starter-2018
'contact-lists', 'contact-smart-lists'];
export var setupLimitsContainer = function setupLimitsContainer(auth) {
  var portal = auth.portal;

  var limitsMap = _limitsToCheck.reduce(function (acc, limit) {
    acc[limit] = portal.limits[limit];
    return acc;
  }, {});

  LimitsContainer.set(limitsMap);
  GlobalLimitsContainer.setContainer(LimitsContainer);
};
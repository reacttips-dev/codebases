'use es6';

import PortalIdParser from 'PortalIdParser';
export var getCreateTeamsURL = function getCreateTeamsURL() {
  return "/settings/" + PortalIdParser.get() + "/users";
};
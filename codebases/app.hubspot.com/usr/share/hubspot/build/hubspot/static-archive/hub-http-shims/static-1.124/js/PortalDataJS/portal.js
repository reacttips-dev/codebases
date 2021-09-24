'use es6';

import { Promise } from 'hub-http/helpers/promise';
import userInfo from 'hub-http/userInfo';
import modelShim from '../modelShim';
var portalInfo;

var portalShim = function portalShim(portal) {
  return Object.assign(modelShim(portal), {
    isBasic: function isBasic() {
      return this.get('family_id') === 1;
    },
    isBasicOrHigher: function isBasicOrHigher() {
      return this.get('family_id') >= 1;
    },
    isProfessional: function isProfessional() {
      return this.get('family_id') === 2;
    },
    isProOrHigher: function isProOrHigher() {
      return this.get('family_id') >= 2;
    },
    isEnterprise: function isEnterprise() {
      return this.get('family_id') === 3;
    }
  });
};

var Portal = {
  get: function get() {
    return portalInfo;
  },
  then: function then() {
    var _Promise$resolve, _userInfo$then;

    if (portalInfo) return (_Promise$resolve = Promise.resolve(portalInfo)).then.apply(_Promise$resolve, arguments);
    return (_userInfo$then = userInfo().then(function (_ref) {
      var portal = _ref.portal;
      portalInfo = portalShim(portal);
      return portalInfo;
    })).then.apply(_userInfo$then, arguments);
  }
};
export default Portal;
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _NONSTANDARD_LB_CONFI;

var STANDARD_LBS = {
  hubapi: ['api', 'email', 'etsu', 'feedback', 'internal', 'onboarding', 'nav', 'private', 'users', 'zorse'],
  hubspot: ['app', 'developers', 'cms2', 'cta', 'forms', 'library', 'login', 'marketplace', 'onboarding', 'payment', 'services', 'signup', 'sites', 'spitfire', 'uploads'],
  hubteam: ['graph', 'mesos', 'rodan2', 'tools', 'bootstrap', 'test']
};
var NONSTANDARD_LBS = ['sidekick', 'sidekickapp', 'hs-sites', 'mktg-grader', 'inbound', 'signals', 'private-hubteam', 'app-api'];
var STANDARD_DEFAULT_LBS = {
  hubapi: 'api',
  hubspot: 'app',
  hubteam: 'tools'
};
var NONSTANDARD_LB_CONFIGS = (_NONSTANDARD_LB_CONFI = {
  sidekick: {
    true: {
      true: 'local.getsidekick.com',
      false: 'api.getsidekick.com'
    },
    false: {
      true: 'local.getsidekickqa.com',
      false: 'api.getsidekickqa.com'
    }
  },
  sidekickapp: {
    true: {
      true: 'local.getsidekick.com',
      false: 'app.getsidekick.com'
    },
    false: {
      true: 'local.getsidekickqa.com',
      false: 'app.getsidekickqa.com'
    }
  }
}, _defineProperty(_NONSTANDARD_LB_CONFI, 'hs-sites', {
  true: {
    true: 'local.hs-sites.com',
    false: 'hs-sites.com'
  },
  false: {
    true: 'local.qa.hs-sites.com',
    false: 'qa.hs-sites.com'
  }
}), _defineProperty(_NONSTANDARD_LB_CONFI, 'mktg-grader', {
  true: {
    true: 'local.grader.com',
    false: 'marketing.grader.com'
  },
  false: {
    true: 'local.graderqa.com',
    false: 'marketing.graderqa.com'
  }
}), _defineProperty(_NONSTANDARD_LB_CONFI, "inbound", {
  true: {
    true: 'local.inbound.org',
    false: 'inbound.org'
  },
  false: {
    true: 'local.dev.inbound.org',
    false: 'dev.inbound.org'
  }
}), _defineProperty(_NONSTANDARD_LB_CONFI, "signals", {
  true: {
    true: 'local.getsignals.com',
    false: 'api.getsignals.com'
  },
  false: {
    true: 'local.getsignalsqa.com',
    false: 'api.getsignalsqa.com'
  }
}), _defineProperty(_NONSTANDARD_LB_CONFI, 'private-hubteam', {
  true: {
    true: 'local.hubteam.com',
    false: 'private.hubteam.com'
  },
  false: {
    true: 'local.hubteamqa.com',
    false: 'private.hubteamqa.com'
  }
}), _defineProperty(_NONSTANDARD_LB_CONFI, 'app-api', {
  true: {
    true: 'local.hubspot.com',
    false: 'api.hubspot.com'
  },
  false: {
    true: 'local.hubspotqa.com',
    false: 'api.hubspotqa.com'
  }
}), _NONSTANDARD_LB_CONFI);

var Domains = /*#__PURE__*/function () {
  function Domains() {
    _classCallCheck(this, Domains);

    this.lbDomainMap = Domains._buildLbDomainMap();
    this.domainLbMap = Domains._buildDomainLbMap(this.lbDomainMap);
  }

  _createClass(Domains, [{
    key: "getDomain",
    value: function getDomain(lb) {
      var production = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var local = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var map = this.lbDomainMap[lb];

      if (!map) {
        return undefined;
      }

      return map[production][local];
    }
  }, {
    key: "getLbInfo",
    value: function getLbInfo(domain) {
      var hint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var info = this.domainLbMap[domain];

      if (!info) {
        return undefined;
      }

      var lb = info.defaultLb;

      if (hint && info.multiple && info.lbs[hint]) {
        lb = hint;
      }

      return {
        lb: lb,
        production: info.production,
        local: info.local
      };
    }
  }, {
    key: "getLb",
    value: function getLb(domain) {
      var hint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var info = this.getLbInfo(domain, hint);

      if (!info) {
        return undefined;
      }

      return info.lb;
    }
  }, {
    key: "getProduction",
    value: function getProduction(domain) {
      var info = this.getLbInfo(domain);

      if (!info) {
        return undefined;
      }

      return info.production;
    }
  }, {
    key: "getLocal",
    value: function getLocal(domain) {
      var info = this.getLbInfo(domain);

      if (!info) {
        return undefined;
      }

      return info.local;
    }
  }], [{
    key: "_buildLbDomainMap",
    value: function _buildLbDomainMap() {
      // [name][production?][local?] = hostname
      var map = {};
      Object.keys(STANDARD_LBS).forEach(function (k) {
        return STANDARD_LBS[k].forEach(function (lb) {
          return map[lb] = {
            true: {
              true: "local." + k + ".com",
              false: lb + "." + k + ".com"
            },
            false: {
              true: "local." + k + "qa.com",
              false: lb + "." + k + "qa.com"
            }
          };
        });
      });
      NONSTANDARD_LBS.forEach(function (k) {
        return map[k] = NONSTANDARD_LB_CONFIGS[k];
      });
      return map;
    }
  }, {
    key: "_buildDomainLbMap",
    value: function _buildDomainLbMap(lbDomainMap) {
      var map = {};
      Object.keys(lbDomainMap).forEach(function (lb) {
        return [true, false].forEach(function (production) {
          return [true, false].forEach(function (local) {
            var domain = lbDomainMap[lb][production][local];
            var info = map[domain];

            if (info) {
              info.lbs[lb] = true;
              info.multiple = true;
            } else {
              map[domain] = {
                defaultLb: lb,
                lbs: _defineProperty({}, lb, true),
                // poor man's set
                production: production,
                local: local
              };
            }
          });
        });
      });
      Object.keys(STANDARD_DEFAULT_LBS).forEach(function (k) {
        var lb = STANDARD_DEFAULT_LBS[k];
        map["local." + k + "qa.com"].defaultLb = lb;
        map["local." + k + ".com"].defaultLb = lb;
      });
      return map;
    }
  }]);

  return Domains;
}();

var domains = new Domains();
domains.STANDARD_LBS = STANDARD_LBS;
domains.NONSTANDARD_LBS = NONSTANDARD_LBS;
export default domains;
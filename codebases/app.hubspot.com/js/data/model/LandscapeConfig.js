'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { pick } from 'underscore';
import { RIVAL_IQ_NETWORK_OPTIONS, RIVAL_IQ_TIME_PERIODS } from '../../lib/constants';
import { stringify } from 'hub-http/helpers/params';
var DEFAULTS = {
  id: null,
  companies: null,
  orderBy: 'publishedAt',
  direction: 'desc',
  network: 'all',
  timePeriod: 'last30days',
  companyId: null,
  landscapeSearch: '',
  loading: false
};
var SUPPORTED_QUERY_PARAMS = ['network', 'timePeriod', 'orderBy', 'direction', 'landscapeSearch'];

var LandscapeConfig = /*#__PURE__*/function (_Record) {
  _inherits(LandscapeConfig, _Record);

  function LandscapeConfig() {
    _classCallCheck(this, LandscapeConfig);

    return _possibleConstructorReturn(this, _getPrototypeOf(LandscapeConfig).apply(this, arguments));
  }

  _createClass(LandscapeConfig, [{
    key: "getUrlParams",
    value: function getUrlParams(currentLocation) {
      var _this = this;

      var queryParams = currentLocation.query;
      SUPPORTED_QUERY_PARAMS.forEach(function (param) {
        if (_this.get(param) || param === 'landscapeSearch') {
          queryParams[param] = _this.get(param);

          if (_this.get(param) === DEFAULTS[param]) {
            delete queryParams[param];
          }
        }
      });
      var parsedQueryParams = stringify(queryParams);

      if (parsedQueryParams.length === 0) {
        return "" + currentLocation.pathname;
      }

      return currentLocation.pathname + "?" + parsedQueryParams;
    }
  }, {
    key: "getQuery",
    value: function getQuery() {
      var _this2 = this;

      var query = {};
      SUPPORTED_QUERY_PARAMS.forEach(function (param) {
        if (_this2.get(param) && _this2.get(param) !== DEFAULTS[param]) {
          query[param] = _this2.get(param);
        }
      });
      return query;
    }
  }, {
    key: "getSelectedCompany",
    value: function getSelectedCompany() {
      var _this3 = this;

      if (this.companies) {
        var company = this.companies.find(function (c) {
          return c.id === _this3.companyId;
        });

        if (company) {
          return company.name;
        }
      }

      return '';
    }
  }, {
    key: "hasCompanies",
    value: function hasCompanies() {
      return this.companies && this.companies.length > 0;
    }
  }], [{
    key: "createFromQueryParams",
    value: function createFromQueryParams(params) {
      var modelParameters = pick(params, SUPPORTED_QUERY_PARAMS);

      if (!RIVAL_IQ_NETWORK_OPTIONS.includes(params.network)) {
        modelParameters.network = DEFAULTS.network;
      }

      if (!RIVAL_IQ_TIME_PERIODS.includes(params.timePeriod)) {
        modelParameters.timePeriod = DEFAULTS.timePeriod;
      }

      if (params.landscapeSearch) {
        modelParameters.landscapeSearch = params.landscapeSearch;
      } else {
        modelParameters.search = DEFAULTS.search;
      }

      return new LandscapeConfig(modelParameters);
    }
  }]);

  return LandscapeConfig;
}(Record(DEFAULTS));

export { LandscapeConfig as default };
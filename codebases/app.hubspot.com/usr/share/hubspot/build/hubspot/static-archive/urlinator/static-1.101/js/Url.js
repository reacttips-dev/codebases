'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import Env from 'enviro';
import domains from './domains';

var isBoolean = function isBoolean(value) {
  return typeof value === 'boolean' || value != null && value.valueOf && typeof value.valueOf() === 'boolean';
};

var isObject = function isObject(o) {
  return !!o && typeof o === 'object';
};

var Url = /*#__PURE__*/function () {
  function Url(url, overrides, filler) {
    _classCallCheck(this, Url);

    if (isObject(url) && !(url instanceof Url)) {
      if (url === window.location) {
        filler = filler || {};
        filler.protocol = url.protocol.slice(0, -1);
        filler.hostname = url.hostname;
        filler.pathname = url.pathname;
        filler.search = url.search;
        filler.hash = url.hash;
      } else {
        filler = url;
      }
    } else {
      filler = filler || {};
      filler.url = url;
    }

    if (filler.url instanceof Url) {
      this._cloneFrom(filler.url);

      this.upsertParams(filler.params || {});
    } else {
      filler.protocol = filler.protocol || window.location.protocol.slice(0, -1);

      this._set(filler, overrides);
    }

    this.update(overrides);
  }

  _createClass(Url, [{
    key: "_set",
    value: function _set() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var skips = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var url = opts.url || '';
      var indexHash = url.indexOf('#');

      if (!skips.hash) {
        this.hash = indexHash >= 0 ? url.substr(indexHash) : opts.hash || '';
      }

      url = indexHash >= 0 ? url.substr(0, indexHash) : url;
      var i = url.indexOf('?');

      if (!skips.params && !skips.search) {
        this.search = i >= 0 ? url.substr(i) : opts.search || '';
        this.upsertParams(opts.params || {});
      }

      url = i >= 0 ? url.substr(0, i) : url;
      i = url.indexOf('//');

      if (i > 0 && url[i - 1] != ':') {
        // to differentiate between protocol/domain boundary and domain/path boundary (with missing segment)
        i = -1;
      }

      if (!skips.protocol) {
        this.protocol = i > 0 ? url.substr(0, i - 1) : opts.protocol;
      }

      var j = i < 0 ? 0 : i + 2;
      var k = url.indexOf('/', j);

      if (skips.pathname === undefined) {
        this.pathname = (k < 0 ? '' : url.substr(k)) || opts.pathname || '';
      }

      if (skips.hostname === undefined) {
        var hostname = (k < 0 ? url.substr(j) : url.substr(j, k - j)) || opts.hostname;

        if (hostname) {
          this._lb = opts.lb;
          this.hostname = hostname;
        } else if (opts.lb) {
          this.setLb(opts.lb, opts);
        }
      }
    }
  }, {
    key: "update",
    value: function update() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (opts.protocol) {
        this.protocol = opts.protocol;
      }

      if (opts.hostname !== undefined) {
        this.hostname = opts.hostname;
      }

      if (opts.pathname !== undefined) {
        this.pathname = opts.pathname;
      }

      if (opts.hash !== undefined) {
        this.hash = opts.hash;
      }

      if (opts.lb || opts.production !== undefined || opts.local !== undefined) {
        var o = {
          production: opts.production !== undefined ? opts.production : this.production,
          local: opts.local !== undefined ? opts.local : this.local
        };
        this.setLb(opts.lb || this._lb, o);
      }

      if (opts.search) {
        this.search = opts.search;
      } else if (opts.params) {
        this.params = opts.params;
      } else if (opts.paramTuples) {
        this.paramTuples = opts.paramTuples;
      } else if (opts.encodedParamTuples) {
        this._lonelyQMark = false;
        this.encodedParamTuples = opts.encodedParamTuples.slice(0);

        this._rebuildParamInfo();
      }
    }
  }, {
    key: "setLb",
    value: function setLb(lb) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var service = this.segments[0];

      var production = this._getProduction(options.production, service);

      var local = this._getLocal(options.local, service);

      this._hostname = domains.getDomain(lb, production, local);
      this._lb = this._hostname && lb;
      this._production = this._hostname && production;
      this._local = this._hostname && local;
    }
  }, {
    key: "normalize",
    value: function normalize() {
      this._lonelyQMark = false;
    }
  }, {
    key: "_rebuildParamInfo",
    value: function _rebuildParamInfo() {
      var _this = this;

      this._paramIndex = {};
      this.validParams = true;
      this.encodedParamTuples.forEach(function (tuple, i) {
        _this.validParams = _this.validParams && tuple.length == 2;
        var decodedKey = decodeURIComponent(tuple[0]);

        if (_this._paramIndex[decodedKey]) {
          _this._paramIndex[decodedKey].push(i);
        } else {
          _this._paramIndex[decodedKey] = [i];
        }
      });
    }
  }, {
    key: "paramValues",
    value: function paramValues(key) {
      var _this2 = this;

      return (this._paramIndex[key] || []).map(function (v) {
        return decodeURIComponent(_this2.encodedParamTuples[v][1]);
      });
    }
  }, {
    key: "paramValue",
    value: function paramValue(key) {
      var arr = this.paramValues(key);
      return arr[arr.length - 1];
    }
  }, {
    key: "encodedParamValues",
    value: function encodedParamValues(key) {
      var _this3 = this;

      return (this._paramIndex[decodeURIComponent(key)] || []).map(function (v) {
        return _this3.encodedParamTuples[v][1];
      });
    }
  }, {
    key: "encodedParamValue",
    value: function encodedParamValue(key) {
      var arr = this.encodedParamValues(key);
      return arr[arr.length - 1];
    }
  }, {
    key: "insertParamAt",
    value: function insertParamAt(pos, key, value) {
      this.insertEncodedParamAt(pos, encodeURIComponent(key), encodeURIComponent(value));
    }
  }, {
    key: "insertEncodedParamAt",
    value: function insertEncodedParamAt(pos, key, value) {
      this.encodedParamTuples.splice(pos, 0, [key, value]);

      this._rebuildParamInfo();
    }
  }, {
    key: "pushParam",
    value: function pushParam(key, value) {
      this.insertParamAt(this.encodedParamTuples.length, key, value);
    }
  }, {
    key: "pushEncodedParam",
    value: function pushEncodedParam(key, value) {
      this.insertEncodedParamAt(this.encodedParamTuples.length, key, value);
    }
  }, {
    key: "upsertParam",
    value: function upsertParam(key, value) {
      var _this4 = this;

      var arr = this._paramIndex[key] || [];

      if (arr.length > 0) {
        arr.forEach(function (i) {
          return _this4.updateParamAt(i, key, value);
        });
      } else {
        this.pushParam(key, value);
      }
    }
  }, {
    key: "upsertParams",
    value: function upsertParams(params) {
      var _this5 = this;

      Object.keys(params).forEach(function (key) {
        return _this5.upsertParam(key, params[key]);
      });
    }
  }, {
    key: "updateParamAt",
    value: function updateParamAt(pos, key, value) {
      this.updateEncodedParamAt(pos, encodeURIComponent(key), encodeURIComponent(value));
    }
  }, {
    key: "updateEncodedParamAt",
    value: function updateEncodedParamAt(pos, key, value) {
      this.encodedParamTuples.splice(pos, 1, [key, value]);

      this._rebuildParamInfo();
    }
  }, {
    key: "removeParam",
    value: function removeParam(key) {
      var _this6 = this;

      var arr = this._paramIndex[key] || [];

      if (arr.length > 0) {
        arr.reverse().forEach(function (i) {
          return _this6.encodedParamTuples.splice(i, 1);
        });

        this._rebuildParamInfo();
      }
    }
  }, {
    key: "removeParamAt",
    value: function removeParamAt(pos) {
      this.encodedParamTuples.splice(pos, 1);

      this._rebuildParamInfo();
    }
  }, {
    key: "clearParams",
    value: function clearParams() {
      this.encodedParamTuples = [];
      this.validParams = true;
      this._paramIndex = {};
      this._lonelyQMark = false;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Url(this);
    }
  }, {
    key: "_cloneFrom",
    value: function _cloneFrom(url) {
      var _this7 = this;

      this.protocol = url.protocol;
      this._hostname = url._hostname;
      this._lb = url._lb;
      this._production = url._production;
      this._local = url._local;
      this.pathname = url.pathname;
      this.hash = url.hash;
      this.encodedParamTuples = url.encodedParamTuples.slice(0);
      this.validParams = url.validParams;
      this._paramIndex = {};
      Object.keys(url._paramIndex).forEach(function (k) {
        _this7._paramIndex[k] = url._paramIndex[k].slice(0);
      });
      this._lonelyQMark = url._lonelyQMark;
      return this;
    }
  }, {
    key: "_getProduction",
    value: function _getProduction(value, service) {
      if (isBoolean(value)) {
        return value;
      }

      if (isBoolean(this._production)) {
        return this._production;
      }

      return Env.get(service) == 'production';
    }
  }, {
    key: "_getLocal",
    value: function _getLocal(value, service) {
      if (isBoolean(value)) {
        return value;
      }

      if (isBoolean(this._local)) {
        return this._local;
      }

      if (service) {
        if (Env.get(service) == 'local') {
          return true;
        }

        return Url.localService(service);
      }

      return false;
    }
  }, {
    key: "href",
    get: function get() {
      return this.protocol + '://' + (this.hostname || '') + this.pathname + this.search + this.hash;
    },
    set: function set(value) {
      this._set({
        url: value
      });
    }
  }, {
    key: "search",
    get: function get() {
      var s = this.encodedParamTuples.map(function (tuple) {
        return tuple.join('=');
      }).join('&');
      return s.length > 0 || this._lonelyQMark ? '?' + s : s;
    },
    set: function set(value) {
      var _this8 = this;

      this.encodedParamTuples = [];
      this._lonelyQMark = false;

      if (value.length > 1) {
        value.substr(1).split('&').forEach(function (s) {
          return _this8.encodedParamTuples.push(s.split('='));
        });
      } else if (value[0] === '?') {
        this._lonelyQMark = true;
      }

      this._rebuildParamInfo();
    }
  }, {
    key: "hostname",
    set: function set(value) {
      this._hostname = value;
      var info = domains.getLbInfo(value, this._lb);
      this._lb = info && info.lb;
      this._production = info && info.production;
      this._local = info && info.local;
    },
    get: function get() {
      return this._hostname;
    }
  }, {
    key: "lb",
    get: function get() {
      return this._lb;
    },
    set: function set(value) {
      this.setLb(value);
    }
  }, {
    key: "production",
    get: function get() {
      return this._production;
    },
    set: function set(value) {
      if (this._lb) {
        this._production = !!value;
        this._hostname = domains.getDomain(this._lb, this._production, this._local);
      }
    }
  }, {
    key: "local",
    get: function get() {
      return this._local;
    },
    set: function set(value) {
      if (this._lb) {
        this._local = !!value;
        this._hostname = domains.getDomain(this._lb, this._production, this._local);
      }
    }
  }, {
    key: "env",
    get: function get() {
      return this._production === undefined ? 'unknown' : this._production ? 'prod' : 'qa';
    }
  }, {
    key: "lbInfo",
    get: function get() {
      return {
        lb: this._lb,
        production: this._production,
        local: this._local
      };
    }
  }, {
    key: "segments",
    get: function get() {
      var trimmed = this.pathname.replace(/(^\/)|\/$/g, '');
      return (trimmed ? trimmed.split('/') : []).map(function (s) {
        return decodeURIComponent(s);
      });
    }
  }, {
    key: "paramTuples",
    get: function get() {
      return this.encodedParamTuples.map(function (tuple) {
        return [decodeURIComponent(tuple[0]), decodeURIComponent(tuple[1])];
      });
    },
    set: function set(tuples) {
      var _this9 = this;

      this.encodedParamTuples = [];
      this._lonelyQMark = false;
      tuples.forEach(function (t) {
        return _this9.encodedParamTuples.push([t[0], t[1]]);
      });

      this._rebuildParamInfo();
    }
  }, {
    key: "params",
    get: function get() {
      var _this10 = this;

      var hash = {};
      Object.keys(this._paramIndex).forEach(function (key) {
        return hash[key] = _this10.paramValue(key);
      });
      return hash;
    },
    set: function set(hash) {
      var _this11 = this;

      this.encodedParamTuples = [];
      this._lonelyQMark = false;
      Object.keys(hash).forEach(function (k) {
        return _this11.encodedParamTuples.push([k, encodeURIComponent(hash[k])]);
      });

      this._rebuildParamInfo();
    }
  }, {
    key: "valid",
    get: function get() {
      return !!(this.protocol && this._hostname && (this.pathname || this.pathname === '') && this.validParams);
    }
  }, {
    key: "hostplus",
    get: function get() {
      return (this.hostname || '') + this.pathname + this.search + this.hash;
    }
  }, {
    key: "pathplus",
    get: function get() {
      return this.pathname + this.search + this.hash;
    }
  }], [{
    key: "localService",
    value: function localService(service) {
      try {
        if (window.localStorage) {
          var key = service.toUpperCase() + "_LOCAL";
          return window.localStorage.getItem(key) == 'true';
        }
      } catch (e) {}

      return false;
    }
  }]);

  return Url;
}();

Url.loaded = new Url(window.location);
export default Url;
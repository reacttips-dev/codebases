'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { deleteFrom, getFrom, setFrom } from 'crm_data/settings/LocalSettings';

var getStorage = function getStorage(_ref) {
  var session = _ref.session;

  if (session) {
    return sessionStorage;
  }

  return localStorage;
};

var LocalSettings = /*#__PURE__*/function () {
  function LocalSettings() {
    _classCallCheck(this, LocalSettings);

    this._attributes = {};
  }

  _createClass(LocalSettings, [{
    key: "get",
    value: function get(attr) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var item = this._attributes[attr];

      if (!item || options.force) {
        try {
          item = getFrom(getStorage(options), attr);
        } finally {
          if (item) {
            this.set(attr, item);
          }
        }
      }

      return item;
    }
  }, {
    key: "set",
    value: function set(key, val) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var attrs = {};

      if (typeof key === 'object') {
        attrs = key;
        options = val || {};
      } else {
        attrs[key] = val;
      }

      try {
        var storage = getStorage(options);
        Object.keys(attrs).forEach(function (attr) {
          var value = attrs[attr];

          if (options.unset) {
            deleteFrom(storage, attr);
          } else {
            setFrom(storage, attr, value);
          }
        });
      } finally {
        Object.keys(attrs).forEach(function (attr) {
          if (options.unset) {
            delete _this._attributes[attr];
          } else {
            // clone object if the value is an object to avoid cache being mutated
            var value = typeof attrs[attr] === 'object' ? Object.assign({}, attrs[attr]) : attrs[attr];
            _this._attributes[attr] = value;
          }
        });
      }
    }
  }, {
    key: "unset",
    value: function unset(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        var storage = getStorage(options);
        deleteFrom(storage, key);
      } finally {
        delete this._attributes[key];
      }
    }
  }]);

  return LocalSettings;
}();

var settings = new LocalSettings();
export default settings;
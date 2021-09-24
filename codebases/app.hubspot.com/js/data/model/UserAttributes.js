'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _DEFAULTS;

import { fromJS, Record } from 'immutable';
import { DEFAULT_SAVED_COLUMNS, SHEPHERD_TOURS_USER_ATTRIBUTES, USER_ATTR_FAVORITE_CHANNEL_KEYS, USER_ATTR_DEFAULT_PUBLISHING_VIEW, USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN, USER_ATTR_DEFAULT_PUBLISH_NOW, USER_ATTR_MANAGE_COLUMNS, USER_ATTR_FAILED_POST_BANNER_DISMISSAL_TIME } from '../../lib/constants';
var DEFAULTS = (_DEFAULTS = {}, _defineProperty(_DEFAULTS, SHEPHERD_TOURS_USER_ATTRIBUTES.reportsNextOverview, '{}'), _defineProperty(_DEFAULTS, SHEPHERD_TOURS_USER_ATTRIBUTES.publishingTable, '{}'), _defineProperty(_DEFAULTS, SHEPHERD_TOURS_USER_ATTRIBUTES.detailsPanel, '{}'), _defineProperty(_DEFAULTS, SHEPHERD_TOURS_USER_ATTRIBUTES.manageDashboard, '{}'), _defineProperty(_DEFAULTS, SHEPHERD_TOURS_USER_ATTRIBUTES.manageDashboardStartTourModal, '{}'), _defineProperty(_DEFAULTS, SHEPHERD_TOURS_USER_ATTRIBUTES.composer, 'false'), _defineProperty(_DEFAULTS, USER_ATTR_FAVORITE_CHANNEL_KEYS, '[]'), _defineProperty(_DEFAULTS, USER_ATTR_DEFAULT_PUBLISHING_VIEW, '{}'), _defineProperty(_DEFAULTS, USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN, null), _defineProperty(_DEFAULTS, USER_ATTR_DEFAULT_PUBLISH_NOW, 'false'), _defineProperty(_DEFAULTS, USER_ATTR_MANAGE_COLUMNS, JSON.stringify(DEFAULT_SAVED_COLUMNS)), _defineProperty(_DEFAULTS, USER_ATTR_FAILED_POST_BANNER_DISMISSAL_TIME, null), _DEFAULTS);

var UserAttributes = /*#__PURE__*/function (_Record) {
  _inherits(UserAttributes, _Record);

  function UserAttributes() {
    _classCallCheck(this, UserAttributes);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserAttributes).apply(this, arguments));
  }

  _createClass(UserAttributes, null, [{
    key: "createFrom",
    value: function createFrom(data) {
      var attributes = fromJS(data.attributes).toMap().mapEntries(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            v = _ref2[1];

        return [v.get('key'), v.get('value')];
      });
      return new UserAttributes(attributes);
    }
  }]);

  return UserAttributes;
}(Record(DEFAULTS));

export { UserAttributes as default };
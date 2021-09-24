'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { getUserAttributes, setUserAttribute as _setUserAttribute } from '../api/UserAttributes';
import { ATTRIBUTE_KEY } from '../constants/userAttributes';

var UserAttributesManager = /*#__PURE__*/function () {
  function UserAttributesManager(userId) {
    _classCallCheck(this, UserAttributesManager);

    this.userId = userId;
  }

  _createClass(UserAttributesManager, [{
    key: "getAttributeValue",
    value: function getAttributeValue(attributeName) {
      return UserAttributesManager.getAttributes().then(function (attributes) {
        return attributes[attributeName];
      });
    }
  }, {
    key: "setUserAttribute",
    value: function setUserAttribute(keyValue) {
      return _setUserAttribute(this.userId, Object.assign({}, UserAttributesManager.attributes, {}, keyValue)).then(function (attributes) {
        UserAttributesManager.attributes = attributes;
        return attributes;
      });
    }
  }], [{
    key: "getAttributes",
    value: function getAttributes() {
      if (UserAttributesManager.attributes) {
        return Promise.resolve(UserAttributesManager.attributes);
      }

      return getUserAttributes(this.userId).then(function (data) {
        var attributes = data.attributes;
        var matchedAttribute = attributes.find(function (attributes) {
          return attributes.key === ATTRIBUTE_KEY;
        });
        UserAttributesManager.attributes = matchedAttribute ? JSON.parse(matchedAttribute.value) : {};

        try {
          return UserAttributesManager.attributes;
        } catch (error) {
          return null;
        }
      });
    }
  }]);

  return UserAttributesManager;
}();

export default UserAttributesManager;
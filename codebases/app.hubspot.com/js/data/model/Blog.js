'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record } from 'immutable';
import I18n from 'I18n';
var DEFAULTS = {
  id: null,
  name: null,
  rssUrl: null,
  language: null
};

var Blog = /*#__PURE__*/function (_Record) {
  _inherits(Blog, _Record);

  function Blog() {
    _classCallCheck(this, Blog);

    return _possibleConstructorReturn(this, _getPrototypeOf(Blog).apply(this, arguments));
  }

  _createClass(Blog, [{
    key: "toOption",
    value: function toOption(isAvailable) {
      return {
        text: "" + this.name + (this.language ? " (" + I18n.text("SharedI18nStrings.languageNames." + this.language) + ")" : ''),
        value: this.id,
        disabled: isAvailable
      };
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      return new Blog(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      return List(data.objects.map(function (attrs) {
        attrs.rssUrl = attrs.rootUrl + "/rss.xml";
        return Blog.createFrom(attrs);
      })).sortBy(function (b) {
        return b.name;
      });
    }
  }]);

  return Blog;
}(Record(DEFAULTS));

export { Blog as default };
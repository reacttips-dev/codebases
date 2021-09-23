'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { CONTENT_TYPE } from '../../lib/constants';
var DEFAULTS = {
  id: null,
  name: null,
  htmlTitle: null,
  campaignGuid: null,
  state: null,
  absoluteUrl: null,
  publishDate: null,
  categoryId: null
};
var CATEGORY_TO_REMOTE_CONTENT_TYPE = {
  1: CONTENT_TYPE.coslp,
  3: CONTENT_TYPE.cosblog
};

var COSContent = /*#__PURE__*/function (_Record) {
  _inherits(COSContent, _Record);

  function COSContent() {
    _classCallCheck(this, COSContent);

    return _possibleConstructorReturn(this, _getPrototypeOf(COSContent).apply(this, arguments));
  }

  _createClass(COSContent, [{
    key: "toOption",
    value: function toOption() {
      var data = this.toJS();
      data.value = data.id;
      data.text = data.name;
      return data;
    }
  }, {
    key: "getRemoteContentType",
    value: function getRemoteContentType() {
      return CATEGORY_TO_REMOTE_CONTENT_TYPE[this.get('categoryId')];
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      return new COSContent(attrs);
    }
  }]);

  return COSContent;
}(Record(DEFAULTS));

export { COSContent as default };
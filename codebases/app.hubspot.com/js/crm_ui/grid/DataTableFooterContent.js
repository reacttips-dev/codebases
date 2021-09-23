'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { getGridFilterMessage } from './filterMessageHelpers';
import { getIsSampleContact } from '../utils/SampleContactUtils';
import { PureComponent } from 'react';

var hasRealContacts = function hasRealContacts(data) {
  if (!data) {
    return false;
  }

  return data.map(function (_ref) {
    var properties = _ref.properties;
    return properties.getIn(['email', 'value']);
  }).map(getIsSampleContact).reduce(function (dataHasRealContact, isSampleEmail) {
    return dataHasRealContact || !isSampleEmail;
  }, false);
};

var DataTableFooterContent = /*#__PURE__*/function (_PureComponent) {
  _inherits(DataTableFooterContent, _PureComponent);

  function DataTableFooterContent() {
    _classCallCheck(this, DataTableFooterContent);

    return _possibleConstructorReturn(this, _getPrototypeOf(DataTableFooterContent).apply(this, arguments));
  }

  _createClass(DataTableFooterContent, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          data = _this$props.data,
          hasFilters = _this$props.hasFilters,
          objectType = _this$props.objectType,
          searchQuery = _this$props.searchQuery,
          totalResults = _this$props.totalResults,
          viewId = _this$props.viewId;

      if (objectType === CONTACT && totalResults <= 5 && !hasRealContacts(data)) {
        var FilterMessage = getGridFilterMessage({
          hasFilters: hasFilters,
          objectType: objectType,
          searchQuery: searchQuery,
          viewId: viewId
        });

        if (FilterMessage) {
          return FilterMessage;
        }
      }

      return null;
    }
  }]);

  return DataTableFooterContent;
}(PureComponent);

export { DataTableFooterContent as default };
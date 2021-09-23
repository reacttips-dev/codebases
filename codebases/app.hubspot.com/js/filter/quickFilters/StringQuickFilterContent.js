'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState, useEffect } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import Equal from 'customer-data-filters/filterQueryFormat/operator/Equal';
import { EQUAL } from 'customer-data-filters/converters/contactSearch/FilterContactSearchOperatorTypes';
import I18n from 'I18n';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UITag from 'UIComponents/tag/UITag';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UISearchInput from 'UIComponents/input/UISearchInput';
export var isSupported = function isSupported(filter) {
  return Boolean(filter && filter.get('operator') === EQUAL);
};
export var getValueForSelect = function getValueForSelect(filter) {
  var stringValue = filter ? filter.get('value') : '';
  return stringValue ? stringValue.split(' OR ') : [];
};
export var makeFilterValue = function makeFilterValue(value) {
  return value.join(' OR ');
};
export var getFilter = function getFilter(property, values) {
  return Equal.of(property, values ? makeFilterValue(values) : undefined);
};

var StringQuickFilterContent = function StringQuickFilterContent(_ref) {
  var unsafeFilter = _ref.filter,
      property = _ref.property,
      onValueChange = _ref.onValueChange;

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      inputValue = _useState2[0],
      setInputValue = _useState2[1];

  var _useState3 = useState(getFilter(property)),
      _useState4 = _slicedToArray(_useState3, 2),
      filter = _useState4[0],
      setFilter = _useState4[1];

  var tags = getValueForSelect(filter);
  useEffect(function () {
    if (isSupported(unsafeFilter)) {
      setFilter(unsafeFilter);
    } else {
      setFilter(getFilter(property));
    }
  }, [unsafeFilter, property, onValueChange]);
  var addTag = useCallback(function () {
    if (inputValue && !tags.includes(inputValue)) {
      setInputValue('');
      onValueChange(property.name, getFilter(property, [].concat(_toConsumableArray(tags), [inputValue])));
    }
  }, [inputValue, tags, property, setInputValue, onValueChange]);
  var removeTag = useCallback(function (index) {
    // Splice does not return a new reference, so we have to clone the array first
    var updatedTags = _toConsumableArray(tags);

    updatedTags.splice(index, 1);
    onValueChange(property.name, updatedTags.length ? getFilter(property, updatedTags) : undefined);
  }, [tags, property, onValueChange]);
  return /*#__PURE__*/_jsxs("div", {
    className: "m-bottom-5",
    children: [/*#__PURE__*/_jsx(UIFormLabel, {
      className: "width-100 text-right p-all-0 p-bottom-1",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.quickFilters.string.enterToAdd"
      })
    }), /*#__PURE__*/_jsx(UIFormControl, {
      className: "m-bottom-4",
      children: /*#__PURE__*/_jsx(UISearchInput, {
        "data-test-id": "quick-filter-string-input",
        autoFocus: true,
        icon: false,
        clearable: true,
        value: inputValue,
        placeholder: I18n.text('indexPage.quickFilters.string.typeValue'),
        onChange: function onChange(_ref2) {
          var value = _ref2.target.value;
          return setInputValue(value);
        },
        onKeyDown: function onKeyDown(_ref3) {
          var key = _ref3.key;

          if (key === 'Enter') {
            addTag(inputValue);
          }
        }
      })
    }), tags.map(function (tag, index) {
      return /*#__PURE__*/_jsx(UITag, {
        "data-test-id": "string-filter-tag-" + tag,
        closeable: true,
        onCloseClick: function onCloseClick() {
          return removeTag(index);
        },
        children: /*#__PURE__*/_jsx(UITruncateString, {
          maxWidth: 90,
          children: tag
        })
      }, index);
    })]
  });
};

export default StringQuickFilterContent;
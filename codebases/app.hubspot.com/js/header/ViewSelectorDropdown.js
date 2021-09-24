'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UISelect from 'UIComponents/input/UISelect';
import UIList from 'UIComponents/list/UIList';
import UITruncateString from 'UIComponents/text/UITruncateString';
import { useViewsAsOptions } from '../views/hooks/useViewsByType';

var SelectedValueRenderer = function SelectedValueRenderer(_ref) {
  var children = _ref.children,
      option = _ref.option;
  return /*#__PURE__*/_jsx(UITruncateString, {
    tooltip: option.text,
    children: children
  });
};

var ViewSelectorDropdown = function ViewSelectorDropdown(_ref2) {
  var objectType = _ref2.objectType,
      viewId = _ref2.viewId,
      onChangeView = _ref2.onChangeView,
      onCreateView = _ref2.onCreateView,
      onOpenViewSelectorPage = _ref2.onOpenViewSelectorPage;
  var options = useViewsAsOptions(objectType);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var handleChange = useCallback(function (evt) {
    onChangeView(evt.target.value);
    CrmLogger.log('openSavedView', {
      action: 'from view dropdown'
    });
  }, [onChangeView]);
  return /*#__PURE__*/_jsx(UISelect, {
    buttonUse: "tertiary-light",
    buttonSize: "small",
    className: "p-left-2",
    "data-selenium-test": "viewSelector",
    onOpenChange: function onOpenChange(evt) {
      setIsOpen(evt.target.value);
    },
    open: isOpen,
    dropdownFooter: /*#__PURE__*/_jsxs(UIList, {
      direction: 'column',
      childClassName: "m-bottom-2",
      lastChildClassName: "",
      children: [/*#__PURE__*/_jsx(UIButton, {
        onClick: function onClick() {
          onCreateView();
          setIsOpen(false);
        },
        use: "link",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.addViewTab.createView"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        "data-selenium-test": "allViewsLink",
        onClick: function onClick() {
          onOpenViewSelectorPage();
          setIsOpen(false);
        },
        use: "link",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.tabs.allViews"
        })
      })]
    }),
    menuWidth: 400,
    valueComponent: SelectedValueRenderer,
    onChange: handleChange,
    options: options,
    placeholder: I18n.text('indexPage.addViewTab.searchPlaceholder'),
    value: viewId
  });
};

ViewSelectorDropdown.propTypes = {
  objectType: AnyCrmObjectTypePropType,
  onChangeView: PropTypes.func.isRequired,
  onCreateView: PropTypes.func.isRequired,
  onOpenViewSelectorPage: PropTypes.func.isRequired,
  viewId: PropTypes.string.isRequired
};
export default ViewSelectorDropdown;
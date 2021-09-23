'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback } from 'react';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIButton from 'UIComponents/button/UIButton';
import { useViewsAsOptions } from '../../views/hooks/useViewsByType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropTypes from 'prop-types';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import virtualizedMenuRenderer from 'UIComponents/input/utils/virtualizedMenuRenderer';
import UISelect from 'UIComponents/input/UISelect';
export var StyledTypeaheadFooter = styled('div').withConfig({
  displayName: "AddViewTab__StyledTypeaheadFooter",
  componentId: "sc-1ki8mxz-0"
})(["border-top:1px solid ", ";padding:16px 20px;"], BATTLESHIP);

var addViewTabButton = function addViewTabButton() {
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIIcon, {
      name: "add"
    }), /*#__PURE__*/_jsx(FormattedMessage, {
      className: "m-left-2",
      message: "indexPage.addViewTab.addView"
    })]
  });
};

var AddViewTab = function AddViewTab(_ref) {
  var currentViewId = _ref.currentViewId,
      objectType = _ref.objectType,
      onCreateView = _ref.onCreateView,
      handleChangeView = _ref.handleChangeView;
  var options = useViewsAsOptions(objectType, {});
  var handleViewAdded = useCallback(function (evt) {
    handleChangeView(evt);
  }, [handleChangeView]);
  var handleCreateView = useCallback(function () {
    onCreateView();
  }, [onCreateView]);
  return /*#__PURE__*/_jsx(UISelect, {
    className: "m-left-2",
    caretRenderer: null,
    placement: "bottom right",
    menuWidth: 300,
    anchorType: "button",
    buttonUse: "transparent",
    ButtonContent: addViewTabButton,
    menuRenderer: virtualizedMenuRenderer,
    value: currentViewId,
    options: options,
    onChange: handleViewAdded,
    minimumSearchCount: 0,
    dropdownFooter: /*#__PURE__*/_jsx(UIButton, {
      onClick: handleCreateView,
      use: "link",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.addViewTab.createView"
      })
    })
  });
};

AddViewTab.propTypes = {
  objectType: AnyCrmObjectTypePropType,
  currentViewId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCreateView: PropTypes.func.isRequired,
  handleChangeView: PropTypes.func.isRequired
};
export default AddViewTab;
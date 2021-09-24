'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { CALYPSO_LIGHT } from 'HubStyleTokens/colors';
import { TABLE_BORDER_COLOR } from 'HubStyleTokens/theme';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import isNumber from 'transmute/isNumber';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { memo } from 'react';
import Small from 'UIComponents/elements/Small';
import UIButton from 'UIComponents/button/UIButton';
import styled from 'styled-components';
var StyledTr = styled.tr.withConfig({
  displayName: "SelectAllTr__StyledTr",
  componentId: "sc-1s33aia-0"
})(["background-color:", ";border-bottom:", " 1px solid !important;border-top:", " 1px solid !important;width:100%;td{border:none !important;}"], CALYPSO_LIGHT, TABLE_BORDER_COLOR, TABLE_BORDER_COLOR);
var AlignmentDiv = styled.div.withConfig({
  displayName: "SelectAllTr__AlignmentDiv",
  componentId: "sc-1s33aia-1"
})(["padding-left:8px;padding-right:8px;text-align:center;width:1100px;"]);

var getTranslatedType = function getTranslatedType(objectType) {
  var effectiveType = objectType;

  if (isObjectTypeId(objectType)) {
    effectiveType = 'items';
  }

  return I18n.text("customerDataTable.genericTypes." + effectiveType);
};

export var SelectAllTr = function SelectAllTr(props) {
  var maxItemsToBeSelected = props.maxItemsToBeSelected,
      itemsSelected = props.itemsSelected,
      onClickSelectAll = props.onClickSelectAll,
      onClickDeselectAll = props.onClickDeselectAll,
      colSpan = props.colSpan,
      _props$objectType = props.objectType,
      objectType = _props$objectType === void 0 ? 'items' : _props$objectType,
      totalResults = props.totalResults,
      allSelected = props.allSelected;
  var areMoreThanMaxSelected = isNumber(maxItemsToBeSelected) && maxItemsToBeSelected < totalResults;
  return /*#__PURE__*/_jsx(StyledTr, {
    "data-selenium-test": "data-table-selection-banner",
    children: /*#__PURE__*/_jsx("td", {
      colSpan: colSpan,
      children: /*#__PURE__*/_jsxs(AlignmentDiv, {
        className: "p-y-2",
        children: [!allSelected && /*#__PURE__*/_jsxs(Small, {
          children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataTable.selection.viewCount",
            options: {
              count: itemsSelected,
              type: getTranslatedType(objectType)
            },
            useGap: true
          }), totalResults !== itemsSelected && /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "data-table-select-all-button",
            onClick: onClickSelectAll,
            size: "small",
            use: "link",
            children: areMoreThanMaxSelected ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "customerDataTable.selection.selectFirstN",
              options: {
                count: maxItemsToBeSelected,
                type: getTranslatedType(objectType)
              }
            }) : /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "customerDataTable.selection.selectAll",
              options: {
                count: totalResults,
                type: getTranslatedType(objectType)
              }
            })
          })]
        }), allSelected && /*#__PURE__*/_jsxs(Small, {
          children: [areMoreThanMaxSelected ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataTable.selection.firstNSelected",
            options: {
              count: maxItemsToBeSelected,
              type: getTranslatedType(objectType)
            },
            useGap: true
          }) : /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataTable.selection.count",
            options: {
              count: totalResults,
              type: getTranslatedType(objectType)
            },
            useGap: true
          }), /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "data-table-clear-all-selected-button",
            onClick: onClickDeselectAll,
            size: "small",
            use: "link",
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "customerDataTable.selection.clear"
            })
          })]
        })]
      })
    })
  });
};
SelectAllTr.propTypes = {
  allSelected: PropTypes.bool,
  colSpan: PropTypes.number,
  itemsSelected: PropTypes.number,
  maxItemsToBeSelected: PropTypes.number,
  objectType: PropTypes.string,
  onClickDeselectAll: PropTypes.func.isRequired,
  onClickSelectAll: PropTypes.func.isRequired,
  totalResults: PropTypes.number
};
export default /*#__PURE__*/memo(SelectAllTr);
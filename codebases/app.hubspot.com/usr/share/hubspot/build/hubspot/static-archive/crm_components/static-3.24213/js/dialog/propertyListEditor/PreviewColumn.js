'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _initialCreatorProper;

import PreviewRow from 'crm_components/dialog/propertyListEditor/PreviewRow';
import { OptionType } from 'UIComponents/types/OptionTypes';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { COLUMN_SETTINGS, FAVORITE_PROPERTIES, CREATOR_PROPERTIES, DEAL_STAGE_PROPERTIES, TICKET_STAGE_PROPERTIES } from 'customer-data-objects/property/PropertyListTypes';
import Small from 'UIComponents/elements/Small';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import pluck from 'transmute/pluck';
import without from 'transmute/without';
import pick from 'transmute/pick';
import merge from 'transmute/merge';
import styled from 'styled-components';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
var getPassedProps = pick(['type', 'use', 'value', 'onRequiredChange', 'onAddOption', 'onSave', 'onReorderOption', 'onRemoveOption', 'onReset', 'requirable']);
var StyledWithBorder = styled.div.withConfig({
  displayName: "PreviewColumn__StyledWithBorder",
  componentId: "wdcvp3-0"
})(["border-bottom:1px solid ", ";"], BATTLESHIP);
var initialCreatorPropertiesToCheck = (_initialCreatorProper = {}, _defineProperty(_initialCreatorProper, ObjectTypes.COMPANY, ['domain', 'name']), _defineProperty(_initialCreatorProper, ObjectTypes.CONTACT, ['email', 'firstname', 'lastname']), _defineProperty(_initialCreatorProper, ObjectTypes.DEAL, []), _defineProperty(_initialCreatorProper, ObjectTypes.TICKET, []), _initialCreatorProper);

var scrollIntoViewIfNeeded = function scrollIntoViewIfNeeded(node) {
  if (typeof node.scrollIntoViewIfNeeded === 'function') {
    node.scrollIntoViewIfNeeded();
  } else {
    node.scrollIntoView();
  }
};

var PreviewColumn = createReactClass({
  displayName: 'PreviewColumn',
  propTypes: {
    initialCreatorProperties: PropTypes.arrayOf(OptionType.isRequired),
    rows: PropTypes.arrayOf(OptionType.isRequired).isRequired,
    onAddOption: PropTypes.func.isRequired,
    onRemoveOption: PropTypes.func.isRequired,
    onReorderOption: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    requirable: PropTypes.bool.isRequired,
    requirableMessage: PropTypes.node,
    type: PropTypes.string,
    use: PropTypes.oneOf([COLUMN_SETTINGS, FAVORITE_PROPERTIES, CREATOR_PROPERTIES, DEAL_STAGE_PROPERTIES, TICKET_STAGE_PROPERTIES]).isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      initialCreatorProperties: []
    };
  },
  componentDidUpdate: function componentDidUpdate(previousProps) {
    var contextNode = this.getContextualNode(previousProps.rows);

    if (contextNode != null) {
      scrollIntoViewIfNeeded(contextNode);
    }
  },
  getContextualNode: function getContextualNode(previousRows) {
    var rows = this.props.rows;

    if (!(rows.length > previousRows.length)) {
      return null;
    }

    var differenceVals = pluck('value', without(previousRows, rows));

    var _differenceVals$slice = differenceVals.slice(-1),
        _differenceVals$slice2 = _slicedToArray(_differenceVals$slice, 1),
        newElementRef = _differenceVals$slice2[0]; // eslint-disable-next-line react/no-find-dom-node


    return findDOMNode(this.refs[newElementRef]);
  },
  shouldRenderDescription: function shouldRenderDescription(properties) {
    var type = this.props.type;
    return initialCreatorPropertiesToCheck[type].length && !properties.find(function (property) {
      return initialCreatorPropertiesToCheck[type].includes(property.value) && property.required === true;
    });
  },
  renderInitialCreatorPropertiesDescription: function renderInitialCreatorPropertiesDescription(properties) {
    var type = this.props.type;

    if (!this.shouldRenderDescription(properties)) {
      return null;
    }

    return /*#__PURE__*/_jsx(Small, {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "crm_components.PropertyListEditor.defaultRequiredProperties." + type
      })
    });
  },
  renderInitialCreatorPropertiesSection: function renderInitialCreatorPropertiesSection() {
    var initialCreatorProperties = this.props.initialCreatorProperties;
    var passedProps = getPassedProps(this.props);
    return /*#__PURE__*/_jsxs(StyledWithBorder, {
      className: "m-bottom-5 p-bottom-2",
      children: [initialCreatorProperties.map(function (row, index) {
        var itemProps = merge(passedProps, {
          index: index,
          value: row
        });
        return /*#__PURE__*/_jsx(PreviewRow, Object.assign({}, itemProps), row.value);
      }), this.renderInitialCreatorPropertiesDescription(initialCreatorProperties)]
    });
  },
  render: function render() {
    var _this$props = this.props,
        initialCreatorProperties = _this$props.initialCreatorProperties,
        requirableMessage = _this$props.requirableMessage;
    var passedProps = getPassedProps(this.props);
    var initialCreatorPropertiesSection = null;

    if (this.props.use === CREATOR_PROPERTIES && initialCreatorProperties.length) {
      initialCreatorPropertiesSection = this.renderInitialCreatorPropertiesSection();
    }

    return /*#__PURE__*/_jsxs("div", {
      className: "p-right-3",
      children: [initialCreatorPropertiesSection, requirableMessage, this.props.rows.map(function (row, index) {
        index = index + initialCreatorProperties.length;
        var itemProps = merge(passedProps, {
          index: index,
          value: row
        });
        return /*#__PURE__*/_jsx(PreviewRow, Object.assign({}, itemProps), row.value);
      })]
    });
  }
});
export default PreviewColumn;
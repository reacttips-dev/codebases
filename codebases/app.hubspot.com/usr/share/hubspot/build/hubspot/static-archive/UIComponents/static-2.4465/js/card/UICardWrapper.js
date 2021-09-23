'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { OLAF, PANTERA } from 'HubStyleTokens/colors';
import { CARD_TRANSITION_ANIMATION_TIMING } from 'HubStyleTokens/times';
import PropTypes from 'prop-types';
import { isValidElement, cloneElement, Children, forwardRef } from 'react';
import devLogger from 'react-utils/devLogger';
import styled from 'styled-components';
import { CardContextProvider, compactCardContext, defaultCardContext } from '../context/CardContext';
import { rgba } from '../core/Color';
import Controllable from '../decorators/Controllable';
import UIDragHandle from '../draggable/UIDragHandle';
import UISection from '../section/UISection';
import AccordionTransition from '../transitions/AccordionTransition';
import { setBorderRadius } from '../utils/Styles';
import UICardHeader from './UICardHeader';
import UICardSection from './UICardSection';
var TRANSITION_ANIMATION_TIMEOUT = parseInt(CARD_TRANSITION_ANIMATION_TIMING, 10);
var Outer = styled(UISection).withConfig({
  displayName: "UICardWrapper__Outer",
  componentId: "sc-6acmli-0"
})(["position:relative;display:flex;flex-direction:column;width:100%;padding:0;background-color:", ";box-shadow:0 1px 5px 0 ", ";", ";"], OLAF, rgba(PANTERA, 0.12), setBorderRadius());

var isDraggable = function isDraggable(child) {
  return child.type.displayName === UIDragHandle.displayName;
};

var isExpander = function isExpander(child) {
  var possibleHeader = child;

  if ( /*#__PURE__*/isValidElement(child) && isDraggable(child)) {
    possibleHeader = child.props.children;
  }

  return /*#__PURE__*/isValidElement(possibleHeader) && possibleHeader.type === UICardHeader;
};

var isSection = function isSection(child) {
  return /*#__PURE__*/isValidElement(child) && child.type === UICardSection;
};

var renderExpandableChildren = function renderExpandableChildren(children, expanded, onExpandedChange) {
  var sawHeader = false;
  var output = Children.map(children, function (child) {
    if (isExpander(child)) {
      sawHeader = true;
      return /*#__PURE__*/cloneElement(child, {
        expanded: expanded,
        onExpandedChange: onExpandedChange
      });
    }

    if (isSection(child)) {
      return /*#__PURE__*/_jsx(AccordionTransition, {
        className: "private-card__content-wrapper",
        open: expanded,
        duration: TRANSITION_ANIMATION_TIMEOUT,
        children: child
      });
    }

    return child;
  });

  if (process.env.NODE_ENV !== 'production') {
    if (!sawHeader) {
      var msg = 'UICardWrapper: Expandable behavior requires a UICardHeader child';
      devLogger.warn({
        message: msg,
        key: msg
      });
    }
  }

  return output;
};

var UICardWrapper = /*#__PURE__*/forwardRef(function (props, ref) {
  var children = props.children,
      className = props.className,
      compact = props.compact,
      expandable = props.expandable,
      expanded = props.expanded,
      onExpandedChange = props.onExpandedChange,
      rest = _objectWithoutProperties(props, ["children", "className", "compact", "expandable", "expanded", "onExpandedChange"]);

  return /*#__PURE__*/_jsx(Outer, Object.assign({}, rest, {
    className: classNames("private-card private-card__wrapper", className, compact && 'private-card--compact'),
    ref: ref,
    children: /*#__PURE__*/_jsx(CardContextProvider, {
      value: compact ? compactCardContext : defaultCardContext,
      children: expandable ? renderExpandableChildren(children, expanded, onExpandedChange) : children
    })
  }));
});
UICardWrapper.propTypes = Object.assign({}, UISection.propTypes, {
  children: PropTypes.node.isRequired,
  compact: PropTypes.bool.isRequired,
  expanded: PropTypes.bool,
  expandable: PropTypes.bool,
  onExpandedChange: PropTypes.func
});
UICardWrapper.defaultProps = Object.assign({}, UISection.defaultProps, {
  compact: false,
  expandable: false,
  expanded: true
});
UICardWrapper.displayName = 'UICardWrapper';
export default Controllable(UICardWrapper, ['expanded']);
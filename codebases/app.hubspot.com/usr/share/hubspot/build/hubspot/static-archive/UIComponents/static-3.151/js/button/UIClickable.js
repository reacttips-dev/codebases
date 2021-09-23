'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import '../listeners/focusStylesListener';
import classNames from 'classnames'; // These should be removed once we have 100% adoption of UIApplication

import PropTypes from 'prop-types';
import { useEffect } from 'react';
import styled from 'styled-components';
import ShareButton from '../decorators/ShareButton';
import { setupStyledComponents } from '../listeners/setupStyledComponents';
import refObject from '../utils/propTypes/refObject';
import { getTabIndex } from '../utils/TabIndex';
setupStyledComponents();

var UIClickableCore = function UIClickableCore(props) {
  var autoFocus = props.autoFocus,
      buttonRef = props.buttonRef,
      className = props.className,
      __cursor = props.cursor,
      disabled = props.disabled,
      onClick = props.onClick,
      onKeyDown = props.onKeyDown,
      tabIndex = props.tabIndex,
      Tag = props.tagName,
      rest = _objectWithoutProperties(props, ["autoFocus", "buttonRef", "className", "cursor", "disabled", "onClick", "onKeyDown", "tabIndex", "tagName"]);

  useEffect(function () {
    if (autoFocus) buttonRef.current.focus();
  }, [autoFocus, buttonRef]);

  var handleKeyDown = function handleKeyDown(evt) {
    var key = evt.key,
        target = evt.target;
    if (onKeyDown) onKeyDown(evt); // Ignore keydown events that bubbled up

    if (target !== buttonRef.current) return; // Simulate click on Enter/Spacebar, to emulate button behavior

    if (key === 'Enter' || key === ' ') {
      if (disabled) {
        evt.preventDefault();
        evt.stopPropagation();
        return;
      }

      if (onClick) onClick(evt);

      if (key === ' ') {
        evt.preventDefault(); // Prevent page from scrolling (#3575)
      }
    }
  };

  var handleClick = function handleClick(evt) {
    if (disabled) {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }

    if (onClick) onClick(evt);
  };

  return /*#__PURE__*/_jsx(Tag, Object.assign({}, rest, {
    "aria-disabled": disabled,
    className: classNames('private-clickable', className),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ref: buttonRef,
    tabIndex: getTabIndex(disabled, tabIndex, null)
  }));
};

UIClickableCore.displayName = 'UIClickable';
var UIClickable = styled(UIClickableCore).withConfig({
  displayName: "UIClickable",
  componentId: "n220r8-0"
})(["cursor:", ";"], function (_ref) {
  var cursor = _ref.cursor,
      disabled = _ref.disabled;
  return disabled ? 'not-allowed' : cursor;
});
UIClickable.displayName = 'Styled(UIClickable)';
UIClickable.propTypes = {
  autoFocus: PropTypes.bool,
  buttonRef: refObject,
  cursor: PropTypes.string,
  disabled: PropTypes.bool,
  tagName: PropTypes.string.isRequired
};
UIClickable.defaultProps = {
  cursor: 'pointer',
  role: 'button',
  tagName: 'div'
};
export default ShareButton(UIClickable);
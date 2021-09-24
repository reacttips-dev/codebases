'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import '../listeners/focusStylesListener';
import classNames from 'classnames';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Children, useEffect } from 'react';
import { LINK_USES, SIZE_CLASSES, USE_CLASSES } from '../button/ButtonConstants';
import ShareButton from '../decorators/ShareButton';
import useActive from '../hooks/useActive';
import UIIcon from '../icon/UIIcon';
import { setupStyledComponents } from '../listeners/setupStyledComponents';
import UITruncateString from '../text/UITruncateString';
import { getRel, getTarget, renderSecurityTaggedLink, warnIfShouldBeExternal } from '../utils/Links';
import { hidden } from '../utils/propTypes/decorators';
import refObject from '../utils/propTypes/refObject';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import validHref from '../utils/propTypes/validHref';
import { getTabIndex } from '../utils/TabIndex';
import { getSafeUrl } from '../utils/UnsafeUrl';
import UIClickable from './UIClickable';
setupStyledComponents();

var getUse = function getUse(use) {
  return use && USE_CLASSES[use] ? use : 'secondary';
};

var renderContents = function renderContents(children) {
  var stringBuffer = '';
  var nextChildIndex = 0;
  var childArr = Children.toArray(children);
  return Children.map(children, function (child) {
    nextChildIndex += 1;

    if (child == null) {
      return null;
    } // in response to a breaking change in React 0.15
    // (https://facebook.github.io/react/blog/2016/04/07/react-v15.html#no-more-extra-ltspangts)
    // this wraps any bare strings within a <span> to provide a more
    // predictable DOM for applying automatic spacing rules.


    if (typeof child === 'string') {
      stringBuffer += child;

      if (childArr.length < nextChildIndex || typeof childArr[nextChildIndex] !== 'string') {
        var wrappedStringBuffer = /*#__PURE__*/_jsx("span", {
          children: stringBuffer
        });

        stringBuffer = '';
        return wrappedStringBuffer;
      } else {
        return null;
      }
    }

    return child;
  });
};

var renderExternalButtonIcon = function renderExternalButtonIcon(external, iconProps) {
  if (!external) return null; // Opening links in a new window is an accessibility anti-pattern.
  // To mitigate this, we add accessible text in the icon to warn that
  // the link will be opened in a new window
  // @link http://diveintoaccessibility.info/day_16_not_opening_new_windows.html

  return /*#__PURE__*/_jsx(UIIcon, Object.assign({}, iconProps, {
    "aria-label": I18n.text('salesUI.UILink.externalTitle'),
    className: iconProps && iconProps.className || 'private-link--external__icon',
    name: "externalLink"
  }));
};

var renderTruncatedContents = function renderTruncatedContents(truncate, truncateStringProps, truncateTooltip, renderedContents, renderedExternalButtonIcon) {
  return truncate ? /*#__PURE__*/_jsx(UITruncateString, Object.assign({
    innerClassName: "private-button__truncate-string",
    useFlex: true,
    fixedChildren: renderedExternalButtonIcon,
    tooltip: truncateTooltip || renderedContents
  }, truncateStringProps, {
    children: /*#__PURE__*/_jsx("span", {
      children: renderedContents
    })
  })) : renderedContents;
};

var UIButton = function UIButton(props) {
  var _useNativeButton = props._useNativeButton,
      ariaPressed = props['aria-pressed'],
      __active = props.active,
      autoFocus = props.autoFocus,
      block = props.block,
      buttonRef = props.buttonRef,
      children = props.children,
      className = props.className,
      disabled = props.disabled,
      external = props.external,
      href = props.href,
      iconProps = props.iconProps,
      onClick = props.onClick,
      rel = props.rel,
      responsive = props.responsive,
      size = props.size,
      tabIndex = props.tabIndex,
      target = props.target,
      truncate = props.truncate,
      truncateStringProps = props.truncateStringProps,
      truncateTooltip = props.truncateTooltip,
      type = props.type,
      use = props.use,
      rest = _objectWithoutProperties(props, ["_useNativeButton", "aria-pressed", "active", "autoFocus", "block", "buttonRef", "children", "className", "disabled", "external", "href", "iconProps", "onClick", "rel", "responsive", "size", "tabIndex", "target", "truncate", "truncateStringProps", "truncateTooltip", "type", "use"]);

  var _useActive = useActive(props),
      active = _useActive.active,
      onMouseDown = _useActive.onMouseDown,
      onKeyDown = _useActive.onKeyDown,
      onKeyUp = _useActive.onKeyUp,
      onBlur = _useActive.onBlur;

  useEffect(function () {
    // Simulate autoFocus when rendering a link element
    if (autoFocus && href) {
      buttonRef.current.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  var handleClick = function handleClick(evt) {
    // Block click events while disabled, since we don't actually use [disabled] in the DOM.
    if (disabled) {
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      if (onClick) onClick(evt);
    }
  };

  var handleKeyDown = function handleKeyDown(evt) {
    if (onKeyDown) onKeyDown(evt); // Ignore keydown events that bubbled up

    if (evt.target !== buttonRef.current) return; // If this is an <a> with a click handler, simulate click on Spacebar to be more button-like

    if (onClick && href) {
      if (evt.key === ' ') {
        // Prevent scrolling
        evt.preventDefault();

        if (disabled) {
          evt.stopPropagation();
        } else {
          onClick(evt);
        }
      }
    }
  };

  var shorthandSize = toShorthandSize(size);
  var computedTabIndex = getTabIndex(disabled, tabIndex);
  var computedTarget = getTarget(external, target);
  var computedUse = getUse(use);

  if (process.env.NODE_ENV !== 'production') {
    warnIfShouldBeExternal(external, computedTarget, 'UIButton');
  }

  var renderedContents = renderContents(children);
  var renderedExternalButtonIcon = renderExternalButtonIcon(external, iconProps);
  var wrappedContents = renderTruncatedContents(truncate, truncateStringProps, truncateTooltip, renderedContents, renderedExternalButtonIcon);
  var unstyled = computedUse === 'unstyled';
  var computedClassName = unstyled ? classNames(className, USE_CLASSES[computedUse]) : classNames('uiButton private-button', USE_CLASSES[computedUse], SIZE_CLASSES[shorthandSize] || SIZE_CLASSES.default, className, active && 'private-button--active', block && 'private-button--block', disabled && 'disabled private-button--disabled', !responsive && 'private-button--non-responsive', LINK_USES.indexOf(computedUse) === -1 && 'private-button--non-link');
  var commonProps = Object.assign({}, rest, {
    'aria-disabled': disabled,
    className: computedClassName,
    'data-button-use': computedUse,
    onBlur: onBlur,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: onKeyUp,
    onMouseDown: onMouseDown,
    ref: buttonRef,
    tabIndex: computedTabIndex
  });

  if (href) {
    var computedRel = getRel(rel, computedTarget);
    return renderSecurityTaggedLink(href, /*#__PURE__*/_jsxs("a", Object.assign({}, commonProps, {
      href: getSafeUrl(href),
      rel: computedRel,
      target: computedTarget,
      children: [wrappedContents, truncate || renderedExternalButtonIcon]
    })));
  }

  var ButtonComponent = _useNativeButton ? 'button' : UIClickable;

  if (!_useNativeButton) {
    // Pass buttonRef down directly to the UIClickable
    commonProps.buttonRef = buttonRef;
    delete commonProps.ref;
  }

  return /*#__PURE__*/_jsx(ButtonComponent, Object.assign({}, commonProps, {
    type: type,
    "aria-pressed": ariaPressed != null ? ariaPressed : active || undefined,
    autoFocus: autoFocus,
    disabled: _useNativeButton ? undefined : disabled,
    onKeyDown: onKeyDown,
    children: wrappedContents
  }));
};

UIButton.propTypes = {
  /**
   * When set to `false`, renders a `UIClickable` component instead of the default `<button />` HTML element
   */
  _useNativeButton: PropTypes.bool,

  /**
   * Sets the visual style of the button to match what the button looks like when selected. Used only for visual regression testing purposes.
   */
  active: hidden(PropTypes.bool),

  /**
   * Sets the component to have focus on component mount
   */
  autoFocus: PropTypes.bool,

  /**
   * Indicates to assistive technologies that the button is a toggle button and specifies its current "pressed" state
   */
  'aria-pressed': PropTypes.bool,

  /**
   * Sets the button's width to fill 100% of its parent container
   */
  block: PropTypes.bool,

  /**
   * Ref that is passed down to the underlying UIClickable component
   */
  buttonRef: refObject,

  /**
   * Sets the content that will render inside the component
   */
  children: PropTypes.node,

  /**
   * Sets the component to an inactive state
   */
  disabled: PropTypes.bool.isRequired,

  /**
   * Renders an external link icon when an href is also supplied to the component
   */
  external: PropTypes.bool.isRequired,

  /**
   * URL that is navigated to on an onClick event. (When a valid URL is supplied, a button is rendered with an underlying anchor link instead of a button element.)
   */
  href: validHref,

  /**
   * Provides props for the UIIcon rendered when external is true and a valid href is provided
   */
  iconProps: PropTypes.object,

  /**
   * Automatically determines the button's width will expand to 100% of its parent container when the browser window is 544px or less
   */
  responsive: PropTypes.bool.isRequired,

  /**
   * Specifies the relationship between the current page and the `href` prop. Requires a valid `href` to be provided.
    */
  rel: PropTypes.string,

  /**
   * Sets the size of the component
   */
  size: propTypeForSizes(['xs', 'sm', 'md'], ['default']),

  /**
   * When the button is rendered as a Link, this allows you to determine how the link will open. It is automatically set to "_blank" by default
   */
  target: PropTypes.string,

  /**
   * When set to `true`, the truncated text will appear in a tooltip as a user hovers over the button. Also enables showing the external link icon in the tooltip.
   */
  truncate: PropTypes.bool.isRequired,

  /**
   * Props passed through to the UITruncateString. Requires `truncate` to be set to `true` to work.
   */
  truncateStringProps: PropTypes.object,

  /**
   * Sets the content that will appear in the tooltip when `truncate` is `true`
   */
  truncateTooltip: PropTypes.node,

  /**
   * Sets the HTML attribute "role" of the button
   */
  type: PropTypes.oneOf(['button', 'reset', 'submit']).isRequired,

  /**
   * Sets the color variation of the button
   */
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)).isRequired
};
UIButton.defaultProps = {
  _useNativeButton: true,
  disabled: false,
  external: false,
  responsive: true,
  size: 'md',
  truncate: false,
  type: 'button',
  use: 'secondary'
};
UIButton.displayName = 'UIButton';
export default ShareButton(UIButton);
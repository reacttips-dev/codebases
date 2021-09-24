'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import { isPageInKeyboardMode } from '../listeners/focusStylesListener';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import { CALYPSO, GYPSUM, OLAF } from 'HubStyleTokens/colors';
import UIButton from '../button/UIButton';
import { callIfPossible } from '../core/Functions';
import Controllable from '../decorators/Controllable';
import SyntheticEvent from '../core/SyntheticEvent';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import { fontsLoaded, fontsLoadedPromise } from '../utils/Fonts';
import { hidden } from '../utils/propTypes/decorators';
import UIOverhang from '../scroll/UIOverhang';
import UIIcon from '../icon/UIIcon';
import memoizeOne from 'react-utils/memoizeOne';
import { requestSchedulerCallback, cancelSchedulerCallback } from '../utils/Timers';
var ExpandableTextOverhang = styled(UIOverhang).withConfig({
  displayName: "UIExpandableText__ExpandableTextOverhang",
  componentId: "sc-1goxbqd-0"
})(["", ";"], function (props) {
  return props.scrollable && "\n    /* Compensate for border on scroll container */\n    right: 1px;\n    bottom: 1px;\n    left: 1px;\n  ";
});
ExpandableTextOverhang.propTypes = Object.assign({}, UIOverhang.propTypes, {
  scrollable: PropTypes.bool.isRequired
});
ExpandableTextOverhang.defaultProps = UIOverhang.defaultProps;

var getStyle = function getStyle(computedMaxHeight) {
  return {
    maxHeight: computedMaxHeight
  };
}; // If a rems value exists, convert it to px and return it; otherwise, return the px value.


var pxValue = function pxValue(px, rems) {
  return rems != null ? rems * 16 : px;
};

var UIExpandableText = /*#__PURE__*/function (_Component) {
  _inherits(UIExpandableText, _Component);

  function UIExpandableText(props) {
    var _this;

    _classCallCheck(this, UIExpandableText);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIExpandableText).call(this, props));

    _this.delayedFitToMaxLines = function () {
      cancelSchedulerCallback(_this._timeout);
      _this._timeout = requestSchedulerCallback(_this.fitToMaxLines);
    };

    _this.fitToMaxLines = function () {
      if (!_this._el) return;
      var _this$props = _this.props,
          maxHeight = _this$props.maxHeight,
          maxHeightRems = _this$props.maxHeightRems;
      var _this$state = _this.state,
          collapsible = _this$state.collapsible,
          contentHeight = _this$state.contentHeight;
      var scrollHeight = _this._el.scrollHeight;

      if (contentHeight !== scrollHeight) {
        _this.setState({
          contentHeight: scrollHeight
        });
      }

      var contentOverflows = scrollHeight > pxValue(maxHeight, maxHeightRems);

      if (collapsible !== contentOverflows) {
        _this.setState({
          collapsible: contentOverflows
        });
      }
    };

    _this.handleExpandButtonClick = function (evt) {
      var _this$props2 = _this.props,
          onExpandButtonClick = _this$props2.onExpandButtonClick,
          onExpandedChange = _this$props2.onExpandedChange;
      callIfPossible(onExpandButtonClick, evt);
      onExpandedChange(SyntheticEvent(true));
    };

    _this.handleCollapseButtonClick = function (evt) {
      var _this$props3 = _this.props,
          onCollapseButtonClick = _this$props3.onCollapseButtonClick,
          onExpandedChange = _this$props3.onExpandedChange;
      callIfPossible(onCollapseButtonClick, evt); // Set explicit max-height (removed by handleTransitionEnd) for transition

      var textWrapperEl = _this._el;
      textWrapperEl.style.maxHeight = textWrapperEl.scrollHeight + "px";
      onExpandedChange(SyntheticEvent(false));
    };

    _this.handleTextWrapperFocus = function (evt) {
      var _this$props4 = _this.props,
          expandOnFocus = _this$props4.expandOnFocus,
          onExpandedChange = _this$props4.onExpandedChange,
          toggleable = _this$props4.toggleable;

      if (expandOnFocus && toggleable) {
        // Avoid expanding on focus if the user clicked a link or other extraneous element.
        if (!isPageInKeyboardMode() && !/TEXTAREA|INPUT/.test(evt.target.tagName)) return;
        onExpandedChange(SyntheticEvent(true));
      }
    };

    _this.handleTextWrapperTransitionEnd = function (evt) {
      // After the expand transition, remove max-height in case the content grows/shrinks
      var textWrapperEl = _this._el;

      if (evt.target === textWrapperEl && evt.propertyName === 'max-height') {
        var _this$state2 = _this.state,
            expanded = _this$state2.expanded,
            fullyExpanded = _this$state2.fullyExpanded;

        if (expanded && !fullyExpanded) {
          _this.setState({
            fullyExpanded: true
          });
        }
      }
    };

    _this.textWrapperRefCallback = function (ref) {
      _this._el = ref;
    };

    _this.state = {
      contentHeight: null,
      // How tall is the content?
      collapsible: false,
      // Does the content exceed our max height?
      fullyExpanded: false // Did the CSS transition from collapsed to expanded complete?

    };
    _this._getStyle = memoizeOne(getStyle);
    return _this;
  }

  _createClass(UIExpandableText, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.delayedFitToMaxLines();
      this.startMutationObserver();
      addEventListener('resize', this.delayedFitToMaxLines);
      if (this._el) this._el.addEventListener('load', this.delayedFitToMaxLines, true); // #5980: need to add this handler manually

      if (!fontsLoaded()) fontsLoadedPromise.then(this.delayedFitToMaxLines);
    }
  }, {
    key: "UNSAFE_componentWillUpdate",
    value: function UNSAFE_componentWillUpdate() {
      this.stopMutationObserver();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // ⚠️ This condition prevents infinite loops! ⚠️
      if (prevState.contentHeight === this.state.contentHeight && prevState.collapsible === this.state.collapsible) {
        this.delayedFitToMaxLines();
      }

      if (prevState.collapsible !== this.state.collapsible) {
        callIfPossible(this.props.onCollapsibleChange, this.state.collapsible);
      }

      this.startMutationObserver();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopMutationObserver();
      cancelSchedulerCallback(this._timeout);
      removeEventListener('resize', this.delayedFitToMaxLines);
      if (this._el) this._el.removeEventListener('load', this.delayedFitToMaxLines, true);
    }
  }, {
    key: "startMutationObserver",
    value: function startMutationObserver() {
      if (!this._el) return; // When the content changes, recalculate our size

      this._observer = new MutationObserver(this.delayedFitToMaxLines);

      this._observer.observe(this._el, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "stopMutationObserver",
    value: function stopMutationObserver() {
      if (this._observer) {
        this._observer.disconnect();

        this._observer = null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          buttonAlign = _this$props5.buttonAlign,
          children = _this$props5.children,
          className = _this$props5.className,
          collapseButtonText = _this$props5.collapseButtonText,
          expandButtonText = _this$props5.expandButtonText,
          expanded = _this$props5.expanded,
          fadeOutHeight = _this$props5.fadeOutHeight,
          fadeOutHeightRems = _this$props5.fadeOutHeightRems,
          gradientColor = _this$props5.gradientColor,
          hideButtonCaret = _this$props5.hideButtonCaret,
          maxHeight = _this$props5.maxHeight,
          maxHeightRems = _this$props5.maxHeightRems,
          onCollapseButtonClick = _this$props5.onCollapseButtonClick,
          onExpandButtonClick = _this$props5.onExpandButtonClick,
          Overhang = _this$props5.Overhang,
          scrollable = _this$props5.scrollable,
          toggleable = _this$props5.toggleable,
          use = _this$props5.use;
      var _this$state3 = this.state,
          collapsible = _this$state3.collapsible,
          contentHeight = _this$state3.contentHeight,
          fullyExpanded = _this$state3.fullyExpanded;
      var computedClassName = classNames(className, 'private-expandable-text', scrollable && 'private-expandable-text--scrollable');
      var computedButtonClassName = classNames('private-expandable-text__toggle-button', scrollable ? 'align-right' : buttonAlign === 'left' && 'align-left');
      var computedMaxHeight = expanded ? contentHeight : pxValue(maxHeight, maxHeightRems);
      var showToggleButton = toggleable && collapsible;
      var renderedButton = showToggleButton ? /*#__PURE__*/_jsxs(UIButton, {
        "aria-hidden": expanded ? !onCollapseButtonClick : !onExpandButtonClick,
        className: computedButtonClassName,
        onClick: expanded ? this.handleCollapseButtonClick : this.handleExpandButtonClick,
        use: "link",
        children: [scrollable || hideButtonCaret ? null : /*#__PURE__*/_jsx(UIIcon, {
          color: CALYPSO,
          name: expanded ? 'up' : 'down'
        }), lazyEval(expanded ? collapseButtonText : expandButtonText)]
      }) : null;
      var defaultGradientColor = use === 'on-dark' ? GYPSUM : OLAF;
      return /*#__PURE__*/_jsxs("div", {
        className: "private-expandable-text__container",
        "data-collapsible": collapsible,
        children: [scrollable && renderedButton, /*#__PURE__*/_jsxs("div", {
          className: "private-expandable-text__overhang-wrapper",
          children: [/*#__PURE__*/_jsx("div", {
            className: computedClassName,
            onFocus: this.handleTextWrapperFocus,
            onTransitionEnd: this.handleTextWrapperTransitionEnd,
            ref: this.textWrapperRefCallback,
            style: fullyExpanded ? null : this._getStyle(computedMaxHeight),
            children: children
          }), collapsible && !expanded ? /*#__PURE__*/_jsx(Overhang, {
            gradientColor: gradientColor != null ? gradientColor : defaultGradientColor,
            scrollable: scrollable,
            side: "bottom",
            size: pxValue(fadeOutHeight, fadeOutHeightRems)
          }) : null]
        }), !scrollable && renderedButton]
      });
    }
  }]);

  return UIExpandableText;
}(Component);

UIExpandableText.propTypes = {
  buttonAlign: PropTypes.oneOf(['left', 'center']).isRequired,
  children: PropTypes.node.isRequired,
  collapseButtonText: createLazyPropType(PropTypes.node).isRequired,
  expandButtonText: createLazyPropType(PropTypes.node).isRequired,
  expanded: PropTypes.bool,
  expandOnFocus: PropTypes.bool.isRequired,
  fadeOutHeight: PropTypes.number.isRequired,
  fadeOutHeightRems: hidden(PropTypes.number),
  gradientColor: PropTypes.string,
  hideButtonCaret: PropTypes.bool.isRequired,
  maxHeight: PropTypes.number.isRequired,
  maxHeightRems: hidden(PropTypes.number),
  onCollapsibleChange: hidden(PropTypes.func),
  onCollapseButtonClick: PropTypes.func,
  onExpandButtonClick: PropTypes.func,
  onExpandedChange: PropTypes.func,
  Overhang: getComponentPropType(ExpandableTextOverhang),
  scrollable: PropTypes.bool,
  toggleable: PropTypes.bool,
  use: PropTypes.oneOf(['default', 'on-dark'])
};
UIExpandableText.defaultProps = {
  buttonAlign: 'center',
  collapseButtonText: function collapseButtonText() {
    return I18n.text('salesUI.UIExpandableText.collapseButtonText');
  },
  expandButtonText: function expandButtonText() {
    return I18n.text('salesUI.UIExpandableText.expandButtonText');
  },
  expanded: false,
  expandOnFocus: true,
  fadeOutHeight: 32,
  hideButtonCaret: false,
  maxHeight: 80,
  Overhang: ExpandableTextOverhang,
  scrollable: false,
  toggleable: true,
  use: 'default'
};
UIExpandableText.displayName = 'UIExpandableText';
export default Controllable(UIExpandableText, ['expanded']);
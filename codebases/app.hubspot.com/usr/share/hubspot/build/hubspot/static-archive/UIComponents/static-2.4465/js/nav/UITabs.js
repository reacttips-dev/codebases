'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { BUTTON_RADIUS, LAYOUT_PADDING_X, TAB_PADDING_X, TAB_PADDING_Y } from 'HubStyleTokens/sizes';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { cloneElement, Children, PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import styled, { css } from 'styled-components';
import UIButton from '../button/UIButton';
import { memoizedSequence } from '../core/Functions';
import Controllable from '../decorators/Controllable';
import UIDropdown from '../dropdown/UIDropdown';
import HiddenMeasure from '../layout/utils/HiddenMeasure';
import UIList from '../list/UIList';
import UISection from '../section/UISection';
import createChainablePropType from '../utils/propTypes/createChainablePropType';
import { setInputMetrics } from '../utils/Styles';
import { BORDER_COLOR, ENCLOSED_SHADED_SELECTED_BACKGROUND_COLOR } from './TabConstants';
import { USES, getSelectedTabBackgroundColor, isContained } from './utils/tabUtils';
var HIDDEN_CLASSNAME_REGEX = /sr-only(-focusable)?/g;

var isTabComponent = function isTabComponent(child) {
  var propTypes = child && child.type && child.type.propTypes;
  return propTypes && propTypes.tabId && propTypes.title;
};

var isWhitespace = function isWhitespace(str) {
  return typeof str === 'string' && !str.match(/\S/);
};

var getActiveTabPanel = function getActiveTabPanel(selected, childArray) {
  for (var i = 0; i < childArray.length; i++) {
    var child = childArray[i];

    var _ref = child && child.props ? child.props : {},
        tabContent = _ref.children,
        tabId = _ref.tabId;

    if (tabId === selected) {
      return tabContent;
    }
  }

  return null;
};
/**
 * @param {HTMLElement} el
 * @returns {number} The precise width of the element's bounding box (`clientWidth` is rounded)
 */


var getElementWidth = function getElementWidth(el) {
  return el.getBoundingClientRect().width;
};

var getAvailableWidth = function getAvailableWidth(parentEl, tabsEl) {
  var computedStyles = getComputedStyle(parentEl, null); // Patch for Firefox < 62: https://bugzilla.mozilla.org/show_bug.cgi?id=1467722

  if (!computedStyles) return Infinity;
  var innerWidth = getElementWidth(parentEl) - parseFloat(computedStyles.paddingLeft, 10) - parseFloat(computedStyles.paddingRight, 10);
  var availableWidth = innerWidth; // Special case: If we're in a horizontal flex container, respect our siblings' space.

  if (computedStyles.display === 'flex' && computedStyles.flexDirection === 'row' && computedStyles.flexWrap === 'nowrap') {
    var childNodes = parentEl.childNodes;

    for (var i = 0; i < childNodes.length; i++) {
      if (childNodes[i] !== tabsEl) availableWidth -= getElementWidth(childNodes[i]);
    }
  }

  return availableWidth;
}; // `PropTypes.children`, but checks all children are `UITab` nodes


var childrenPropTypeValidator = createChainablePropType(function (props, propName, componentName) {
  // Only accept UITab instances as children
  var valid = true;
  Children.forEach(props[propName], function (child) {
    if (child != null && !isTabComponent(child) && !isWhitespace(child)) {
      valid = false;
    }
  });

  if (!valid) {
    return new Error(componentName + ": All children must be instances of UITab.");
  }

  return null;
}, 'node' // TODO: render "`UITab`s" instead, linked to the UITab docs
);
var listRightBorderMixin = css(["border-right:", ";"], function (_ref2) {
  var fullWidth = _ref2.fullWidth;
  return !fullWidth && "1px solid " + BORDER_COLOR;
});
var StyledList = styled.div.withConfig({
  displayName: "UITabs__StyledList",
  componentId: "sc-1ojmx7e-0"
})(["display:", ";width:", ";margin-bottom:-1px;border-bottom:1px solid ", ";", ";"], function (_ref3) {
  var use = _ref3.use;
  return isContained(use) ? 'inline-flex' : 'flex';
}, function (_ref4) {
  var fullWidth = _ref4.fullWidth;
  return fullWidth && '100%';
}, function (_ref5) {
  var bordered = _ref5.bordered;
  return bordered ? BORDER_COLOR : 'transparent';
}, function (_ref6) {
  var use = _ref6.use;
  if (use === 'header') return css(["padding-left:", ";"], LAYOUT_PADDING_X);
  if (use === 'enclosed') return css(["border:1px solid ", ";border-top-left-radius:", ";border-top-right-radius:", ";"], BORDER_COLOR, BUTTON_RADIUS, BUTTON_RADIUS);
  if (use === 'flush' || use === 'enclosed-shaded') return css(["border-top:1px solid ", ";", ";"], BORDER_COLOR, listRightBorderMixin);
  if (use === 'toolbar') return listRightBorderMixin;
  return null;
});
StyledList.displayName = 'UITabs__StyledUITabsList';
var TabsPanel = styled(function (props) {
  var __use = props.use,
      rest = _objectWithoutProperties(props, ["use"]);

  return /*#__PURE__*/_jsx(UISection, Object.assign({}, rest));
}).withConfig({
  displayName: "UITabs__TabsPanel",
  componentId: "sc-1ojmx7e-1"
})(["background-color:", ";padding:16px;border-top:1px solid ", ";"], function (_ref7) {
  var use = _ref7.use;
  return use === 'enclosed-shaded' && ENCLOSED_SHADED_SELECTED_BACKGROUND_COLOR;
}, function (_ref8) {
  var bordered = _ref8.bordered;
  return bordered ? BORDER_COLOR : 'transparent';
});
var StyledWrapper = styled.div.withConfig({
  displayName: "UITabs__StyledWrapper",
  componentId: "sc-1ojmx7e-2"
})(["", ";"], function (_ref9) {
  var use = _ref9.use;
  return isContained(use) ? css(["position:relative;&::before{border-top:1px solid ", ";bottom:-1px;content:'';left:0;position:absolute;width:100%;}"], function (_ref10) {
    var bordered = _ref10.bordered;
    return bordered ? BORDER_COLOR : 'transparent';
  }) : null;
});
StyledWrapper.displayName = 'UITabs__StyledUITabsWrapper';
var StyledUITabs = styled.div.withConfig({
  displayName: "UITabs__StyledUITabs",
  componentId: "sc-1ojmx7e-3"
})(["max-width:100%;", ";"], function (_ref11) {
  var use = _ref11.use;
  return use === 'header' ? css(["margin-bottom:40px;& > ", "{padding-left:", ";}"], TabsPanel, LAYOUT_PADDING_X) : null;
});
var ExcessTabsDropdownButton = styled(function (props) {
  var __parentUse = props.parentUse,
      rest = _objectWithoutProperties(props, ["parentUse"]);

  return /*#__PURE__*/_jsx(UIButton, Object.assign({}, rest));
}).withConfig({
  displayName: "UITabs__ExcessTabsDropdownButton",
  componentId: "sc-1ojmx7e-4"
})(["&&&{", ";flex-shrink:0;", ";}"], setInputMetrics(TAB_PADDING_Y, TAB_PADDING_X, TAB_PADDING_X, TAB_PADDING_Y, false), function (_ref12) {
  var use = _ref12.parentUse;
  return isContained(use) ? css(["background-color:", ";border-left:1px solid ", ";border-radius:0;"], getSelectedTabBackgroundColor(use), BORDER_COLOR) : null;
});

var renderExcessTabsDropdown = function renderExcessTabsDropdown(moreTabsRenderer, childArray, excessTabCount, use, handleTabClick) {
  if (moreTabsRenderer == null) return null;
  var excessTabs = childArray.slice(childArray.length - excessTabCount);
  var excessTabListItems = excessTabs.map(function (child) {
    var _ref13 = child && child.props ? child.props : {},
        onClick = _ref13.onClick;

    return /*#__PURE__*/cloneElement(child, {
      onClick: memoizedSequence(handleTabClick, onClick),
      active: false,
      children: null,
      role: 'button',
      tooltipPlacement: undefined
    });
  });
  return /*#__PURE__*/cloneElement(moreTabsRenderer({
    tabs: excessTabListItems,
    use: use
  }), {
    'data-more-tabs': true
  });
};

var UITabs = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITabs, _PureComponent);

  function UITabs() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UITabs);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UITabs)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      excessTabCount: 0
    };

    _this.checkFit = function () {
      var moreTabsRenderer = _this.props.moreTabsRenderer;
      var excessTabCount = _this.state.excessTabCount;

      if (moreTabsRenderer == null) {
        if (excessTabCount !== 0) _this.setState({
          excessTabCount: 0
        });
        return;
      }

      var measureEl = _this._measureEl;
      var outerEl = _this._outerEl;
      var parentEl = outerEl ? outerEl.parentElement : null;

      if (measureEl == null || outerEl == null || parentEl == null) {
        return;
      } // Tally the total tab width. If it's less than the available width, things are simple!


      var containerWidth = Math.ceil(getAvailableWidth(parentEl, outerEl));
      var totalTabsWidth = 0;

      var measureTabsArr = _toConsumableArray(measureEl.querySelectorAll('[data-tab-id]'));

      measureTabsArr.forEach(function (tabEl) {
        totalTabsWidth += getElementWidth(tabEl);
      });

      if (totalTabsWidth <= containerWidth) {
        if (excessTabCount !== 0) _this.setState({
          excessTabCount: 0
        });
        return;
      } // At this point, we know we can't fit all the tabs. How many do we relegate to the dropdown?
      // We start with the "More" dropdown and the active tab...


      var visibleContentWidth = getElementWidth(measureEl.querySelector('[data-more-tabs]'));
      var activeTab = measureTabsArr.find(function (el) {
        return el.getAttribute('data-tab-selected') === 'true';
      });
      if (activeTab) visibleContentWidth += getElementWidth(activeTab); // ...Then we add as many inactive tabs (from left to right) as we can fit.

      var inactiveTabEls = measureTabsArr.filter(function (el) {
        return el.getAttribute('data-tab-selected') !== 'true';
      });
      var newExcessTabCount = inactiveTabEls.length;

      for (var i = 0; i < inactiveTabEls.length; i++) {
        var tabWidth = getElementWidth(inactiveTabEls[i]);
        if (visibleContentWidth + tabWidth > containerWidth) break;
        visibleContentWidth += tabWidth;
        newExcessTabCount -= 1;
      }

      if (newExcessTabCount !== excessTabCount) {
        _this.setState({
          excessTabCount: newExcessTabCount
        });
      }
    };

    return _this;
  }

  _createClass(UITabs, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this._outerEl && this._outerEl.parentElement && this._measureEl) {
        this._resizeObserver = new ResizeObserver(this.checkFit);

        this._resizeObserver.observe(this._outerEl.parentElement);

        this._resizeObserver.observe(this._measureEl);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.selected !== this.props.selected) {
        // ⚠️ This condition prevents infinite loops! ⚠️
        if (prevState.excessTabCount === this.state.excessTabCount) {
          this.checkFit();
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._resizeObserver.disconnect();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          bordered = _this$props.bordered,
          children = _this$props.children,
          className = _this$props.className,
          fill = _this$props.fill,
          listClassName = _this$props.listClassName,
          moreTabsRenderer = _this$props.moreTabsRenderer,
          onSelectedChange = _this$props.onSelectedChange,
          panelClassName = _this$props.panelClassName,
          selected = _this$props.selected,
          List = _this$props.List,
          use = _this$props.use,
          Wrapper = _this$props.Wrapper,
          wrapperClassName = _this$props.wrapperClassName,
          rest = _objectWithoutProperties(_this$props, ["bordered", "children", "className", "fill", "listClassName", "moreTabsRenderer", "onSelectedChange", "panelClassName", "selected", "List", "use", "Wrapper", "wrapperClassName"]);

      var excessTabCount = this.state.excessTabCount;
      var childArray = Children.toArray(children).filter(function (child) {
        return child && child.type;
      });
      var classes = classNames(className, 'private-tabs', use === 'header' && 'private-tabs--header'); // If the selected tab would be in the excess tab dropdown, move it to
      // first position instead.

      if (excessTabCount > 0) {
        for (var i = childArray.length - excessTabCount; i < childArray.length; i++) {
          if (childArray[i] && childArray[i].props.tabId === selected) {
            var firstChild = childArray[0];
            childArray[0] = childArray[i];
            childArray[i] = firstChild;
            break;
          }
        }
      }

      var activeTabPanel = getActiveTabPanel(selected, childArray);
      var componentRole = activeTabPanel ? 'tablist' : 'navigation';
      var excessTabsDropdown = renderExcessTabsDropdown(moreTabsRenderer, childArray, excessTabCount, use, onSelectedChange);
      var tabs = childArray.map(function (child, i) {
        var _ref14 = child.props ? child.props : {},
            active = _ref14.active,
            childClassName = _ref14.className,
            tabId = _ref14.tabId,
            onClick = _ref14.onClick;

        var hidden = i >= childArray.length - excessTabCount;
        var tabRole = activeTabPanel ? 'tab' : 'button';
        return /*#__PURE__*/cloneElement(child, {
          onClick: memoizedSequence(onSelectedChange, onClick),
          active: active != null ? active : tabId === selected,
          'aria-current': !activeTabPanel && tabId === selected ? 'page' : null,
          'aria-selected': activeTabPanel && tabId === selected ? true : null,
          children: null,
          className: classNames(childClassName, hidden && "sr-only sr-only-focusable"),
          role: tabRole,
          use: use,
          fill: fill
        });
      });
      var measureChildren = tabs.map(function (tab) {
        return /*#__PURE__*/cloneElement(tab, {
          className: tab.props.className.replace(HIDDEN_CLASSNAME_REGEX, ''),
          tooltip: undefined
        });
      });
      return /*#__PURE__*/_jsxs(StyledUITabs, Object.assign({
        className: classes,
        ref: function ref(_ref16) {
          _this2._outerEl = findDOMNode(_ref16);
        },
        use: use
      }, rest, {
        children: [/*#__PURE__*/_jsxs(Wrapper, {
          bordered: bordered,
          className: classNames('private-tabs__list__wrapper', wrapperClassName),
          use: use,
          children: [/*#__PURE__*/_jsxs(List, {
            bordered: bordered,
            className: classNames('private-tabs__list', listClassName),
            "data-content": true,
            role: componentRole,
            use: use,
            fullWidth: fill,
            children: [tabs, excessTabCount > 0 && excessTabsDropdown]
          }), /*#__PURE__*/_jsx(HiddenMeasure, {
            ref: function ref(_ref15) {
              _this2._measureEl = findDOMNode(_ref15);
            },
            style: {
              height: 0
            },
            children: /*#__PURE__*/_jsxs(List, {
              bordered: bordered,
              use: use,
              children: [measureChildren, excessTabsDropdown]
            })
          })]
        }), activeTabPanel ? /*#__PURE__*/_jsx(TabsPanel, {
          bordered: bordered,
          className: classNames(panelClassName, 'private-tabs__panel'),
          role: "tabpanel",
          use: use,
          children: activeTabPanel
        }) : null]
      }));
    }
  }]);

  return UITabs;
}(PureComponent);

UITabs.displayName = 'UITabs';
UITabs.propTypes = {
  bordered: PropTypes.bool.isRequired,
  children: childrenPropTypeValidator,
  fill: PropTypes.bool,
  List: PropTypes.elementType,
  listClassName: PropTypes.string,
  moreTabsRenderer: PropTypes.func,
  onSelectedChange: PropTypes.func.isRequired,
  panelClassName: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  use: PropTypes.oneOf(USES),
  Wrapper: PropTypes.elementType,
  wrapperClassName: PropTypes.string
};
UITabs.defaultProps = {
  bordered: true,
  fill: false,
  moreTabsRenderer: function moreTabsRenderer(_ref17) {
    var tabs = _ref17.tabs,
        use = _ref17.use;
    return /*#__PURE__*/_jsx(UIDropdown, {
      Button: ExcessTabsDropdownButton,
      "aria-hidden": true,
      buttonClassName: "private-tabs__excess-tabs-dropdown",
      buttonText: I18n.text('salesUI.UITabs.moreDropdownLabel'),
      buttonUse: "transparent",
      "data-dropdown-tabs": tabs.length,
      placement: "bottom left",
      responsive: false,
      tabIndex: -1,
      parentUse: use,
      children: /*#__PURE__*/_jsx(UIList, {
        children: tabs
      })
    });
  },
  List: StyledList,
  Wrapper: StyledWrapper
};
export default Controllable(UITabs, ['selected']);
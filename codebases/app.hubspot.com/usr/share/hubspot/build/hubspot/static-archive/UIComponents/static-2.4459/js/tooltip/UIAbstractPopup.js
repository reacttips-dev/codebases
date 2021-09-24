'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { JUPITER_LAYER } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { Fragment, PureComponent } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import Tether from 'tether';
import { callIfPossible } from '../core/Functions';
import { addToListAttr, elementIsOnScreen, getNextTabbableElementExclusive, getPrevTabbableElementInclusive, getTabbableElements, removeFromListAttr } from '../utils/Dom';
import domElementPropType from '../utils/propTypes/domElement';
import { getDefaultNode } from '../utils/RootNode';
import { first, last, uniqueId } from '../utils/underscore';
import { PLACEMENTS } from './PlacementConstants';
import { getAttachment, getOffset, getTargetAttachment, getTargetOffset } from './utils/Placement';
import { autoPlacementPropType, pinToConstraintPropType } from './utils/propTypes';
var NUMBERS_REGEX = /\d+/g;
var DUMMY_ELEMENT = document.createElement('span');

var makeLayerNode = function makeLayerNode(zIndex, id) {
  var node = document.createElement('div'); // add z-index for compatibility with other "layered" stuff like vex

  node.style.zIndex = zIndex; // position fixed prevents a screen jump when the container mounts

  node.style.position = 'fixed';
  node.style.top = '0px';
  node.id = id;
  return node;
};

var getDummyElement = function getDummyElement(bodyElement) {
  // IE11 throws an error if we try to initialize Tether with an element
  // that isn't in the DOM: HubSpot/UIComponents#1058
  if (!DUMMY_ELEMENT.parentElement) {
    bodyElement.appendChild(DUMMY_ELEMENT);
  }

  return DUMMY_ELEMENT;
};

var getTabTargetFromWithinPopup = function getTabTargetFromWithinPopup(popopEl, activeEl, reverseTab, targetEl) {
  var tabbableElsWithinPopup = getTabbableElements(popopEl);

  if (!reverseTab && activeEl === last(tabbableElsWithinPopup)) {
    // Tab out of the popup to the tabbable element after the target (exclusive).
    return getNextTabbableElementExclusive(targetEl);
  } else if (reverseTab && activeEl === first(tabbableElsWithinPopup)) {
    // Tab out of the popup to the tabbable element before the target (inclusive).
    return getPrevTabbableElementInclusive(targetEl);
  }

  return null;
};

var UIAbstractPopup = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIAbstractPopup, _PureComponent);

  function UIAbstractPopup() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIAbstractPopup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIAbstractPopup)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      targetIsOutOfBounds: false
    };

    _this.handleWindowFocus = function () {
      var onFocusLeave = _this.props.onFocusLeave;
      if (!onFocusLeave) return;
      var activeEl = document.activeElement;

      if (!_this._element.contains(activeEl)) {
        onFocusLeave();
      }
    };

    _this.handleWindowKeyDown = function (evt) {
      var key = evt.key;

      if (key === 'Tab') {
        _this.handleTab(evt);
      }
    };

    _this.reposition = function () {
      if (_this._tether && _this.getRootNode().contains(_this._tether.target)) {
        _this._tether.position();
      }
    };

    _this.updateIfContentSizeChanged = function () {
      var _this$_element$getBou = _this._element.getBoundingClientRect(),
          height = _this$_element$getBou.height,
          width = _this$_element$getBou.width;

      if (height !== _this._prevHeight || width !== _this._prevWidth) {
        _this.stopMutationObserver(); // prevent potential loop (#5090)


        if (_this._prevWidth !== undefined) _this.updateTether();

        _this.startMutationObserver();

        _this._prevWidth = width;
        _this._prevHeight = height;
      }
    };

    _this.updateTether = function () {
      var bodyElement = _this.props.bodyElement;
      var contentEl = _this._element;

      var targetEl = _this.getTargetElement();

      if (!contentEl || !targetEl) {
        return;
      }

      var tetherOptions = _this.getTetherOptions(contentEl, targetEl, bodyElement);

      if (!_this._tether) {
        _this._tether = new Tether(Object.assign({}, tetherOptions, {
          element: getDummyElement(_this.getRootNode())
        }));

        _this._tether.on('update', _this.handleTetherUpdate);

        _this._tether.setOptions(tetherOptions);
      } else {
        _this._tether.setOptions(tetherOptions);
      }
    };

    _this.handleTetherUpdate = function (evt) {
      var onTetherUpdate = _this.props.onTetherUpdate;

      var targetEl = _this.getTargetElement();

      if (!targetEl || !elementIsOnScreen(targetEl)) {
        if (!_this.state.targetIsOutOfBounds) _this.setState({
          targetIsOutOfBounds: true
        });
        return; // Ignore constraint violations caused by being completely off-screen
      }

      if (_this.state.targetIsOutOfBounds) _this.setState({
        targetIsOutOfBounds: false
      });
      callIfPossible(onTetherUpdate, evt);
    };

    return _this;
  }

  _createClass(UIAbstractPopup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          open = _this$props.open,
          zIndex = _this$props.zIndex;

      if (open && !!this.getTargetElement()) {
        this.createTether(zIndex);
      }
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var target = this.props.target;

      if (target != null && target !== nextProps.target) {
        this.removeTargetEventListeners();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props2 = this.props,
          open = _this$props2.open,
          zIndex = _this$props2.zIndex;
      var isOpen = !!this._element;
      var shouldBeOpen = open && !!this.getTargetElement();

      if (!isOpen && shouldBeOpen) {
        this.createTether(zIndex);
      } else if (isOpen && !shouldBeOpen) {
        this.destroyTether();
      } else if (isOpen && shouldBeOpen) {
        this.updateTether();
        if (prevProps.zIndex !== zIndex) this._element.style.zIndex = zIndex;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.destroyTether();
    }
  }, {
    key: "addTargetEventListeners",
    value: function addTargetEventListeners() {
      var targetEl = this.getTargetElement();

      if (targetEl != null) {
        targetEl.addEventListener('load', this.updateTether, true);
      }
    }
  }, {
    key: "removeTargetEventListeners",
    value: function removeTargetEventListeners() {
      var targetEl = this.getTargetElement();

      if (targetEl != null) {
        targetEl.removeEventListener('load', this.updateTether, true);
      }
    }
  }, {
    key: "getRootNode",
    value: function getRootNode() {
      this._rootNode = this._rootNode || this.props.bodyElement || getDefaultNode();
      return this._rootNode;
    }
  }, {
    key: "getTetherOptions",
    value: function getTetherOptions(contentEl, targetEl, bodyElement) {
      var _this$props3 = this.props,
          addTargetClasses = _this$props3.addTargetClasses,
          autoPlacement = _this$props3.autoPlacement,
          center = _this$props3.center,
          distance = _this$props3.distance,
          inset = _this$props3.inset,
          pinToConstraint = _this$props3.pinToConstraint,
          pinToOutOfBoundsTarget = _this$props3.pinToOutOfBoundsTarget,
          placement = _this$props3.placement,
          targetAttachment = _this$props3.targetAttachment;
      var targetIsOutOfBounds = this.state.targetIsOutOfBounds;
      var applyConstraints = !!autoPlacement;
      var applyPinning = pinToOutOfBoundsTarget || !targetIsOutOfBounds;
      var offset = getOffset(placement, distance, inset);
      var constraints = []; // Tether will naïvely try to flip back and forth in an infinite loop if it
      // can't satisfy our constraints, so we need to make sure we have room. Also,
      // there should be no constraints if there is no content.

      var _contentEl$getBoundin = contentEl.getBoundingClientRect(),
          height = _contentEl$getBoundin.height,
          width = _contentEl$getBoundin.width;

      if (applyConstraints && height && width) {
        var _window = window,
            innerHeight = _window.innerHeight,
            innerWidth = _window.innerWidth;

        var _targetEl$getBounding = targetEl.getBoundingClientRect(),
            top = _targetEl$getBounding.top,
            right = _targetEl$getBounding.right,
            bottom = _targetEl$getBounding.bottom,
            left = _targetEl$getBounding.left;

        var horizOffset = Number(offset.match(NUMBERS_REGEX)[1]);
        var vertOffset = Number(offset.match(NUMBERS_REGEX)[0]);
        var totalWidth = width + horizOffset;
        var totalHeight = height + vertOffset;
        var enableHorizConstraint = autoPlacement !== 'vert' && (left - totalWidth > 0 || right + totalWidth < innerWidth);
        var enableVertConstraint = autoPlacement !== 'horiz' && (top - totalHeight > 0 || bottom + totalHeight < innerHeight);
        var horizConstraint = enableHorizConstraint ? 'together' : 'none';
        var vertConstraint = enableVertConstraint ? 'together' : 'none';
        constraints = [{
          to: 'window',
          attachment: vertConstraint + " " + horizConstraint,
          pin: applyPinning ? pinToConstraint : false
        }];
      } // targetAttachment is computed based on placement and inset (a proxy for
      // whether we have an arrow), but can be overridden.


      var computedTargetAttachment = targetAttachment === 'auto' ? getTargetAttachment(placement, center) : targetAttachment;
      return {
        addTargetClasses: addTargetClasses,
        attachment: getAttachment(placement),
        constraints: constraints,
        element: contentEl,
        bodyElement: bodyElement,
        enabled: true,
        offset: offset,
        target: targetEl,
        targetOffset: getTargetOffset(placement, inset),
        targetAttachment: computedTargetAttachment
      };
    }
  }, {
    key: "handleTab",
    value: function handleTab(evt) {
      // Popups are appended to <body>, which means they live at the end of the document tabbing order,
      // regardless of their visual placement. So when the user presses Tab and it would take them out
      // of the Tether, they should tab to an element adjacent to the popup target.
      // Ignore key events that have already had their behavior overridden (e.g. by TinyMCE)
      if (evt.defaultPrevented) return;
      var reverseTab = evt.shiftKey;
      var activeEl = document.activeElement;
      var targetEl = this.getTargetElement();
      var overrideFocusEl;

      if (this._element.contains(activeEl)) {
        overrideFocusEl = getTabTargetFromWithinPopup(this._element, activeEl, reverseTab, targetEl);
      } else if (!reverseTab && activeEl === getPrevTabbableElementInclusive(targetEl)) {
        overrideFocusEl = first(getTabbableElements(this._element));
      } else if (reverseTab && activeEl === getNextTabbableElementExclusive(targetEl)) {
        overrideFocusEl = last(getTabbableElements(this._element));
      }

      if (overrideFocusEl) {
        overrideFocusEl.focus(); // We prevent the default tab behavior *only* if we succeeded in overriding the focus. This
        // is an escape hatch for any edge cases where overrideFocusEl isn't actually focusable. (The
        // rules of focusability are mercurial and may vary across systems/browsers.)

        if (document.activeElement === overrideFocusEl) {
          evt.preventDefault();
        }
      }
    }
  }, {
    key: "addImgLoadListeners",
    value: function addImgLoadListeners() {
      // Because loading an image may change the size of the content, we need to
      // reassess our constraints. The update also takes care of repositioning.
      this._element.addEventListener('load', this.updateIfContentSizeChanged, true);
    }
  }, {
    key: "startMutationObserver",
    value: function startMutationObserver() {
      this._observer = new MutationObserver(this.updateIfContentSizeChanged);

      this._observer.observe(this._element, {
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
    key: "startIntersectionObserver",
    value: function startIntersectionObserver() {
      var _this2 = this;

      var targetEl = this.getTargetElement();
      var _window2 = window,
          IntersectionObserver = _window2.IntersectionObserver;

      if (IntersectionObserver && targetEl) {
        this._intersectionObserver = new IntersectionObserver(function (entries) {
          var isIntersecting = entries[0].isIntersecting;

          _this2.setState({
            targetIsOutOfBounds: !isIntersecting
          });
        });

        this._intersectionObserver.observe(targetEl);
      }
    }
  }, {
    key: "stopIntersectionObserver",
    value: function stopIntersectionObserver() {
      if (this._intersectionObserver) {
        this._intersectionObserver.disconnect();
      }
    }
  }, {
    key: "createTether",
    value: function createTether(zIndex) {
      this._id = this._id || uniqueId('popover-');
      this._element = makeLayerNode(zIndex, this._id);
      this.getRootNode().appendChild(this._element);
      this.updateTether();
      this.addImgLoadListeners();
      this.startMutationObserver();
      this.startIntersectionObserver();
      this.addTargetEventListeners();
      addToListAttr(this.getTargetElement(), 'data-popover-id', this._id);
      addEventListener('focus', this.handleWindowFocus, true);
      addEventListener('keydown', this.handleWindowKeyDown);
      addEventListener('resize', this.updateTether);
      this.forceUpdate();
    }
  }, {
    key: "destroyTether",
    value: function destroyTether() {
      if (this._tether) {
        this._tether.destroy();

        this._tether = null;
      }

      if (this._element) {
        this._element.parentElement.removeChild(this._element);

        this._element = null;
      } // If focus has been lost, restore focus to the last element


      if (this._lastFocus) {
        var activeEl = document.activeElement;

        if (!activeEl || activeEl === document.body) {
          this._lastFocus.focus();
        }

        this._lastFocus = null;
      }

      this.stopMutationObserver();
      this.stopIntersectionObserver();
      this.removeTargetEventListeners();
      removeFromListAttr(this.getTargetElement(), 'data-popover-id', this._id);
      removeEventListener('focus', this.handleWindowFocus, true);
      removeEventListener('keydown', this.handleWindowKeyDown);
      removeEventListener('resize', this.updateTether);
    }
    /** @public */

  }, {
    key: "getTargetElement",
    value: function getTargetElement() {
      var _this$props4 = this.props,
          children = _this$props4.children,
          target = _this$props4.target;
      if (target) return target;
      if (children) return findDOMNode(this);
      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          children = _this$props5.children,
          content = _this$props5.content,
          open = _this$props5.open;
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [children || null, open && this._element && /*#__PURE__*/ReactDOM.createPortal(content, this._element)]
      });
    }
  }]);

  return UIAbstractPopup;
}(PureComponent);

if (process.env.NODE_ENV !== 'production') {
  UIAbstractPopup.propTypes = {
    addTargetClasses: PropTypes.bool,
    autoPlacement: autoPlacementPropType,
    bodyElement: domElementPropType,
    center: PropTypes.bool,
    children: PropTypes.element,
    content: PropTypes.node,
    distance: PropTypes.number,
    inset: PropTypes.number,
    onFocusLeave: PropTypes.func,
    onTetherUpdate: PropTypes.func,
    open: PropTypes.bool,
    pinToConstraint: pinToConstraintPropType,
    pinToOutOfBoundsTarget: PropTypes.bool,
    placement: PropTypes.oneOf(PLACEMENTS),
    target: domElementPropType,
    targetAttachment: PropTypes.string,
    zIndex: PropTypes.number
  };
}

UIAbstractPopup.defaultProps = {
  addTargetClasses: true,
  autoPlacement: true,
  distance: 0,
  inset: 0,
  pinToConstraint: false,
  targetAttachment: 'auto',
  zIndex: parseInt(JUPITER_LAYER, 10)
};
UIAbstractPopup.displayName = 'UIAbstractPopup';
export default UIAbstractPopup;
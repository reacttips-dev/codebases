'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import cx from 'classnames';
import { EditorState } from 'draft-js';
import { compose } from 'draft-extend';
import { cleanSelectionRects } from 'rich-text-lib/utils/selection';
import uniqueId from 'transmute/uniqueId';
import { callIfPossible } from 'UIComponents/core/Functions';
import { FOCUS_TARGETS } from '../lib/constants';
import WithImprovedFocusProps from '../components/WithImprovedFocusProps';

var getVisibleSelectionRects = function getVisibleSelectionRects(selection) {
  if (selection.rangeCount < 1) {
    return [];
  }

  var range = selection.getRangeAt(0);
  var selectionRects = Array.from(range.getClientRects());
  var startHeight = range.startContainer.clientHeight;
  var endHeight = range.endContainer.clientHeight; // take line-height into account since true selection does

  if (startHeight && endHeight && startHeight === endHeight) {
    selectionRects.map(function (rect) {
      rect.height = startHeight;
      return rect;
    });
  }

  return cleanSelectionRects(selectionRects);
};

var createElFromVisibleSelectionRect = function createElFromVisibleSelectionRect(rect, topOffset, leftOffset) {
  var el = document.createElement('div');
  el.style.backgroundColor = 'rgba(0, 0, 0, 0.17)';
  el.style.height = rect.height + "px";
  el.style.left = rect.left - leftOffset + "px";
  el.style.position = 'absolute';
  el.style.top = rect.top - topOffset + "px";
  el.style.userSelect = 'none';
  el.style.width = rect.width + "px";
  el.style.zIndex = 1112; // one higher than UIModal

  return el;
};

export default (function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  return function (WrappingComponent) {
    if (plugins.length === 0) {
      return WrappingComponent;
    }

    var pluginComposition = compose.apply(void 0, plugins);
    var WrappedComponentWithPlugins = pluginComposition(WrappingComponent);

    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      var WrappedComponentWithImprovedFocusProps = WithImprovedFocusProps(WrappedComponentWithPlugins);

      var PaintSelectionOnBlur = /*#__PURE__*/function (_Component) {
        _inherits(PaintSelectionOnBlur, _Component);

        function PaintSelectionOnBlur() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, PaintSelectionOnBlur);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PaintSelectionOnBlur)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _this.focus = function () {
            if (_this.refs.child.focus) {
              _this.refs.child.focus();
            }
          };

          _this.blur = function () {
            if (_this.refs.child.blur) {
              _this.refs.child.blur();
            }
          };

          _this.getEditorNode = function () {
            return document.querySelector("." + _this._editorClassName + " .DraftEditor-root");
          };

          _this.destroySelectionContainer = function () {
            if (_this._selectionContainer) {
              var editorNode = _this.getEditorNode();

              editorNode.removeChild(_this._selectionContainer);
              _this._selectionContainer = null;
            }
          };

          _this.createSelectionContainer = function () {
            _this.destroySelectionContainer();

            var editorNode = _this.getEditorNode();

            _this._selectionContainer = document.createElement('div');
            editorNode.appendChild(_this._selectionContainer);
          };

          _this.handleBlur = function (e) {
            var onBlur = _this.props.onBlur;

            _this.createSelectionContainer();

            var editorNode = _this.getEditorNode();

            var _editorNode$getBoundi = editorNode.getBoundingClientRect(),
                topOffset = _editorNode$getBoundi.top,
                leftOffset = _editorNode$getBoundi.left;

            _this._lastValidSelectionRects.forEach(function (rect) {
              var selectionEl = createElFromVisibleSelectionRect(rect, topOffset - (editorNode.scrollTop || 0), leftOffset);

              _this._selectionContainer.appendChild(selectionEl);
            });

            callIfPossible(onBlur, e);
          };

          _this.handleFocus = function (e) {
            var onFocus = _this.props.onFocus;

            _this.destroySelectionContainer();

            callIfPossible(onFocus, e);
          };

          return _this;
        }

        _createClass(PaintSelectionOnBlur, [{
          key: "getChildContext",
          value: function getChildContext() {
            return {
              focus: this.focus,
              blur: this.blur
            };
          }
        }, {
          key: "UNSAFE_componentWillMount",
          value: function UNSAFE_componentWillMount() {
            this._lastValidSelectionRects = [];
            this._editorClassName = "blurrable-editor-" + uniqueId();
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate(prevProps) {
            var prevFocus = prevProps.currentFocus,
                prevEditorState = prevProps.editorState;
            var _this$props = this.props,
                currentFocus = _this$props.currentFocus,
                currentEditorState = _this$props.editorState;
            var prevSelection = prevEditorState.getSelection();
            var newSelection = currentEditorState.getSelection();
            var windowSelection = window.getSelection();

            if (windowSelection.rangeCount > 0 && !newSelection.equals(prevSelection)) {
              this._lastValidSelectionRects = getVisibleSelectionRects(windowSelection);
            }

            var multipleEditorsExist = prevFocus != null && currentFocus != null;

            if (multipleEditorsExist && prevFocus !== currentFocus) {
              // there's another Draft instance that's getting focus and we only
              // want to paint one fake selection on the page at a time
              this.destroySelectionContainer();
            }
          }
        }, {
          key: "render",
          value: function render() {
            var _this$props2 = this.props,
                className = _this$props2.className,
                rest = _objectWithoutProperties(_this$props2, ["className"]);

            var computedClassName = cx(className, this._editorClassName);
            return /*#__PURE__*/_jsx(WrappedComponentWithImprovedFocusProps, Object.assign({}, rest, {
              className: computedClassName,
              ref: "child",
              onBlur: this.handleBlur,
              onFocus: this.handleFocus
            }));
          }
        }]);

        return PaintSelectionOnBlur;
      }(Component);

      PaintSelectionOnBlur.propTypes = {
        className: PropTypes.string,
        currentFocus: PropTypes.oneOf(Object.values(FOCUS_TARGETS)),
        editorState: PropTypes.instanceOf(EditorState).isRequired,
        onBlur: PropTypes.func,
        onChange: PropTypes.func.isRequired,
        onFocus: PropTypes.func,
        handlePastedText: PropTypes.func
      };
      PaintSelectionOnBlur.childContextTypes = {
        focus: PropTypes.func,
        blur: PropTypes.func
      };
      return PaintSelectionOnBlur;
    }

    return WrappedComponentWithPlugins;
  };
});
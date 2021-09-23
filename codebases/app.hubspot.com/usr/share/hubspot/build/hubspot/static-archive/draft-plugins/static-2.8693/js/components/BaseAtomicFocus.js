'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import { EditorState, SelectionState, ContentState } from 'draft-js';
import { UP, DOWN, RIGHT, LEFT, BACKSPACE } from '../lib/keyCodes';
import { getClassNames } from '../lib/isNodeWithinClass';
var ARROW_KEYS = [UP, DOWN, RIGHT, LEFT];
var DRAFT_EDITOR_CLASS = 'draft-extend';
var DRAFT_CONTROLS_CLASS = 'draft-extend-controls';

var isNodeInEditor = function isNodeInEditor(node) {
  if (!node) {
    return false;
  }

  var classNameSet = getClassNames(node);

  if (classNameSet && classNameSet.has(DRAFT_CONTROLS_CLASS)) {
    return false;
  }

  if (classNameSet && classNameSet.has(DRAFT_EDITOR_CLASS)) {
    return true;
  }

  return isNodeInEditor(node.parentElement);
};

export default (function (isNodeWithinBlock) {
  var removable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return function (WrappingComponent) {
    var WithAtomicFocus = /*#__PURE__*/function (_Component) {
      _inherits(WithAtomicFocus, _Component);

      function WithAtomicFocus(props, context) {
        var _this;

        _classCallCheck(this, WithAtomicFocus);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(WithAtomicFocus).call(this, props, context));
        _this.blockRef = /*#__PURE__*/createRef();

        _this.setListeners = function () {
          var add = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var method = (add ? document.addEventListener : document.removeEventListener).bind(document);
          Object.keys(_this.listeners).forEach(function (event) {
            method(event, _this.listeners[event]);
          });
        };

        _this.overrideKeyDown = function () {
          _this.setState({
            overrideKeyDown: true
          });
        };

        _this.restoreKeyDown = function () {
          _this.setState({
            overrideKeyDown: false
          });
        };

        _this.handleReadOnlyClick = function (e) {
          var _this$state = _this.state,
              isInitiallyReadOnly = _this$state.isInitiallyReadOnly,
              selected = _this$state.selected;
          var _this$context = _this.context,
              getReadOnly = _this$context.getReadOnly,
              getEditorState = _this$context.getEditorState,
              onChange = _this$context.onChange;

          if (isInitiallyReadOnly || !selected) {
            return;
          }

          if (getReadOnly() === true && isNodeWithinBlock({
            target: e.target,
            blockRef: _this.blockRef.current
          }) === false) {
            e.preventDefault();
            e.stopPropagation();

            _this.blur();

            if (isNodeInEditor(e.target)) {
              var editorState = getEditorState();
              var currentKey = editorState.getSelection().get('anchorKey');
              var contentKeyBefore = editorState.getCurrentContent().getKeyBefore(currentKey);
              var updatedSelection = SelectionState.createEmpty(contentKeyBefore);
              onChange(EditorState.forceSelection(editorState, updatedSelection));
            }
          }
        };

        _this.handleArrowKey = function (keyCode) {
          var _this$context2 = _this.context,
              getEditorState = _this$context2.getEditorState,
              onChange = _this$context2.onChange;
          var editorState = getEditorState();
          var currentContent = editorState.getCurrentContent();
          var currentKey = editorState.getSelection().get('anchorKey');
          var updatedSelection = editorState.getSelection();

          if (keyCode === UP || keyCode === LEFT) {
            var contentKeyBefore = currentContent.getKeyBefore(currentKey);

            if (contentKeyBefore) {
              var contentBlockBefore = currentContent.getBlockForKey(contentKeyBefore);
              var offset = contentBlockBefore.getLength() || 0;
              updatedSelection = SelectionState.createEmpty(contentKeyBefore).merge({
                anchorOffset: offset,
                focusOffset: offset
              });
            }
          }

          if (keyCode === DOWN || keyCode === RIGHT) {
            var contentKeyAfter = currentContent.getKeyAfter(currentKey);

            if (contentKeyAfter) {
              updatedSelection = SelectionState.createEmpty(contentKeyAfter);
            }
          }

          _this.blur();

          onChange(EditorState.forceSelection(editorState, updatedSelection));
        };

        _this.handleKeyDown = function (e) {
          var _this$state2 = _this.state,
              selected = _this$state2.selected,
              overrideKeyDown = _this$state2.overrideKeyDown;

          if (!selected || overrideKeyDown) {
            return;
          }

          var keyCode = e.keyCode;

          if (ARROW_KEYS.includes(keyCode)) {
            _this.handleArrowKey(keyCode);

            e.preventDefault();
          } else if (keyCode === BACKSPACE && removable === true) {
            _this.removeBlock();

            e.preventDefault();
          }
        };

        _this.removeBlock = function () {
          var _this$context3 = _this.context,
              onChange = _this$context3.onChange,
              getEditorState = _this$context3.getEditorState;
          var editorState = getEditorState();
          var selection = editorState.getSelection();
          var currentContent = editorState.getCurrentContent();
          var currentBlockKey = selection.get('anchorKey');
          var updatedBlockMap = currentContent.getBlockMap().delete(currentBlockKey);
          var updatedContent = ContentState.createFromBlockArray(updatedBlockMap.toArray());
          var updatedSelection;
          var precedingBlockKey = currentContent.getKeyBefore(currentBlockKey);

          if (precedingBlockKey) {
            var precedingBlock = currentContent.getBlockForKey(precedingBlockKey);
            var offset = precedingBlock ? precedingBlock.getLength() : 0;
            updatedSelection = SelectionState.createEmpty(precedingBlockKey).merge({
              anchorOffset: offset,
              focusOffset: offset
            });
          } else {
            updatedSelection = SelectionState.createEmpty();
          }

          _this.blur();

          var updatedEditorState = EditorState.push(editorState, updatedContent, 'remove-range');
          onChange(EditorState.forceSelection(updatedEditorState, updatedSelection));
        };

        _this.focus = function () {
          var block = _this.props.block;
          var selected = _this.state.selected;
          var _this$context4 = _this.context,
              getEditorState = _this$context4.getEditorState,
              onChange = _this$context4.onChange,
              setReadOnly = _this$context4.setReadOnly;
          setTimeout(function () {
            var editorState = getEditorState();
            var newSelection = editorState.getSelection();

            if (!selected) {
              newSelection = SelectionState.createEmpty(block.getKey());

              _this.setListeners(true);
            }

            setReadOnly(true);
            onChange(EditorState.forceSelection(editorState, newSelection));

            _this.setState({
              selected: true
            });
          });
        };

        _this.blur = function () {
          var setReadOnly = _this.context.setReadOnly;
          setReadOnly(false);

          _this.setListeners(false);

          _this.setState({
            selected: false
          });
        };

        _this.render = function () {
          var selected = _this.state.selected;
          return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({}, _this.props, {
            selected: selected,
            overrideKeyDown: _this.overrideKeyDown,
            restoreKeyDown: _this.restoreKeyDown,
            onFocus: _this.focus,
            forwardRef: _this.blockRef
          }));
        };

        var _isInitiallyReadOnly = context.getReadOnly();

        _this.state = {
          selected: false,
          overrideKeyDown: false,
          isInitiallyReadOnly: _isInitiallyReadOnly
        };
        return _this;
      }

      _createClass(WithAtomicFocus, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          this.listeners = {
            keydown: this.handleKeyDown,
            click: this.handleReadOnlyClick
          };
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.setListeners(false);
        }
      }]);

      return WithAtomicFocus;
    }(Component);

    WithAtomicFocus.propTypes = {
      block: PropTypes.object.isRequired
    };
    WithAtomicFocus.contextTypes = {
      getEditorState: PropTypes.func,
      onChange: PropTypes.func.isRequired,
      getReadOnly: PropTypes.func.isRequired,
      setReadOnly: PropTypes.func.isRequired
    };
    WithAtomicFocus.WrappingComponent = WrappingComponent;
    return WithAtomicFocus;
  };
});
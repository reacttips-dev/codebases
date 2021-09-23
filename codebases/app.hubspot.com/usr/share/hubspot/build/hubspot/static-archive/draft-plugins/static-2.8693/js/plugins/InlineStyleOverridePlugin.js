'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { EditorState } from 'draft-js';
import { OrderedSet } from 'immutable';
export default (function () {
  return function (WrappingComponent) {
    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      return createReactClass({
        displayName: 'InlineStyleOverridePlugin',
        propTypes: {
          defaultStyle: PropTypes.instanceOf(OrderedSet),
          editorState: PropTypes.instanceOf(EditorState).isRequired,
          onChange: PropTypes.func.isRequired,
          readOnly: PropTypes.bool.isRequired
        },
        childContextTypes: {
          focus: PropTypes.func,
          blur: PropTypes.func
        },
        getDefaultProps: function getDefaultProps() {
          return {
            defaultStyle: null,
            readOnly: false
          };
        },
        getInitialState: function getInitialState() {
          return {
            inlineStyle: null
          };
        },
        getChildContext: function getChildContext() {
          return {
            focus: this.focus,
            blur: this.blur
          };
        },
        componentDidUpdate: function componentDidUpdate(prevProps) {
          var _this$props = this.props,
              defaultStyle = _this$props.defaultStyle,
              onChange = _this$props.onChange;

          if (defaultStyle && !defaultStyle.equals(prevProps.defaultStyle)) {
            this.setState({
              inlineStyle: defaultStyle
            });
            onChange(this.mergeDefaultStyleIntoCurrentStyle());
          }
        },
        focus: function focus() {
          if (this.refs.child.focus) {
            this.refs.child.focus();
          }
        },
        blur: function blur() {
          if (this.refs.child.blur) {
            this.refs.child.blur();
          }
        },
        isSelectionEqual: function isSelectionEqual(s1, s2) {
          return s1.get('anchorKey') === s2.get('anchorKey') && s1.get('anchorOffset') === s2.get('anchorOffset') && s1.get('focusKey') === s2.get('focusKey') && s1.get('focusOffset') === s2.get('focusOffset');
        },
        mergeDefaultStyleIntoCurrentStyle: function mergeDefaultStyleIntoCurrentStyle() {
          var editorState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.editorState;
          var defaultStyle = this.props.defaultStyle;

          if (!(defaultStyle && OrderedSet.isOrderedSet(defaultStyle))) {
            return editorState;
          }

          var nextInlineStyle = editorState.getCurrentInlineStyle();
          var styleToApply = defaultStyle.union(nextInlineStyle);
          return EditorState.setInlineStyleOverride(editorState, styleToApply);
        },
        handleOnChange: function handleOnChange(nextEditorState) {
          var _this$props2 = this.props,
              editorState = _this$props2.editorState,
              onChange = _this$props2.onChange;
          var inlineStyle = this.state.inlineStyle;
          var previousSelection = editorState.getSelection();
          var currentSelection = nextEditorState.getSelection();

          if (!currentSelection.isCollapsed() || !this.isSelectionEqual(previousSelection, currentSelection)) {
            var newEditorState = this.mergeDefaultStyleIntoCurrentStyle(nextEditorState);
            var newStyles = newEditorState.getInlineStyleOverride();
            this.setState({
              inlineStyle: newStyles
            });
            onChange(newEditorState);
          } else {
            var nextInlineStyleOverride = nextEditorState.getInlineStyleOverride();

            if (nextInlineStyleOverride === null) {
              nextInlineStyleOverride = inlineStyle;
            } else {
              nextEditorState = EditorState.forceSelection(nextEditorState, currentSelection);
            }

            this.setState({
              inlineStyle: nextInlineStyleOverride
            });
            onChange(EditorState.setInlineStyleOverride(nextEditorState, nextInlineStyleOverride));
          }
        },
        render: function render() {
          return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({}, this.props, {
            ref: "child",
            onChange: this.handleOnChange
          }));
        }
      });
    }

    return WrappingComponent;
  };
});
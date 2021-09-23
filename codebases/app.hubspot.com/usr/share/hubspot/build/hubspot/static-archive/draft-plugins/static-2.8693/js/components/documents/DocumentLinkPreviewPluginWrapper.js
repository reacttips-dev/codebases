'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import { EditorState } from 'draft-js';
export default (function (WrappingComponent) {
  if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
    return createReactClass({
      displayName: 'DocumentLinkPreviewPluginWrapper',
      propTypes: {
        editorState: PropTypes.instanceOf(EditorState).isRequired,
        decks: PropTypes.instanceOf(ImmutableMap)
      },
      childContextTypes: {
        decks: PropTypes.instanceOf(ImmutableMap)
      },
      getChildContext: function getChildContext() {
        return {
          decks: this.props.decks
        };
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
      render: function render() {
        return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({}, this.props, {
          ref: "child",
          editorState: this.props.editorState
        }));
      }
    });
  }

  return WrappingComponent;
});
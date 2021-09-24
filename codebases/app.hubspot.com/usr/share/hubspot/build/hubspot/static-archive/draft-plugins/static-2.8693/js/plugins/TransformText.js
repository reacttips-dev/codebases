'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { EditorState } from 'draft-js';
import { replaceSelectionChangeTypes } from 'draft-plugins/lib/constants';
import replaceEntityText from 'draft-plugins/utils/replaceEntityText';

var defaultDataFind = function defaultDataFind(data, entity) {
  return data.find(function (opt) {
    return opt.value === entity.getData().value;
  });
};

export default (function (_ref) {
  var dataProp = _ref.dataProp,
      entityType = _ref.entityType,
      _ref$dataFind = _ref.dataFind,
      dataFind = _ref$dataFind === void 0 ? defaultDataFind : _ref$dataFind;
  return function (WrappingComponent) {
    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      return createReactClass({
        displayName: dataProp + "(TransformText)",
        propTypes: _defineProperty({
          editorState: PropTypes.instanceOf(EditorState).isRequired
        }, dataProp, PropTypes.any),
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
        transformEditorState: function transformEditorState() {
          var editorState = this.props.editorState;
          var data = this.props[dataProp];

          if (data === null || data === undefined) {
            return editorState;
          }

          var updatedEditorState = replaceEntityText({
            editorState: editorState,
            data: data,
            dataFind: dataFind,
            entityType: entityType,
            changeType: replaceSelectionChangeTypes.SET
          });

          if (editorState.getCurrentContent() === updatedEditorState.getCurrentContent()) {
            return editorState;
          }

          return updatedEditorState;
        },
        render: function render() {
          var transformedEditorState = this.transformEditorState();
          return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({}, this.props, {
            ref: "child",
            editorState: transformedEditorState
          }));
        }
      });
    }

    return WrappingComponent;
  };
});
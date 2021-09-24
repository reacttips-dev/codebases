'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createContext } from 'react';
export var FlowEditorContext = /*#__PURE__*/createContext({
  stagedTrigger: null,
  setStagedTrigger: function setStagedTrigger() {},
  stagedAction: null,
  setStagedAction: function setStagedAction() {}
});
FlowEditorContext.displayName = 'FlowEditorContext';
FlowEditorContext.Provider.propTypes = {
  value: PropTypes.shape({
    stagedTrigger: PropTypes.object.isRequired,
    setStagedTrigger: PropTypes.func.isRequired,
    stagedAction: PropTypes.object.isRequired,
    setStagedAction: PropTypes.func.isRequired
  })
};
export var FlowEditorProvider = FlowEditorContext.Provider;
export var FlowEditorConsumer = FlowEditorContext.Consumer;
export var withFlowEditorContext = function withFlowEditorContext(WrappedComponent) {
  return function (props) {
    return /*#__PURE__*/_jsx(FlowEditorConsumer, {
      children: function children(context) {
        return /*#__PURE__*/_jsx(WrappedComponent, Object.assign({}, props, {}, context));
      }
    });
  };
};
export default FlowEditorContext;
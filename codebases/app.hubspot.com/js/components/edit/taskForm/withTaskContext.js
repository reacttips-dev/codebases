'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import TaskContext from './TaskContext';
export default function withTaskContext(Component) {
  return function (props) {
    return /*#__PURE__*/_jsx(TaskContext.Consumer, {
      children: function children(taskContext) {
        return /*#__PURE__*/_jsx(Component, Object.assign({}, props, {
          taskContext: taskContext
        }));
      }
    });
  };
}
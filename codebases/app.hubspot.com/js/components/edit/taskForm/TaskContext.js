'use es6';

import { createContext } from 'react';
var TaskContext = /*#__PURE__*/createContext({
  task: null,
  templateData: null,
  updateTaskContext: function updateTaskContext() {}
});
TaskContext.displayName = 'TaskContext';
export default TaskContext;
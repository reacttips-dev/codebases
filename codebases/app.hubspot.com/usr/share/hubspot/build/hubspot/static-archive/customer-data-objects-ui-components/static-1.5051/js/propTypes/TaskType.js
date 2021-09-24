'use es6';

import TaskRecord from 'customer-data-objects/task/TaskRecord';
import PropTypes from 'prop-types';
var TaskType = PropTypes.instanceOf(TaskRecord);
export default TaskType;
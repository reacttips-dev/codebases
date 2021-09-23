import dateFormatter from './dateFormatter';
import joinBodyArray from './joinBodyArray';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export default function (_ref) {
  var _ref$properties = _ref.properties,
      taskType = _ref$properties.taskType,
      taskDueDate = _ref$properties.taskDueDate;
  var taskTypeTitleCase = taskType ? text("nav.search.task.type." + taskType, {
    defaultValue: taskType.charAt(0) + taskType.substring(1).toLowerCase()
  }) : '';
  var dueDateString = taskDueDate ? text('nav.search.task.dueDateNew', {
    defaultValue: 'Due date: {{ formattedDueDate }}',
    formattedDueDate: dateFormatter.format(parseInt(taskDueDate, 10))
  }) : '';
  var toJoin = [taskTypeTitleCase, dueDateString];
  return joinBodyArray(toJoin);
}
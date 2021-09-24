'use es6';

import withTaskContext from './withTaskContext';
import TaskPanelContent from './TaskPanelContent';
var TaskPanelContentContainer = withTaskContext(TaskPanelContent);
TaskPanelContentContainer.propTypes = TaskPanelContent.propTypes;
export default TaskPanelContentContainer;
import StateHelper from 'helpers/state-helper';
import Workspace from './workspace-dynamic-loader';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const getProject = (lessonKey) =>
    StateHelper.getProjectByLessonKey(state, lessonKey);

  return {
    getProject,
  };
};

export default connect(mapStateToProps)(Workspace);

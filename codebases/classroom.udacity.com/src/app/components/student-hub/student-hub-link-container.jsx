import React, { PureComponent } from 'react';
import {
  selectStudentHubHasUnreads,
  selectStudentHubMentionsCount,
} from 'helpers/state-helper/_services-state-helper';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import StudentHubLink from './student-hub-link';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  const nanodegreeKey = _.get(ownProps, 'nanodegreeKey', '');
  const userId = _.get(SettingsHelper.State.getUser(state), 'id');

  return {
    hasUnreads: selectStudentHubHasUnreads(state),
    mentionsCount: selectStudentHubMentionsCount(state),
    studentInfo: { userId, nanodegreeKey },
  };
};

export class StudentHubLinkContainer extends PureComponent {
  static displayName = 'components/student-hub-link-container';

  static propTypes = {
    view: PropTypes.string,
    hasUnreads: PropTypes.bool,
    mentionsCount: PropTypes.bool,
    studentInfo: PropTypes.object,
  };

  static defaultProps = {
    view: 'dashboard',
  };

  render() {
    const { hasUnreads, mentionsCount, studentInfo, view } = this.props;

    return (
      <StudentHubLink
        url={CONFIG.studentHubWebUrl}
        view={view}
        hasUnreads={hasUnreads}
        mentionsCount={mentionsCount}
        studentInfo={studentInfo}
      />
    );
  }
}

export default connect(mapStateToProps, null)(StudentHubLinkContainer);

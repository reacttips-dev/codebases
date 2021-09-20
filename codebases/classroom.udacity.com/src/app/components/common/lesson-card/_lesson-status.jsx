import ClassroomPropTypes from 'components/prop-types';
import DateHelper from 'helpers/date-helper';
import LabHelper from 'helpers/lab-helper';
import NodeHelper from 'helpers/node-helper';
import ProgressBar from './_progress-bar';
import ProjectStatus from './_project-status';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import { __ } from 'services/localization-service';
import styles from './_lesson-status.scss';
import { withProps } from 'recompose';

export class LessonStatus extends React.Component {
  static displayName = 'common/lesson-card/_lesson-status';

  static propTypes = {
    lesson: ClassroomPropTypes.lesson.isRequired,
    assessment: PropTypes.oneOfType([
      ClassroomPropTypes.lab,
      ClassroomPropTypes.project,
    ]),
  };

  static defaultProps = {
    lesson: {},
  };

  _renderProgressBar() {
    return (
      <ProgressBar
        width={80}
        height={4}
        percentage={Math.round(
          NodeHelper.getCompletionPercentage(this.props.lesson)
        )}
      />
    );
  }

  _renderAssessmentProgress = () => {
    const { assessment, lesson } = this.props;
    if (DateHelper.pastToday(assessment.due_at)) {
      return <p className={styles['past-due']}>{__('Not Started')}</p>;
    } else {
      if (NodeHelper.getCompletionPercentage(lesson) > 0) {
        return <p className={styles['started']}>{__('Started')}</p>;
      } else {
        return <p className={styles['not-started']}>{__('Not Started')}</p>;
      }
    }
  };

  _renderLabStatus() {
    const {
      lesson: { lab },
    } = this.props;

    if (LabHelper.reviewCompleted(lab)) {
      return <p className={styles['completed']}>{__('Completed')}</p>;
    } else {
      return this._renderAssessmentProgress(lab);
    }
  }

  render() {
    const { assessment, lesson } = this.props;
    const assessmentType = _.get(assessment, 'semantic_type');

    if (assessmentType === SemanticTypes.LAB) {
      return this._renderLabStatus();
    }

    if (lesson && assessmentType === SemanticTypes.PROJECT) {
      return (
        <ProjectStatus
          project={lesson.project}
          renderAssessmentProgress={this._renderAssessmentProgress}
        />
      );
    }

    return this._renderProgressBar();
  }
}

export default withProps(({ lesson }) => ({
  assessment: lesson.project || lesson.lab,
}))(LessonStatus);

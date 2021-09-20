import { CareerServiceConsumer } from 'components/career-services/_context';
import ClassroomPropTypes from 'components/prop-types';
import ProjectHelper from 'helpers/project-helper';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_lesson-status.scss';

export default class ProjectStatus extends React.PureComponent {
  static displayName = 'common/lesson-card/_project-status';

  static propTypes = {
    project: ClassroomPropTypes.project.isRequired,
    renderAssessmentProgress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    project: {},
  };

  _renderProjectStatus(isCareerService) {
    const { project, renderAssessmentProgress } = this.props;
    if (isCareerService) {
      return null;
    }
    if (
      !ProjectHelper.isSubmitted(project) ||
      ProjectHelper.isCanceled(project)
    ) {
      return renderAssessmentProgress(project);
    } else {
      const url = ProjectHelper.getCurrentSubmissionUrl(project);

      if (ProjectHelper.isErred(project)) {
        return (
          <a className={styles['erred']} href={url}>
            {__('Submission error')}
          </a>
        );
      } else if (ProjectHelper.isCompleted(project)) {
        return (
          <a className={styles['completed']} href={url}>
            {__('Completed')}
          </a>
        );
      } else if (ProjectHelper.isFailed(project)) {
        return (
          <a className={styles['failed']} href={url}>
            {__('Needs your attention')}
          </a>
        );
      } else {
        return <p className={styles['in-review']}>{__('In Review')}</p>;
      }
    }
  }

  render() {
    return (
      <CareerServiceConsumer>
        {(isCareerService) => this._renderProjectStatus(isCareerService)}
      </CareerServiceConsumer>
    );
  }
}

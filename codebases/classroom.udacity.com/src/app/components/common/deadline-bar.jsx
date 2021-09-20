import ClassroomPropTypes from 'components/prop-types';
import LabHelper from 'helpers/lab-helper';
import NodeHelper from 'helpers/node-helper';
import ProjectHelper from 'helpers/project-helper';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import { __ } from 'services/localization-service';
import styles from './deadline-bar.scss';

const getProjectDetails = (project) => {
  if (ProjectHelper.isCompleted(project)) {
    return {
      styleName: 'project-icon-completed',
      text: __('Project Completed'),
    };
  } else if (ProjectHelper.isSubmitted(project)) {
    return {
      styleName: 'project-icon-submitted',
      text: __('Project Submitted'),
    };
  }
  return {
    styleName: 'project-icon-not-started',
    text: __('Project Not Started'),
  };
};

const getLabDetails = (lab) => {
  if (LabHelper.isPassed(lab)) {
    return {
      styleName: 'lab-icon-completed',
      text: __('Lab Passed'),
    };
  }

  return {
    styleName: 'lab-icon-not-passed',
    text: __('Lab Not Passed'),
  };
};

const themes = {
  [SemanticTypes.PROJECT]: {
    getDetails: getProjectDetails,
    title: __('Projects'),
  },
  [SemanticTypes.LAB]: {
    getDetails: getLabDetails,
    title: __('Labs'),
  },
};

@cssModule(styles)
export default class DeadlineBar extends React.Component {
  static displayName = 'common/deadline-bar';

  static propTypes = {
    labs: PropTypes.arrayOf(ClassroomPropTypes.lab),
    projects: PropTypes.arrayOf(ClassroomPropTypes.project),
    showProgress: PropTypes.bool,
    text: PropTypes.node,
    nanodegree: ClassroomPropTypes.nanodegree,
  };

  static contextTypes = {
    course: ClassroomPropTypes.course,
    part: ClassroomPropTypes.part,
  };

  static defaultProps = {
    labs: [],
    projects: [],
    showProgress: true,
    text: '',
  };

  _renderProgressDots(assessments) {
    if (assessments.length > 0) {
      const assessmentTheme = themes[_.first(assessments).semantic_type];
      const assessmentIcons = _.map(assessments, (assessment) => {
        const assessmentDetails = assessmentTheme.getDetails(assessment);
        return (
          <li
            key={assessment.key}
            styleName={assessmentDetails.styleName}
            title={assessmentDetails.text}
          >
            {assessmentDetails.text}
          </li>
        );
      });

      return (
        <div styleName="inner-content-container" key={assessmentTheme.title}>
          <div styleName="content-context-label">
            <h2 styleName="title">{assessmentTheme.title}</h2>
            {assessmentIcons ? <ol>{assessmentIcons}</ol> : null}
          </div>
        </div>
      );
    }
  }

  _renderCompletionPercentage() {
    const { part, course } = this.context;
    const completionPercentage = Math.ceil(
      NodeHelper.getCompletionPercentage(course || part)
    );

    return (
      <div styleName="inner-content-container" key="completion-percentage">
        <div styleName="content-context-label">
          <h2 styleName="title">
            {__('<%= completionPercentage %>% viewed', {
              completionPercentage,
            })}
          </h2>
        </div>
      </div>
    );
  }

  render() {
    const { showProgress, text, labs, projects } = this.props;
    const validProjects = _.filter(projects, 'key'); // Needed because the context can inject an empty {} project
    const completionPercentage =
      labs.length && validProjects.length
        ? null
        : this._renderCompletionPercentage();
    return (
      <div styleName="container">
        <div styleName="content">
          <p styleName="large-info">{text}</p>
          {showProgress
            ? [
                completionPercentage,
                this._renderProgressDots(labs),
                this._renderProgressDots(validProjects),
              ]
            : null}
        </div>
      </div>
    );
  }
}

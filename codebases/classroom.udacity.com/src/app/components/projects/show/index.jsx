import AssessmentWrapper from 'components/common/assessments';
import { CareerServiceConsumer } from 'components/career-services/_context';
import ClassroomPropTypes from 'components/prop-types';
import { ImageLoader } from '@udacity/veritas-components';
import Project from './_project';
import PropTypes from 'prop-types';
import styles from './index.scss';
import { trackInitialPageLoad } from 'helpers/performance-helper';

@cssModule(styles)
export default class ProjectShow extends React.Component {
  static displayName = 'projects/show/index';

  static propTypes = {
    project: ClassroomPropTypes.project,
  };

  static contextTypes = {
    location: PropTypes.object.isRequired,
    lesson: ClassroomPropTypes.lesson.isRequired,
    nanodegree: ClassroomPropTypes.nanodegree.isRequired,
  };

  static childContextTypes = {
    project: PropTypes.object,
  };

  state = {
    showNextDialogModal: false,
  };

  getChildContext() {
    return {
      project: this.props.project,
    };
  }

  componentDidUpdate() {
    trackInitialPageLoad('project');
  }

  handleToggleNextDialogModal = () => {
    this.setState({ showNextDialogModal: !this.state.showNextDialogModal });
  };

  _renderProject() {
    const {
      project: { image, title },
    } = this.props;
    const { showNextDialogModal } = this.state;

    return (
      <div>
        {image ? (
          <div styleName="image">
            <ImageLoader src={_.get(image, 'url')}>
              <div className={styles['image-loader__title']}>{title}</div>
            </ImageLoader>
          </div>
        ) : null}

        <div styleName="project-container">
          <Project
            {..._.omit(this.props, ['styles'])}
            showNextDialogModal={showNextDialogModal}
            handleToggleNextDialogModal={this.handleToggleNextDialogModal}
          />
        </div>
      </div>
    );
  }

  render() {
    const { project, nanodegree, course } = this.props;
    const { lesson } = this.context;

    return (
      <CareerServiceConsumer>
        {(isCareerService) => (
          <AssessmentWrapper
            assessment={project}
            lesson={lesson}
            nanodegree={nanodegree}
            course={course}
            project={project}
            onFeedbackFlow={this.handleToggleNextDialogModal}
            isCareerService={isCareerService}
          >
            {this._renderProject()}
          </AssessmentWrapper>
        )}
      </CareerServiceConsumer>
    );
  }
}

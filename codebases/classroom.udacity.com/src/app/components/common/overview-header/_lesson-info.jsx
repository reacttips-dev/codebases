import ButtonLink from 'components/common/button-link';
import { CLASSROOM_CTA_CLICKED } from 'constants/analytics';
import ClassroomPropTypes from 'components/prop-types';
import Hamburger from 'components/common/hamburger';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import RouteHelper from 'helpers/route-helper';
import SemanticTypes from 'constants/semantic-types';
import { __ } from 'services/localization-service';
import styles from './index.scss';

@cssModule(styles)
export default class LessonInfo extends React.Component {
  static displayName = 'common/overview-header/_lesson-info';

  static propTypes = {
    lastViewedLesson: ClassroomPropTypes.lesson.isRequired,
    lastViewedModule: ClassroomPropTypes.node,
    lessons: PropTypes.arrayOf(ClassroomPropTypes.lesson).isRequired,
    deadlineBar: PropTypes.element.isRequired,
    isHeaderCollapsed: PropTypes.bool,
  };

  static defaultProps = {
    deadlineBar: null,
    isHeaderCollapsed: false,
  };

  static contextTypes = {
    root: ClassroomPropTypes.node.isRequired,
    part: ClassroomPropTypes.part,
    router: PropTypes.object,
  };

  _getLessonPath(lesson) {
    const { root, part } = this.context;
    const { lastViewedModule } = this.props;

    if (root.semantic_type === SemanticTypes.NANODEGREE) {
      return RouteHelper.nanodegreeConceptPath({
        nanodegreeKey: root.key,
        partKey: part.key,
        moduleKey: _.get(lastViewedModule, 'key'),
        lessonKey: _.get(lesson, 'key'),
        conceptKey: 'last-viewed',
      });
    } else if (root.semantic_type === SemanticTypes.PART) {
      return RouteHelper.paidCourseConceptPath({
        courseKey: root.key,
        lessonKey: lesson.key,
        conceptKey: 'last-viewed',
      });
    } else {
      return RouteHelper.courseConceptPath({
        courseKey: root.key,
        lessonKey: lesson.key,
        conceptKey: 'last-viewed',
      });
    }
  }

  _renderButton() {
    const { lastViewedLesson, lessons } = this.props;
    const lessonStarted = !!NodeHelper.getCompletionPercentage(
      lastViewedLesson
    );
    const lessonDisplayNumber =
      NodeHelper.getPosition(lessons, lastViewedLesson) + 1;
    return (
      <div>
        <ButtonLink
          variant="primary"
          to={this._getLessonPath(lastViewedLesson)}
          trackingEventName={CLASSROOM_CTA_CLICKED}
          trackingOptions={{
            message: lessonStarted
              ? __('Begin Learning')
              : __('Resume Learning'),
          }}
          label={
            lessonStarted
              ? __('Resume Lesson <%= lessonDisplayNumber %>', {
                  lessonDisplayNumber,
                })
              : __('Begin Lesson <%= lessonDisplayNumber %>', {
                  lessonDisplayNumber,
                })
          }
        />
      </div>
    );
  }

  // (dcwither) we have to set the class deeply because compose doesn't work for nested classes
  _getStyleWithSuffix(styleName) {
    const { isHeaderCollapsed } = this.props;
    if (isHeaderCollapsed) {
      return `${styleName}-small`;
    } else {
      return styleName;
    }
  }

  render() {
    const { root } = this.context;

    const title = __(root.title);

    return (
      <div styleName="container">
        <div styleName={this._getStyleWithSuffix('lesson-info')}>
          <Hamburger />
          <div styleName="title-container">
            <h3 styleName={this._getStyleWithSuffix('lesson-title')}>
              {title}
            </h3>
          </div>
          {this._renderButton()}
        </div>
        <div styleName={this._getStyleWithSuffix('deadline-bar')}>
          {this.props.deadlineBar}
        </div>
      </div>
    );
  }
}

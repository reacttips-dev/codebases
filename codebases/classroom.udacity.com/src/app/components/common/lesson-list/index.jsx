import ClassroomPropTypes from 'components/prop-types';
import LessonHelper from 'helpers/lesson-helper';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { scrollTargetId } from 'components/common/lesson-card';
import withScrollIntoView from 'decorators/scroll-into-view';

export class LessonList extends React.Component {
  static displayName = 'common/lesson-list';

  static propTypes = {
    disabled: PropTypes.bool,
    lastViewedLessonKey: PropTypes.string,
    lessons: PropTypes.arrayOf(ClassroomPropTypes.lesson).isRequired,
    pathByLessonKey: PropTypes.objectOf(PropTypes.string).isRequired,
    scrollIdIntoView: PropTypes.func.isRequired,
    enableScrollIntoView: PropTypes.bool,
    renderLesson: PropTypes.func.isRequired,
    isStatic: PropTypes.bool,
  };

  static defaultProps = {
    router: PropTypes.object,
    disabled: false,
    enableScrollIntoView: true,
    isStatic: false,
  };

  componentDidMount() {
    const {
      disabled,
      lessons,
      enableScrollIntoView,
      scrollIdIntoView,
    } = this.props;
    const lastViewedLesson = _.find(lessons, {
      key: this._getActiveLessonKey(),
    });

    if (enableScrollIntoView && !disabled && lastViewedLesson) {
      scrollIdIntoView(scrollTargetId(lastViewedLesson));
    }
  }

  _getActiveLessonKey() {
    const { lastViewedLessonKey, lessons } = this.props;
    return lastViewedLessonKey || _.get(lessons, [0, 'key']);
  }

  _getLessonCards() {
    const {
      lessons,
      onLessonClick,
      pathByLessonKey,
      disabled,
      renderLesson,
      isStatic,
      isGraduated,
    } = this.props;

    const activeLessonKey = this._getActiveLessonKey();

    return _.map(lessons, (lesson, index) => {
      const isActive = !disabled && lesson.key === activeLessonKey;
      const isIncompleteProject =
        lesson.is_project_lesson && !LessonHelper.isCompleted(lesson);
      const isUngraduatedStaticAccess = isStatic && !isGraduated;

      return (
        <li key={index}>
          {renderLesson({
            index,
            defaultExpanded: isActive || !LessonHelper.isCompleted(lesson),
            isDisabled:
              disabled || (isIncompleteProject && isUngraduatedStaticAccess),
            lesson,
            onLessonClick,
            isStatic,
            isGraduated,
            path: pathByLessonKey[lesson.key],
            tag:
              (lesson.lab && __('lab')) ||
              (lesson.project && __('project')) ||
              __('lesson <%= lessonNumber %>', { lessonNumber: index + 1 }),
          })}
        </li>
      );
    });
  }

  render() {
    return <ol>{this._getLessonCards()}</ol>;
  }
}

export default withScrollIntoView(LessonList);

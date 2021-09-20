import AppError from 'errors/app-error';
import ClassroomPropTypes from 'components/prop-types';
import LessonHelper from 'helpers/lesson-helper';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import NodeHelper from 'helpers/node-helper';
import { PartLockedReason } from 'constants/part';
import PropTypes from 'prop-types';
import RouteHelper from 'helpers/route-helper';
import RouteMixin from 'mixins/route-mixin';
import SemanticTypes from 'constants/semantic-types';
import StateHelper from 'helpers/state-helper';
import UiHelper from 'helpers/ui-helper';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';

export function mapStateToProps(state, ownProps) {
  const {
    lessons,
    params: { lessonKey },
  } = ownProps;
  const lesson = StateHelper.getLesson(state, lessonKey, null);
  if (!lesson) {
    throw new AppError('Lesson not found');
  }

  const props = {
    lesson,
    concepts: lesson.concepts || [],
    project: lesson.project,
    nextLesson: NodeHelper.getNext(lessons, lesson) || null,
    isFetching: UiHelper.State.isFetchingLesson(state),
    lab: StateHelper.getLab(state, _.get(lesson, 'lab.key')),
  };

  return props;
}

const mapDispatchToProps = actionsBinder('fetchLesson', 'createErrorAlert');

function getErrorMessage(partLockReason) {
  switch (partLockReason) {
    case PartLockedReason.PREORDER:
    case PartLockedReason.DATE_LOCKED:
      return __('This content is not yet available');
    case PartLockedReason.TERM_NOT_STARTED:
      return __('This content is not yet available.');
    case PartLockedReason.TERM_NOT_PURCHASED:
      return __('This content has not yet been purchased.');
    case PartLockedReason.PROGRESS_LOCKED_SUBMISSION:
      return __(
        'This content cannot be accessed until all projects in prior parts are submitted.'
      );
    case PartLockedReason.PROGRESS_LOCKED_COMPLETION:
      return __(
        'This content cannot be accessed until all projects in prior parts are completed.'
      );
    case PartLockedReason.EXPIRED_PAID_TRIAL:
      return __('This limited trial content has expired.');
    case PartLockedReason.STATIC_ACCESS_EXPIRED:
      return __('Access to this content has ended.');
  }
}

export const LessonContainer = createReactClass({
  displayName: 'lessons/lesson-container',

  propTypes: {
    /* Redux */
    concepts: PropTypes.arrayOf(ClassroomPropTypes.concept).isRequired,
    isFetching: PropTypes.bool.isRequired,
    lesson: ClassroomPropTypes.lesson.isRequired,
    nextLesson: ClassroomPropTypes.lesson,
    project: ClassroomPropTypes.project,
    lab: ClassroomPropTypes.lab,
    part: ClassroomPropTypes.part,
    fetchLesson: PropTypes.func,
    createErrorAlert: PropTypes.func,
  },

  contextTypes: {
    root: PropTypes.object,
    router: PropTypes.object,
  },

  childContextTypes: {
    lesson: ClassroomPropTypes.lesson,
    lab: ClassroomPropTypes.lab,
    project: ClassroomPropTypes.project,
  },

  mixins: [RouteMixin],

  getDefaultProps() {
    return {
      nextModule: null,
      fetchLesson: _.noop,
      createErrorAlert: _.noop,
    };
  },

  getChildContext() {
    const { lesson, lab } = this.props;

    return {
      lesson,
      lab,
      project: lesson.project,
    };
  },

  componentDidMount() {
    this.validateRouteNode(this.props.lesson, this.context.root);
    this._validatePartUnlocked(this.props);
    this._refreshLesson(this.props);
  },

  componentWillReceiveProps(newProps) {
    const { root } = this.context;
    if (
      SemanticTypes.isNanodegree(this.context.root) &&
      newProps.part.key !== this.props.part.key
    ) {
      this._validatePartUnlocked(newProps);
    }
    if (newProps.params.lessonKey !== this.props.params.lessonKey) {
      this.validateRouteNode(newProps.lesson, this.context.root);
      this._refreshLesson(newProps, root);
    }
  },

  _validatePartUnlocked(props) {
    const { part, createErrorAlert } = props;
    const { root, router } = this.context;

    if (
      SemanticTypes.isNanodegree(this.context.root) &&
      part.locked_reason !== PartLockedReason.NOT_LOCKED
    ) {
      createErrorAlert(getErrorMessage(part.locked_reason));
      router.push(
        RouteHelper.partPath({ nanodegreeKey: root.key, partKey: part.key })
      );
    }
  },

  _refreshLesson(props) {
    const { lesson, part } = props;
    const { id } = lesson;
    const { root, router } = this.context;
    const isStatic = NanodegreeHelper.isStatic(root);
    const isGraduated = NanodegreeHelper.isGraduated(root);
    const isIncompleteProject =
      lesson.is_project_lesson && !LessonHelper.isCompleted(lesson);
    const isUngraduatedStaticAccess = isStatic && !isGraduated;
    if (isIncompleteProject && isUngraduatedStaticAccess) {
      router.push(
        RouteHelper.partPath({ nanodegreeKey: root.key, partKey: part.key })
      );
    }
    this.props.fetchLesson(id, root);
  },

  render() {
    /* NOTE: We don't handle isFetching here because we don't want the sidebar in concepts/show
     to re-render when we switch to a concept in a different lesson. Instead, concepts/show will
     handle showing the loading indicator for isFetching */
    return React.cloneElement(
      this.props.children,
      _.omit(this.props, 'children')
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LessonContainer);

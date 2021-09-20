import Actions from 'actions';
import AsyncSurveyModal from 'components/survey/async-survey-modal';
import AtomFeedbackWrapper from 'components/content-feedback/atom-feedback-wrapper';
import ClassroomPropTypes from 'components/prop-types';
import Header from './_header';
import Layout from 'components/common/layout';
import LessonHelper from 'helpers/lesson-helper';
import LessonSidebar from 'components/common/lesson-sidebar';
import { Loading } from '@udacity/veritas-components';
import Main from './_main';
import NextLessonDialog from './_next-lesson-dialog';
import NextModuleDialog from './_next-module-dialog';
import NextPartDialog from './_next-part-dialog';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import RelativePathHelper from 'helpers/relative-path-helper';
import RouteMixin from 'mixins/route-mixin';
import SemanticTypes from 'constants/semantic-types';
import UiHelper from 'helpers/ui-helper';
import UserHelper from 'helpers/user-helper';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import withSurvey from 'decorators/with-survey';

const mapStateToProps = (state) => {
  const { isLoadingLessonPreview, inLessonPreviewMode } = state.lessonPreview;

  return {
    isAuthenticated: UserHelper.State.isAuthenticated(state),
    isSearchVisible: UiHelper.State.isSearchVisible(state),
    isVersionPickerVisible: UiHelper.State.isVersionPickerVisible(state),
    isLoadingLessonPreview,
    inLessonPreviewMode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateConceptLastViewedAt: (root, concept, hierarchy) => {
    dispatch(
      Actions.updateConceptLastViewedAt({
        rootKey: root.key,
        rootId: root.id,
        nodeKey: concept.key,
        nodeId: concept.id,
        lastViewedAt: new Date(),
        hierarchy,
      })
    );
  },
  updatePreviewLessonLastViewedConcept: (lessonKey, conceptKey) => {
    dispatch(
      Actions.updatePreviewLessonLastViewedConcept(lessonKey, conceptKey)
    );
  },
  previewLessonComplete: () => {
    dispatch(Actions.previewLessonComplete());
  },
});

export const ShowConcept = createReactClass({
  displayName: 'concepts/show/index',

  propTypes: {
    part: ClassroomPropTypes.part,
    nanodegree: ClassroomPropTypes.nanodegree,
    lesson: PropTypes.object.isRequired,
    concepts: PropTypes.array.isRequired,
    concept: PropTypes.object.isRequired,
    atoms: PropTypes.array.isRequired,
    nextLesson: ClassroomPropTypes.lesson,
    nextModule: ClassroomPropTypes.module,
    nextProject: ClassroomPropTypes.project,
    nextLab: ClassroomPropTypes.lab,
    nextPart: ClassroomPropTypes.part,
    isFetching: PropTypes.bool,
    isSearchVisible: PropTypes.bool.isRequired,
    isVersionPickerVisible: PropTypes.bool.isRequired,
    surveyEnabled: PropTypes.bool,
    surveyStatus: PropTypes.object,
    updateSurveyStatus: PropTypes.func,
    mentor: ClassroomPropTypes.mentor,
    isStudentHubEnabled: PropTypes.bool,

    /* Redux */
    isAuthenticated: PropTypes.bool,

    /* connectClassroomShell */
    toggleSidebar: PropTypes.func,

    isLoadingLessonPreview: PropTypes.bool,
    inLessonPreviewMode: PropTypes.bool,
    updatePreviewLessonLastViewedConcept: PropTypes.func,
    previewLessonComplete: PropTypes.func,
  },

  contextTypes: {
    root: PropTypes.object,
    router: PropTypes.object,
    part: PropTypes.object,
    location: PropTypes.object,
  },

  mixins: [RouteMixin],

  defaultProps: {
    lesson: {},
    concept: {},
  },

  getInitialState() {
    return {
      showNextLesson: false,
      showNextModule: false,
      showNextProject: false,
      showNextPart: false,
    };
  },

  componentDidMount() {
    this._updateConceptLastViewedAt(this.props.concept);

    if (this.props.inLessonPreviewMode) {
      this.props.updatePreviewLessonLastViewedConcept(
        this.props.lesson.key,
        this.props.concept.key
      );
    }

    if (this.props.isLoadingLessonPreview) {
      this.props.previewLessonComplete();
    }
  },

  componentDidUpdate(prevProps) {
    const prevUserState = _.get(prevProps, ['concept', 'user_state']);
    const currentUserState = _.get(this.props, ['concept', 'user_state']);
    const prevConceptKey = _.get(prevProps, ['concept', 'key']);
    const currentConceptKey = _.get(this.props, ['concept', 'key']);
    const currentLessonKey = _.get(this.props, ['lesson', 'key']);

    // Deep links start off without user_state. When it gets loaded, call
    // _updateConceptLastViewedAt
    if (
      currentConceptKey !== prevConceptKey ||
      (!prevUserState && currentUserState)
    ) {
      this._updateConceptLastViewedAt(this.props.concept);

      if (this.props.inLessonPreviewMode) {
        this.props.updatePreviewLessonLastViewedConcept(
          currentLessonKey,
          currentConceptKey
        );
      }
    }

    if (this.props.isLoadingLessonPreview) {
      this.props.previewLessonComplete();
    }
  },

  // Use enrollment type to determine if this part is required for graduation.
  // If required for graduation, it will be included in progress counts
  _isPartRequired(nanodegree, part) {
    const partType = _.get(part, 'part_type');
    // Null enrollment will be treated like STANDARD (i.e. only Core types will
    // be counted)
    if (_.get(nanodegree, ['enrollment', 'product_variant']) === 'PLUS') {
      return partType === 'Core' || partType === 'Career';
    } else {
      return partType === 'Core';
    }
  },

  // Fetch keys of all nodes that need to increment their completed_count
  // in _aggregated_state.  Concepts are the leaves of aggregation, so do
  // not increment, but are included in the hierarchy so lessons can accurately
  // record the last_viewed_child_key attribute.
  //
  // The nanodegree only increments if the Part is required
  // for graduation.  Omitting it from the hash causes it to not increment.
  // This works ok for courses or nanodegrees: if the values aren't present
  // in params, there is no corresponding node to increment counts
  _getHierarchy(concept, params, nanodegree, part) {
    let hierarchy;
    if (this._isPartRequired(nanodegree, part)) {
      hierarchy = _.pick(params, [
        'lessonKey',
        'courseKey',
        'moduleKey',
        'partKey',
        'nanodegreeKey',
      ]);
    } else {
      hierarchy = _.pick(params, [
        'lessonKey',
        'courseKey',
        'moduleKey',
        'partKey',
      ]);
    }
    if (_.get(concept, ['user_state', 'last_viewed_at'])) {
      // previously viewed.  Do not increment counts in parents
      return { ...hierarchy, conceptKey: concept.key };
    } else {
      // first view of this concept.  Incrememnt counts in parent hierarchy
      return { ...hierarchy, conceptKey: concept.key, increment: true };
    }
  },

  _updateConceptLastViewedAt(concept) {
    if (!concept.user_state) {
      // user_state needed to properly call updateConceptLastViewedAt
      return;
    }
    const { root } = this.context;
    const {
      isAuthenticated,
      params,
      part,
      nanodegree,
      updateConceptLastViewedAt,
    } = this.props;

    if (concept && !_.isEmpty(concept) && isAuthenticated) {
      const hierarchy = this._getHierarchy(concept, params, nanodegree, part);
      updateConceptLastViewedAt(root, concept, hierarchy);
    }
  },

  _gotoConcept(concept) {
    if (concept) {
      const { lesson } = this.props;
      if (SemanticTypes.isPart(this.props.course)) {
        this.context.router.push(
          this.paidCourseConceptPath({
            lessonKey: lesson.key,
            conceptKey: concept.key,
          })
        );
      } else {
        this.context.router.push(
          this.conceptPath({
            lessonKey: lesson.key,
            conceptKey: concept.key,
          })
        );
      }
    }
  },

  _getNextConcept() {
    const { concepts, concept } = this.props;

    return NodeHelper.getNext(concepts, concept);
  },

  _getNextNode() {
    const {
      nextLesson,
      nextModule,
      nextProject,
      nextPart,
      nextLab,
      lesson,
      inLessonPreviewMode,
    } = this.props;
    const nextConcept = this._getNextConcept();

    if (inLessonPreviewMode && !nextConcept) {
      return null;
    }

    // Don't navigate to the project if the CD has decided that the workspace
    // project is the only project the student can see in this lesson.
    if (LessonHelper.isDisplayWorkspaceProjectOnly(lesson)) {
      return _.first(
        _.compact([nextConcept, nextLab, nextLesson, nextModule, nextPart])
      );
    } else {
      return _.first(
        _.compact([
          nextConcept,
          nextProject,
          nextLab,
          nextLesson,
          nextModule,
          nextPart,
        ])
      );
    }
    // Return the first one that exists
  },

  handleNextLessonDialogHide() {
    this.setState({
      showNextLesson: false,
    });
  },

  handleNextModuleDialogHide() {
    this.setState({
      showNextModule: false,
    });
  },

  handleNextPartDialogHide() {
    this.setState({
      showNextPart: false,
    });
  },

  handleNext() {
    const { location } = this.context;
    const nextNode = this._getNextNode();

    if (SemanticTypes.isConcept(nextNode)) {
      this._gotoConcept(nextNode);
    } else if (SemanticTypes.isLesson(nextNode)) {
      this.setState({
        showNextLesson: true,
      });
    } else if (SemanticTypes.isModule(nextNode)) {
      this.setState({
        showNextModule: true,
      });
    } else if (SemanticTypes.isProject(nextNode)) {
      this.context.router.push(this.getProjectPath({}));
    } else if (SemanticTypes.isLab(nextNode)) {
      this.context.router.push(
        RelativePathHelper.getLabPathForLesson(location.pathname)
      );
    } else if (SemanticTypes.isPart(nextNode)) {
      const { root } = this.context;
      if (SemanticTypes.isNanodegree(root)) {
        this.setState({
          showNextPart: true,
        });
      } else {
        if (this.props.inLessonPreviewMode) {
          this.context.router.push(this.lessonPreviewPath());
        } else {
          this.context.router.push(this.homePath());
        }
      }
    } else {
      if (this.props.inLessonPreviewMode) {
        this.context.router.push(this.lessonPreviewPath());
      } else {
        this.context.router.push(this.homePath());
      }
    }
  },

  render() {
    const { showNextLesson, showNextModule, showNextPart } = this.state;

    const {
      lesson,
      concept,
      atoms,
      nextLesson,
      nextModule,
      nextPart,
      isFetching,
      isSearchVisible,
      isVersionPickerVisible,
      surveyEnabled,
      onDismissModal,
      surveyStatus,
      updateSurveyStatus,
      mentor,
      isStudentHubEnabled,
      isLoadingLessonPreview,
      course,
      nanodegree,
    } = this.props;

    const { root } = this.context;
    const overlayPresent =
      surveyEnabled || isSearchVisible || isVersionPickerVisible;
    const isPaidCourse = SemanticTypes.isPart(root);

    return (
      <AtomFeedbackWrapper root={root}>
        <div>
          <Layout
            key={concept.id}
            documentTitle={NodeHelper.getTitle(root)}
            navVariant="none"
            busy={isFetching}
            header={<Header concept={concept} lesson={lesson} />}
            sidebar={
              <LessonSidebar
                activeLesson={lesson}
                activeNode={concept}
                course={course}
              />
            }
          >
            {isLoadingLessonPreview ? (
              <Loading />
            ) : (
              <Main
                concept={concept}
                atoms={atoms}
                nextNode={this._getNextNode()}
                onNext={this.handleNext}
                overlayPresent={overlayPresent}
                mentor={mentor}
                isStudentHubEnabled={isStudentHubEnabled}
              />
            )}
          </Layout>

          {nextLesson ? (
            <NextLessonDialog
              isOpen={showNextLesson}
              onRequestClose={this.handleNextLessonDialogHide}
              currentLesson={lesson}
              lesson={nextLesson}
              url={
                isPaidCourse
                  ? this.lastViewedPaidCourseConceptPath({
                      lessonKey: nextLesson.key,
                    })
                  : this.lastViewedConceptPath({ lessonKey: nextLesson.key })
              }
            />
          ) : null}

          {nextModule ? (
            <NextModuleDialog
              isOpen={showNextModule}
              onRequestClose={this.handleNextModuleDialogHide}
              module={nextModule}
              currentLesson={lesson}
              isPaidCourse={isPaidCourse}
            />
          ) : null}

          {nextPart ? (
            <NextPartDialog
              isOpen={showNextPart}
              onRequestClose={this.handleNextPartDialogHide}
              part={nextPart}
              currentLesson={lesson}
              url={
                isPaidCourse
                  ? this.paidCoursePartPath({
                      nanodegreeKey: nanodegree.key,
                      partKey: nextPart.key,
                    })
                  : this.partPath({
                      nanodegreeKey: nanodegree.key,
                      partKey: nextPart.key,
                    })
              }
            />
          ) : null}

          <AsyncSurveyModal
            surveyEnabled={surveyEnabled}
            onDismissModal={onDismissModal}
            surveyStatus={surveyStatus}
            updateSurveyStatus={updateSurveyStatus}
          />
        </div>
      </AtomFeedbackWrapper>
    );
  },
});

export default compose(
  withSurvey,
  connect(mapStateToProps, mapDispatchToProps)
)(ShowConcept);

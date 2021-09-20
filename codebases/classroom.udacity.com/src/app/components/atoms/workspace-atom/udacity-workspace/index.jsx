import ClassroomPropTypes from 'components/prop-types';
import FetchGPUModal from './modal-gpu-fetch';
import LoadingScreen from '../loading-screen';
import OutOfTime from './out-of-time';
import PropTypes from 'prop-types';
import QuestionStaticPlaceholder from 'components/atoms/quiz-atom/questions/question-static-placeholder';
import React from 'react';
import RelativePathHelper from 'helpers/relative-path-helper';
import SemanticTypes from 'constants/semantic-types';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import WelcomeGPUModal from './modal-gpu-welcome';
import WorkspaceErrorScreen from './workspace-error-screen';
import { __ } from 'services/localization-service';
import appShellStyles from './index.scss';
import labStyles from '../../../labs/_variables.scss';
import { routerShape } from 'react-router/lib/PropTypes';
import withAnalytics from 'decorators/analytics';

@withAnalytics
export default class UdacityWorkspace extends React.Component {
  static displayName = 'atoms/workspace-atom/udacity-workspace';
  static contextTypes = {
    root: PropTypes.object,
    nanodegree: ClassroomPropTypes.nanodegree,
    part: ClassroomPropTypes.part,
    module: ClassroomPropTypes.module,
    lesson: ClassroomPropTypes.lesson,
    concept: ClassroomPropTypes.concept,
    location: PropTypes.object,
    router: routerShape,
    Provisioner: PropTypes.component,
    getLinkToMostRecentFiles: PropTypes.function,
    isEmptyArchivesError: PropTypes.function,
  };

  static propTypes = {
    atom: ClassroomPropTypes.workspaceAtom.isRequired,
    onToggleFullScreen: PropTypes.func,
    trackVideoSeen: PropTypes.func, // withAnalytics
  };

  constructor(props, context) {
    super(props, context);
    const { root } = this.context;
    //Note used in network requests to locate the star and check enrollment
    this.provisionKey = {
      atomId: this.props.atom.id,
      rootId: root.id,
      rootType: root.semantic_type,
    };

    this.handleGoToLessons = this._createGoToLessonsHandler();
  }

  _hasGraduated() {
    // SXP-124: check if part.is_graduated when that field is supported
    // This is used by ureact-workspace to prevent submitting a project from a workspace
    return _.get(this.context, 'nanodegree.is_graduated', false);
  }

  _getRubricId() {
    const studentProject = this.props.getProject(this.context.lesson.key);
    return studentProject && studentProject.rubric_id;
  }

  _getAnalyticsContext() {
    const {
      nanodegree = {},
      part = {},
      module = {},
      lesson = {},
      concept = {},
    } = this.context;

    return {
      workspaceId: this.props.atom.workspace_id,
      ndKey: nanodegree.key,
      ndVersion: nanodegree.version,
      ndLocale: nanodegree.locale,
      partKey: part.key,
      moduleKey: module.key,
      lessonKey: lesson.key,
      conceptKey: concept.key,
    };
  }

  _createGoToLessonsHandler = () => {
    const { location, router } = this.context;
    const pathToLessonsIndex = RelativePathHelper.getPathForSemanticType(
      location.pathname,
      SemanticTypes.PART
    );
    return function () {
      router.push(pathToLessonsIndex);
    };
  };

  handleDownload = async (getLink) => {
    try {
      const url = await getLink({
        nebulaUrl: CONFIG.nebulaUrl,
        key: this.provisionKey,
      });
      // start downloading files, does not change the page
      window.location = url;
    } catch (e) {
      if (this.props.isEmptyArchivesError(e)) {
        e.userMessage = __('You do not have any work in this workspace.');
      } else {
        e.userMessage = __(
          'Missing a url for most recent file archive. Please contact support'
        );
      }
      throw e;
    }
  };

  handleVideoSeen = (trackingProps) => {
    const { nodeKey, trackVideoSeen } = this.props;
    trackVideoSeen({
      ...trackingProps,
      atomKey: nodeKey,
    });
  };

  render() {
    const {
      onAutoAdvance,
      atom,
      isWideLayout,
      onToggleFullScreen,
      Provisioner,
      getLinkToMostRecentFiles,
    } = this.props;

    const height = atom.enableGrading
      ? labStyles.labNavBarHeight
      : appShellStyles.appnavbarheight;

    if (!Provisioner || !getLinkToMostRecentFiles) {
      // the ureact-workspace module hasn't finished loading
      return <LoadingScreen />;
    }

    return (
      <StaticContentPlaceholder
        placeholder={
          <QuestionStaticPlaceholder
            onDownload={() => this.handleDownload(getLinkToMostRecentFiles)}
            atomName={__('workspace')}
          />
        }
      >
        <Provisioner
          ErrorComponent={WorkspaceErrorScreen}
          FetchGPUModal={FetchGPUModal}
          GPUOutOfTimeComponent={OutOfTime}
          GPUWelcomeModal={WelcomeGPUModal}
          LoadingComponent={LoadingScreen}
          context={this._getAnalyticsContext()}
          enableGrading={atom.enableGrading}
          fullScreenHeightOffset={height}
          gpuCapable={atom.gpu_capable}
          hasGraduated={this._hasGraduated()}
          isEditor={false}
          isPassedLab={this.props.isPassedLab}
          isWideLayout={isWideLayout}
          key={atom.view_id}
          nebulaUrl={CONFIG.nebulaUrl}
          onGoToLessons={this.handleGoToLessons}
          onLabAdvance={this.props.onSuccess}
          onLabGrade={this.props.onSubmit}
          onNextConcept={onAutoAdvance}
          onToggleFullScreen={onToggleFullScreen}
          projectConfig={atom.configuration}
          projectRubricId={this._getRubricId()}
          provisionKey={this.provisionKey}
          reviewsUrl={CONFIG.reviewsApiFQDN}
          selectState={(state) => state.workspaces}
          trackGrade={() => this.props.trackLabActivity('lab_clicked_grade')}
          trackReview={() => this.props.trackLabActivity('lab_clicked_review')}
          trackVideoSeen={this.handleVideoSeen}
          viewId={atom.view_id}
          scope={`${atom.workspace_id}-star`}
          provisionerId={atom.workspace_id}
        />
      </StaticContentPlaceholder>
    );
  }
}

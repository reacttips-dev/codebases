import AuthenticationService from 'services/authentication-service';
import Body from './_body';
import ButtonLink from 'components/common/button-link';
import ClassroomPropTypes from 'components/prop-types';
import ContestPlagiarismButtonContainer from './contest-plagiarism-button/contest-plagiarism-button-container';
import FreeTrialHelper from 'helpers/free-trial-helper';
import Header from 'components/common/header';
import Layout from 'components/common/layout';
import LessonSidebar from 'components/common/lesson-sidebar';
import NodeHelper from 'helpers/node-helper';
import ProjectHelper from 'helpers/project-helper';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import SubmissionStatus from 'constants/submission-status';
import TrackingButton from 'components/common/tracking-button';
import { __ } from 'services/localization-service';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from './index.scss';

@cssModule(styles)
export class AssessmentShow extends React.Component {
  static displayName = 'assessments/index';

  static propTypes = {
    assessment: PropTypes.oneOfType([
      ClassroomPropTypes.lab,
      ClassroomPropTypes.project,
    ]),
    isCareerService: PropTypes.bool,
    isCompletedFreeTrial: PropTypes.bool,
    nextPaymentUrl: PropTypes.string,
    onFeedbackFlow: PropTypes.func,
  };

  _getContent(project, isCareerService, isCompletedFreeTrial) {
    const { status, links, isError } = ProjectHelper.getProjectLinks(
      project,
      isCareerService,
      isCompletedFreeTrial
    );
    const buttons = links.map((link) => {
      switch (link.type) {
        case 'reviewsLink':
          return this._renderReviewsButton(project, link.text, link.state);
        case 'terminalLaunchForm':
          return this._renderTerminalLaunchForm(project, link.text);
        case 'checkoutLink':
          return this._renderCheckoutButton(project, link.text);
      }
    });

    return { status, buttons, isError };
  }

  _renderCheckoutButton(project, label) {
    const { nextPaymentUrl } = this.props;
    return (
      <ButtonLink
        variant="primary"
        trackingEventName="Clicked Purchase from Free Trial Project"
        trackingOptions={{ projectKey: project.progress_key }}
        to={nextPaymentUrl}
        label={label}
        target="_blank"
        small
      />
    );
  }

  _renderReviewsButton(project, label, state) {
    const { onFeedbackFlow, isCareerService } = this.props;

    if (ProjectHelper.getReviewsUrl(project, isCareerService)) {
      return state === SubmissionStatus.UNSUBMITTED &&
        !ProjectHelper.isCompletedCareerService(project, isCareerService) ? (
        <StaticContentPlaceholder
          placeholder={
            <p>{__('You may only submit projects during an active term.')}</p>
          }
        >
          <TrackingButton
            variant="primary"
            trackingEventName="Clicked Submit Project"
            trackingOptions={{ projectKey: project.progress_key }}
            onClick={onFeedbackFlow}
            label={label}
            small
          />
        </StaticContentPlaceholder>
      ) : (
        <ButtonLink
          variant="primary"
          trackingEventName="Clicked Submit Project"
          trackingOptions={{ projectKey: project.progress_key }}
          to={ProjectHelper.getReviewsUrl(project, isCareerService)}
          label={label}
          target="_blank"
          small
        />
      );
    }
  }

  _renderTerminalLaunchForm(project, label, type = 'default') {
    const { onFeedbackFlow } = this.props;
    const terminalUrl = ProjectHelper.getTerminalUrl();

    return (
      /* eslint-disable react/jsx-max-props-per-line */
      <form
        styleName="button"
        method="POST"
        action={terminalUrl}
        target="_self"
      >
        <input
          type="hidden"
          name="projectId"
          value={project.terminal_project_id}
        />
        <input type="hidden" name="test" value="false" />
        <input
          type="hidden"
          name="udacityJwt"
          value={AuthenticationService.getJWTToken()}
        />
        <TrackingButton
          isSubmit
          trackingEventName="Launched Terminal"
          trackingEventOptions={{ projectKey: project.progress_key }}
          label={label}
          variant={type}
          onClick={onFeedbackFlow}
          small
        />
      </form>
      /* eslint-enable react/jsx-max-props-per-line */
    );
  }

  renderSubmissionButton() {
    const { assessment, isCareerService, isCompletedFreeTrial } = this.props;

    const shouldRender = _.isEqual(
      _.get(assessment, 'semantic_type', ''),
      SemanticTypes.PROJECT
    );
    const {
      buttons: [button1, button2],
      isError,
    } = this._getContent(assessment, isCareerService, isCompletedFreeTrial);
    return (
      shouldRender && (
        <div className={styles[classNames({ erred: isError })]}>
          <span>
            {button1}
            {button2}
          </span>
        </div>
      )
    );
  }

  render() {
    const { assessment, children, lesson, course } = this.props;

    return (
      <Layout
        documentTitle={NodeHelper.getTitle(assessment)}
        navVariant="none"
        header={
          <Header
            justify="between"
            theme="dark"
            title={NodeHelper.getTitle(assessment)}
            hamburgerAlwaysVisible
          >
            <ContestPlagiarismButtonContainer>
              {this.renderSubmissionButton()}
            </ContestPlagiarismButtonContainer>
          </Header>
        }
        sidebar={
          <LessonSidebar
            activeNode={assessment}
            activeLesson={lesson}
            course={course}
          />
        }
      >
        {/* TODO: (layout) remove hack */}
        {/* ureact-app-shell hack to prevent rerendering of children */}
        <Body content={children} />
      </Layout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const nanodegreeKey = _.get(ownProps, 'nanodegree.key', '');
  const projectKey = _.get(ownProps, 'assessment.key', '');
  const isCompletedFreeTrial =
    FreeTrialHelper.State.isFreeTrial(state, nanodegreeKey) &&
    !FreeTrialHelper.State.canSubmitProjectWhileTrialing(
      state,
      nanodegreeKey,
      projectKey
    );
  const nextPaymentUrl = FreeTrialHelper.State.getNextPaymentUrl(
    state,
    nanodegreeKey
  );
  return { isCompletedFreeTrial, nextPaymentUrl };
};
export default connect(mapStateToProps)(AssessmentShow);

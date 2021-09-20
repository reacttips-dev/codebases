import { Flex, Heading, Space, Tooltip } from '@udacity/veritas-components';
import CancelSubmissionModal from './_cancel-submission-modal';
import { CareerServiceConsumer } from 'components/career-services/_context';
import ClassroomPropTypes from 'components/prop-types';
import { FREE_TRIAL_SUBMISSION_LIMIT } from 'helpers/free-trial-helper';
import FreeTrialHelper from 'helpers/free-trial-helper';
import { IconInfo } from '@udacity/veritas-icons';
import InfoBox from './info-box';
import Markdown from '@udacity/ureact-markdown';
import NextDialog from 'components/concepts/show/_next-dialog';
import NodeHelper from 'helpers/node-helper';
import ProjectHelper from 'helpers/project-helper';
/**
 * Renders a single project
 */
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import SettingsHelper from 'helpers/settings-helper';
import TextHelper from 'helpers/text-helper';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './index.scss';

@cssModule(styles)
export class Project extends React.Component {
  static displayName = 'projects/show/_project/index';

  static propTypes = {
    project: PropTypes.object.isRequired,
    cancelNanodegreeProjectSubmission: PropTypes.func.isRequired,
    cancelCourseProjectSubmission: PropTypes.func.isRequired,
    isKnowledgeEnabled: PropTypes.bool,
    isFreeTrial: PropTypes.bool,
    canSubmitProjectWhileTrialing: PropTypes.bool,
    numRemainingProjectsWhileTrialing: PropTypes.number,
  };

  static contextTypes = {
    root: ClassroomPropTypes.node,
  };

  state = {
    showCancelModal: false,
  };

  handleShowCancelModal = () => {
    this.setState({ showCancelModal: true });
  };

  handleHideCancelModal = () => {
    this.setState({ showCancelModal: false });
  };

  render() {
    const { root } = this.context;
    const {
      project,
      cancelNanodegreeProjectSubmission,
      cancelCourseProjectSubmission,
      lesson,
      showNextDialogModal,
      isStudentHubEnabled,
      isKnowledgeEnabled,
      isFreeTrial,
      canSubmitProjectWhileTrialing,
      numRemainingProjectsWhileTrialing,
    } = this.props;
    const { showCancelModal } = this.state;
    const hasService = isStudentHubEnabled || isKnowledgeEnabled;
    const currentSubmission = ProjectHelper.getCurrentSubmission(project) || {};
    let cancelSubmission;
    if (SemanticTypes.isNanodegree(root)) {
      cancelSubmission = cancelNanodegreeProjectSubmission.bind(
        this,
        currentSubmission.id,
        _.get(root, 'key')
      );
    }
    if (SemanticTypes.isPart(root)) {
      cancelSubmission = cancelCourseProjectSubmission.bind(
        this,
        currentSubmission.id,
        _.get(root, 'key')
      );
    }

    return (
      <div>
        <div styleName="container" className="container-fluid">
          <div styleName="body">
            <Space size="2x" type="stack">
              <Flex spacing="none" align="center" justify="between">
                <Heading size="h2" color="slate">
                  {__('Project Submission')}
                </Heading>

                {isFreeTrial && (
                  <div>
                    <Heading spacing="none" size="h6" color="blue">
                      {__('Free trial:')}
                    </Heading>
                    <Heading spacing="none" size="h6" color="blue">
                      {canSubmitProjectWhileTrialing
                        ? __(
                            '<%=numRemainingProjectsWhileTrialing%>/<%=FREE_TRIAL_SUBMISSION_LIMIT%> projects remaining',
                            {
                              numRemainingProjectsWhileTrialing,
                              FREE_TRIAL_SUBMISSION_LIMIT,
                            }
                          )
                        : __('You have already submitted')}
                      <Tooltip
                        content={__(
                          `You may attempt and pass up to 3 projects during your free trial. Paying students who complete all projects will be eligible to graduate and receive a verified, shareable certificate.`
                        )}
                        trigger={<IconInfo />}
                      />
                    </Heading>
                  </div>
                )}
              </Flex>
            </Space>
            <CareerServiceConsumer>
              {(isCareerService) => {
                const shouldRender = !isCareerService && hasService;
                return (
                  shouldRender && (
                    <InfoBox
                      onShowCancelModal={this.handleShowCancelModal}
                      root={root}
                      project={project}
                    />
                  )
                );
              }}
            </CareerServiceConsumer>

            <div className={TextHelper.directionClass(project.description)}>
              <Markdown text={project.description} />
            </div>
          </div>
        </div>

        <CancelSubmissionModal
          onHide={this.handleHideCancelModal}
          show={showCancelModal}
          cancelSubmission={cancelSubmission}
          projectTitle={project.title}
        />
        <CareerServiceConsumer>
          {(isCareerService) => (
            <div>
              <NextDialog
                isOpen={showNextDialogModal}
                onRequestClose={this.props.handleToggleNextDialogModal}
                title={__(NodeHelper.getTitle(project))}
                bodyTitle={__(NodeHelper.getTitle(project))}
                duration={project.duration}
                bodyText={project.summary}
                button={{
                  label: __('Go To Submission'),
                  url: ProjectHelper.getReviewsUrl(project, isCareerService),
                  openInNew: true,
                }}
                currentContent={lesson}
                customPrompt={__('How was the project?')}
              />
            </div>
          )}
        </CareerServiceConsumer>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const nanodegreeKey = _.get(ownProps, 'nanodegree.key', '');
  const projectKey = _.get(ownProps, 'project.key', '');
  return {
    isStudentHubEnabled: SettingsHelper.State.getHasStudentHub(state),
    isKnowledgeEnabled: SettingsHelper.State.getHasKnowledgeReviews(
      state,
      nanodegreeKey
    ),
    isFreeTrial: FreeTrialHelper.State.isFreeTrial(state, nanodegreeKey),
    canSubmitProjectWhileTrialing: FreeTrialHelper.State.canSubmitProjectWhileTrialing(
      state,
      nanodegreeKey,
      projectKey
    ),
    numRemainingProjectsWhileTrialing: FreeTrialHelper.State.numRemainingProjectsWhileTrialing(
      state,
      nanodegreeKey,
      projectKey
    ),
  };
};
export default connect(
  mapStateToProps,
  actionsBinder(
    'cancelNanodegreeProjectSubmission',
    'cancelCourseProjectSubmission'
  )
)(Project);

import { AtomFeedbackProvider } from 'components/content-feedback/atom-feedback-context';
import ClassroomPropTypes from 'components/prop-types';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import { connect } from 'react-redux';
import { getFeedbacksForAtomType } from 'components/content-feedback/feedback-prompts';
import withAnalytics from 'decorators/analytics';

@withAnalytics
class AtomFeedbackWrapper extends React.Component {
  static displayName = 'components/content-feedback/atom-feedback-wrapper';

  static propTypes = {
    track: PropTypes.func,
    root: ClassroomPropTypes.program.isRequired,
    userKey: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      atomKey: null,
      feedbacks: null,
      isSelectingContent: false,
      onAtomSelect: this.handleAtomSelect,
      onCancelContentSelection: this.handleCancelContentSelection,
      onCloseFeedbackModal: this.handleCloseFeedbackModal,
      onStartContentSelection: this.handleStartContentSelection,
      onSubmit: this.handleSubmit,
      resetForm: this.resetForm,
      sessionId: null,
      showConfirmation: false,
      showFeedbackModal: false,
      track: this.track,
    };
  }

  track = (evtName, options = {}) => {
    const {
      atomKey,
      feedbacks,
      semanticType,
      sessionId,
      quizResponse,
    } = this.state;
    const { track, root } = this.props;
    const { subPromptResponses: currentResponseState, categoryKey } = options;

    track(evtName, {
      atom_key: atomKey,
      atom_type: semanticType,
      category: _.get(feedbacks, `${categoryKey}.feedback`, null),
      category_key: categoryKey,
      full_response: currentResponseState,
      session_id: sessionId,
      quiz_response: quizResponse,
      cohort_id: _.get(NanodegreeHelper.getCurrentCohort(root), 'id'),
    });
  };

  handleSubmit = () => {
    this.resetForm();
    this.handleShowConfirmation();
  };

  handleCloseFeedbackModal = () => {
    this.setState({
      feedbacks: null,
      showFeedbackModal: false,
    });
  };

  handleStartContentSelection = () => {
    const { userKey } = this.props;
    const date = new Date();

    this.setState(
      {
        isSelectingContent: true,
        sessionId: '' + userKey + date.valueOf(),
      },
      () => this.track('Content Feedback Flow Started')
    );
  };

  resetForm = () => {
    this.setState({
      feedbacks: null,
      isSelectingContent: false,
      showFeedbackModal: false,
    });
  };

  handleCancelContentSelection = () => {
    this.track('Content Feedback Flow Canceled');
    this.resetForm();
  };

  handleAtomSelect = (atom) => {
    const { semantic_type: semanticType, key } = atom;
    this.setState(
      {
        atomKey: key,
        feedbacks: getFeedbacksForAtomType(semanticType),
        semanticType,
        showFeedbackModal: true,
        quizResponse: NodeHelper.getUnstructuredData(atom),
      },
      () => this.track('Atom Selected')
    );
  };

  handleShowConfirmation = () => {
    this.setState({
      showConfirmation: true,
    });

    setTimeout(() => {
      this.setState({
        showConfirmation: false,
      });
    }, 5000);
  };

  render() {
    return (
      <AtomFeedbackProvider ref="feedbackWrapper" value={this.state}>
        {this.props.children}
      </AtomFeedbackProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  userKey: SettingsHelper.State.getUser(state).id,
});

export default connect(mapStateToProps, null)(AtomFeedbackWrapper);

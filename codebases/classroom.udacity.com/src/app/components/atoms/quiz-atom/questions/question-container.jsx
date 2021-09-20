import Actions from 'actions';
import PropTypes from 'prop-types';
import Questions from './index';
import ResultModal from 'components/atoms/common/result-modal';
import UserHelper from 'helpers/user-helper';
import { connect } from 'react-redux';

var mapStateToProps = function (state) {
  return {
    isAuthenticated: UserHelper.State.isAuthenticated(state),
  };
};

export default connect(mapStateToProps)(
  class extends React.Component {
    static displayName = 'atoms/quiz-atom/questions/question-container';

    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      nodeKey: PropTypes.string.isRequired,
      semanticType: PropTypes.string.isRequired,
      title: PropTypes.string,
      prompt: PropTypes.string,
      evaluationId: PropTypes.string.isRequired,
      onContinueOnSuccessfulResult: PropTypes.func.isRequired,
      onViewAnswer: PropTypes.func,
      hasAnswer: PropTypes.bool.isRequired,
      externalIframeUri: PropTypes.string,
      unstructuredData: PropTypes.object,
      backgroundImage: PropTypes.string,
      altText: PropTypes.string,
      files: PropTypes.array,
      widgets: PropTypes.array,
    };

    static contextTypes = {
      root: PropTypes.object.isRequired,
    };

    static defaultProps = {
      backgroundImage: null,
      unstructuredData: {},
      files: [],
      widgets: [],
    };

    state = {
      comment: null,
      passed: false,
      showResult: false,
    };

    handleResult = (evaluation) => {
      this.setState({
        feedback: evaluation.feedback,
        comment: evaluation.comment,
        passed: evaluation.passed,
        showResult: true,
      });
    };

    handleSave = (formData) => {
      if (this.props.isAuthenticated) {
        return this.props.dispatch(
          Actions.updateUnstructuredUserStateData({
            rootKey: this.context.root.key,
            rootId: this.context.root.id,
            nodeKey: this.props.nodeKey,
            nodeId: this.props.nodeId,
            json: formData,
          })
        );
      }
    };

    render() {
      var {
        semanticType,
        onContinueOnSuccessfulResult,
        hasAnswer,
        onViewAnswer,
      } = this.props;
      var { showResult, feedback, comment, passed } = this.state;

      var Question = Questions[semanticType];

      return (
        <div>
          <ResultModal
            isOpen={showResult}
            onRequestClose={() => this.setState({ showResult: false })}
            onContinueOnSuccessfulResult={onContinueOnSuccessfulResult}
            hasAnswer={hasAnswer}
            feedback={feedback}
            comment={comment}
            passed={passed}
          />

          <Question
            {...this.props}
            onSave={this.handleSave}
            onResult={this.handleResult}
            onViewAnswer={onViewAnswer}
          />
        </div>
      );
    }
  }
);

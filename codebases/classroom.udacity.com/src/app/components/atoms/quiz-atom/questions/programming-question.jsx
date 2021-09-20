import CodeQuestion from './_code-question';
import EvaluationsService from 'services/evaluations-service';
import PropTypes from 'prop-types';
import RunResults from './_run-results';
import { __ } from 'services/localization-service';

const NO_OUTPUT_MESSAGE = __('Your code displayed no output');

export default class extends React.Component {
  static displayName = 'atoms/quiz-atom/questions/programming-question';

  static propTypes = {
    evaluationId: PropTypes.string.isRequired,
    nodeKey: PropTypes.string.isRequired,
    nodeId: PropTypes.number.isRequired,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        name: PropTypes.name,
      })
    ),
    unstructuredData: PropTypes.object,
    onSave: PropTypes.func,
    onResult: PropTypes.func,
    onViewAnswer: PropTypes.func,
    title: PropTypes.string.isRequired,
  };

  static contextTypes = {
    root: PropTypes.object.isRequired,
  };

  static defaultProps = {
    unstructuredData: {},
    files: [],
    onSave: _.noop,
    onResult: _.noop,
    onViewAnswer: null,
  };

  state = {
    stderr: null,
    stdout: null,
    imageUrls: [],
  };

  handleSubmit = (formData) => {
    this.props.onSave(formData);

    return EvaluationsService.grade({
      evaluationId: this.props.evaluationId,
      parts: formData,
      atomKey: this.props.nodeKey,
      atomId: this.props.nodeId,
      rootKey: this.context.root.key,
      rootId: this.context.root.id,
    }).then((evaluation) => {
      this.props.onResult(evaluation);
      this.setState({
        comment: evaluation.comment,
      });
      return evaluation;
    });
  };

  handleTest = (formData) => {
    this.props.onSave(formData);
    this.setState({
      comment: null,
      stdout: null,
      stderr: null,
      imageUrls: [],
    });

    return EvaluationsService.test({
      evaluationId: this.props.evaluationId,
      parts: formData,
      atomKey: this.props.nodeKey,
      atomId: this.props.nodeId,
      rootKey: this.context.root.key,
      rootId: this.context.root.id,
    }).then((output) => {
      this.setState({
        stderr: output.stderr,
        stdout: output.stdout || (output.stderr ? '' : NO_OUTPUT_MESSAGE),
        imageUrls: output.imageUrls,
      });
    });
  };

  render() {
    var { files, unstructuredData, onViewAnswer, title } = this.props;
    var { stderr, stdout, imageUrls, comment } = this.state;

    return (
      <CodeQuestion
        files={files}
        onSubmit={this.handleSubmit}
        onTest={this.handleTest}
        onViewAnswer={onViewAnswer}
        title={title}
        unstructuredData={unstructuredData}
      >
        <RunResults
          stderr={stderr}
          stdout={stdout}
          comment={comment}
          imageUrls={imageUrls}
        />
      </CodeQuestion>
    );
  }
}

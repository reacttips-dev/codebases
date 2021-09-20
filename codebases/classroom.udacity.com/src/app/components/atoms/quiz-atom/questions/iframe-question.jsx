import CodeQuestion from './_code-question';
import EvaluationsService from 'services/evaluations-service';
import IframeEvaluator from './_iframe-evaluator';
import PropTypes from 'prop-types';
import styles from './iframe-question.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/quiz-atom/questions/iframe-question';

    static propTypes = {
      evaluationId: PropTypes.string.isRequired,
      nodeId: PropTypes.string.isRequired,
      nodeKey: PropTypes.string.isRequired,
      files: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
      externalIframeUri: PropTypes.string,
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
      onSubmit: _.noop,
      onResult: _.noop,
      onViewAnswer: null,
    };

    handleSubmit = (formData) => {
      this.props.onSave(formData);

      return this.refs.iframeEvaluator
        .evaluate('GRADE', formData)
        .then((execution) => {
          return EvaluationsService.grade({
            evaluationId: this.props.evaluationId,
            parts: formData,
            clientExecution: execution,
            atomKey: this.props.nodeKey,
            atomId: this.props.nodeId,
            rootKey: this.context.root.key,
            rootId: this.context.root.id,
          }).then((evaluation) => {
            this.props.onResult(evaluation);
            return evaluation;
          });
        });
    };

    handleTest = (formData) => {
      this.props.onSave(formData);
      this.refs.iframeEvaluator.evaluate('TEST', formData);
    };

    render() {
      var {
        nodeId,
        externalIframeUri,
        files,
        onViewAnswer,
        title,
        unstructuredData,
      } = this.props;

      return (
        <div>
          <CodeQuestion
            files={files}
            onSubmit={this.handleSubmit}
            onTest={this.handleTest}
            onViewAnswer={onViewAnswer}
            title={title}
            unstructuredData={unstructuredData}
          >
            <div styleName="iframe">
              <IframeEvaluator
                nodeId={nodeId}
                externalIframeUri={externalIframeUri}
                ref="iframeEvaluator"
              />
            </div>
          </CodeQuestion>
        </div>
      );
    }
  },
  styles
);

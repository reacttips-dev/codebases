import { Button } from '@udacity/veritas-components';
import EvaluationsService from 'services/evaluations-service';
import Markdown from '@udacity/ureact-markdown';
import PropTypes from 'prop-types';
import QuestionStaticPlaceholder from './question-static-placeholder';
import { QuizContainer } from '@udacity/ureact-quiz-atom';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import { __ } from 'services/localization-service';
import styles from './code-graded-question.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/quiz-atom/questions/code-graded-question';

    static propTypes = {
      evaluationId: PropTypes.string.isRequired,
      nodeKey: PropTypes.string.isRequired,
      nodeId: PropTypes.number.isRequired,
      title: PropTypes.string,
      prompt: PropTypes.string,
      unstructuredData: PropTypes.object,
      onSave: PropTypes.func,
      onResult: PropTypes.func,
    };

    static contextTypes = {
      root: PropTypes.object.isRequired,
    };

    static defaultProps = {
      unstructuredData: {},
      onSave: _.noop,
      onResult: _.noop,
    };

    constructor(props) {
      super(props);
      var unstructuredData = props.unstructuredData || {};

      this.state = {
        userAnswer: unstructuredData.answer || '',
        isCorrect: unstructuredData.is_correct,
      };
    }

    handleResetUserData = () => {
      this.setState({
        userAnswer: '',
        isCorrect: null,
      });
    };

    handleUserAnswerChange = (e) => {
      this.setState({
        userAnswer: e.target.value,
      });
    };

    handleSubmit = () => {
      var userAnswer = this.state.userAnswer;

      return EvaluationsService.grade({
        evaluationId: this.props.evaluationId,
        parts: { 'studentMain.py': userAnswer },
        atomKey: this.props.nodeKey,
        rootKey: this.context.root.key,
        rootId: this.context.root.id,
      }).then((evaluation) => {
        var isCorrect = evaluation.passed;
        this.setState({ isCorrect });

        this.props.onSave({ answer: userAnswer, is_correct: isCorrect });
        this.props.onResult(evaluation);
      });
    };

    render() {
      var { prompt, title, unstructuredData } = this.props;
      var { isCorrect, userAnswer } = this.state;
      var answerSubmitted = (unstructuredData || {}).answer;

      return (
        <StaticContentPlaceholder
          placeholder={<QuestionStaticPlaceholder atomName={__('quiz')} />}
        >
          <QuizContainer>
            <div styleName="container">
              <div styleName="header">
                <h2>{title}</h2>
                {answerSubmitted && isCorrect !== null ? (
                  isCorrect ? (
                    <div styleName="answered-icon-correct" />
                  ) : (
                    <div styleName="answered-icon-incorrect" />
                  )
                ) : null}
              </div>
              <Markdown text={prompt} />
              {answerSubmitted && isCorrect ? (
                <div>
                  <hr />
                  <div styleName="info-text-container">
                    <p>{userAnswer}</p>
                    <Button
                      onClick={this.handleResetUserData}
                      label={__('Reset')}
                      variant="secondary"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    styleName="textarea"
                    onChange={this.handleUserAnswerChange}
                    placeholder={__('Enter your response here')}
                    value={userAnswer}
                  />
                  <Button
                    variant="primary"
                    disabled={(userAnswer || '').trim().length === 0}
                    onClick={this.handleSubmit}
                    label={__('Submit')}
                  />
                </div>
              )}
            </div>
          </QuizContainer>
        </StaticContentPlaceholder>
      );
    }
  },
  styles
);

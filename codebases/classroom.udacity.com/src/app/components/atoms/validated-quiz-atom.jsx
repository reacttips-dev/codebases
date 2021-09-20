import AtomStaticPlaceholder from './quiz-atom/questions/question-static-placeholder';
import { Button } from '@udacity/veritas-components';
import ClassroomPropTypes from 'components/prop-types';
import EvaluationsService from 'services/evaluations-service';
import { IconEdit } from '@udacity/veritas-icons';
import Markdown from '@udacity/ureact-markdown';
import PropTypes from 'prop-types';
import { QuizContainer } from '@udacity/ureact-quiz-atom';
import ResultModal from 'components/atoms/common/result-modal';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './open-response-atom.scss';

@cssModule(styles)
export class ValidatedQuizAtom extends React.Component {
  static displayName = 'atoms/validated-quiz-atom';

  static propTypes = {
    nodeKey: PropTypes.string.isRequired,
    atom: ClassroomPropTypes.validatedQuizAtom.isRequired,
    unstructuredData: PropTypes.object,
  };

  static contextTypes = {
    root: PropTypes.object.isRequired,
  };

  static defaultProps = {
    unstructuredData: {},
  };

  constructor(props) {
    super(props);
    var unstructuredData = props.unstructuredData || {};

    this.state = {
      userAnswer: unstructuredData.answer || '',
      isCorrect: unstructuredData.is_correct,
      isResultModalOpen: false,
      feedbacks: [],
      video_feedback: null,
    };
  }

  _isValidAnswer = (answer) => {
    if (answer === null || answer === undefined) {
      return false;
    }

    return answer.trim().length > 0;
  };

  handleSubmitClick = () => {
    var { root } = this.context;
    var answer = this.state.userAnswer;
    var { nodeKey, atom } = this.props;

    return EvaluationsService.gradeValidatedQuizAtom({
      nodeId: atom.id,
      rootKey: root.key,
      rootId: root.id,
      answer,
    }).then(({ is_correct, feedbacks, video_feedback }) => {
      this.setState({
        isResultModalOpen: true,
        isCorrect: is_correct,
        feedbacks,
        video_feedback,
      });
      return this.props.updateUnstructuredUserStateData({
        rootKey: root.key,
        rootId: root.id,
        nodeKey,
        nodeId: atom.id,
        json: {
          answer: answer,
          is_correct: is_correct,
        },
      });
    });
  };

  handleResetUserData = () => {
    this.setState({
      userAnswer: this.props.unstructuredData.answer,
      isCorrect: null,
    });
  };

  handleUserAnswerChange = (e) => {
    this.setState({
      userAnswer: e.target.value,
    });
  };

  render() {
    var {
      atom: { question, title },
      onFinish,
      unstructuredData,
    } = this.props;
    var {
      isResultModalOpen,
      isCorrect,
      userAnswer,
      feedbacks,
      video_feedback,
    } = this.state;
    var uniqueFeedbacks = _.uniq(feedbacks);
    var isAnswered = this._isValidAnswer(userAnswer);
    var answerSubmitted = (unstructuredData || {}).answer;

    var checkmark;
    if (answerSubmitted && isCorrect !== null) {
      checkmark = isCorrect ? (
        <div styleName="answered-icon-correct" />
      ) : (
        <div styleName="answered-icon-incorrect" />
      );
    }

    var answerElement = (
      <div>
        <hr />
        <div styleName="info-text-container">
          <p>{userAnswer}</p>
          <div styleName="validated-edit-button-container">
            <Button
              icon={<IconEdit title={'Edit Answer'} />}
              onClick={this.handleResetUserData}
            />
          </div>
        </div>
      </div>
    );

    var formElement = (
      <div>
        <textarea
          styleName="textarea"
          onChange={this.handleUserAnswerChange}
          placeholder={__('Enter your response here')}
          value={userAnswer}
        />
        <Button
          variant="primary"
          disabled={!isAnswered}
          onClick={this.handleSubmitClick}
          label={__('Submit')}
        />
      </div>
    );

    return (
      <StaticContentPlaceholder
        placeholder={<AtomStaticPlaceholder atomName={__('quiz')} />}
      >
        <div>
          {isResultModalOpen ? (
            <ResultModal
              isOpen={isResultModalOpen}
              onRequestClose={() => this.setState({ isResultModalOpen: false })}
              onContinueOnSuccessfulResult={onFinish}
              hasAnswer={true}
              feedback={feedbacks ? uniqueFeedbacks.join('\n\n') : null}
              video_feedback={video_feedback}
              passed={isCorrect}
            />
          ) : null}
          <QuizContainer>
            <div styleName="container">
              <div styleName="reflect-header">
                <h2>{title}</h2>
                {checkmark}
              </div>
              <Markdown text={question.prompt} />
              {answerSubmitted && isCorrect ? answerElement : formElement}
            </div>
          </QuizContainer>
        </div>
      </StaticContentPlaceholder>
    );
  }
}

export default connect(
  null,
  actionsBinder('updateUnstructuredUserStateData')
)(ValidatedQuizAtom);

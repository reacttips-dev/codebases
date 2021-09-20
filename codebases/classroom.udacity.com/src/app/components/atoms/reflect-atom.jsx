import Actions from 'actions';
import AnalyticsMixin from 'mixins/analytics-mixin';
import { Button } from '@udacity/veritas-components';
import ClassroomPropTypes from 'components/prop-types';
import { IconEdit } from '@udacity/veritas-icons';
import Markdown from '@udacity/ureact-markdown';
import PropTypes from 'prop-types';
import { QuizContainer } from '@udacity/ureact-quiz-atom';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import styles from './open-response-atom.scss';

export default connect()(
  cssModule(
    createReactClass({
      displayName: 'atoms/reflect-atom',

      propTypes: {
        nodeKey: PropTypes.string.isRequired,
        atom: ClassroomPropTypes.reflectAtom.isRequired,
        unstructuredData: PropTypes.object,
      },

      contextTypes: {
        root: PropTypes.object.isRequired,
      },

      mixins: [AnalyticsMixin],

      getDefaultProps() {
        return {
          unstructuredData: {},
        };
      },

      getInitialState() {
        var unstructuredData = this.props.unstructuredData || {};
        // This check is for any old free response quizzes that were created
        // before the added functionality of editing your response. Older
        // quizzes won't have the `is_correct` property. Without this check,
        // old quizzes already answered by students would go into edit state.
        var previouslyAnswered =
          unstructuredData.answer && !unstructuredData.is_correct;

        return {
          userAnswer: unstructuredData.answer || '',
          isCorrect: previouslyAnswered ? true : unstructuredData.is_correct,
        };
      },

      _isValidAnswer(answer) {
        if (answer === null || answer === undefined) {
          return false;
        }

        return answer.trim().length > 0;
      },

      handleSubmit() {
        var { root } = this.context;
        var { atom, nodeKey } = this.props;
        var answer = this.state.userAnswer;

        this.track('Reflection Submitted', {
          atomKey: nodeKey,
          answer,
        });
        this.setState({ isCorrect: true });

        return this.props.dispatch(
          Actions.updateUnstructuredUserStateData({
            rootKey: root.key,
            rootId: root.id,
            nodeKey: nodeKey,
            nodeId: atom.id,
            json: {
              answer,
              is_correct: true,
            },
          })
        );
      },

      render() {
        var {
          atom: { question, answer, title },
          unstructuredData,
        } = this.props;
        var { isCorrect } = this.state;
        var savedAnswer = (unstructuredData || {}).answer;
        var isAnswered = this._isValidAnswer(savedAnswer);
        var isValidCurrentAnswer = this._isValidAnswer(this.state.userAnswer);

        var checkmark;
        if (isAnswered) {
          checkmark = <div styleName="answered-icon" />;
        }

        var answerElement = (
          <div>
            <hr />
            <div>
              <div styleName="info-text-container">
                <h3>{__('Your reflection')}</h3>
              </div>
              <div styleName="edit-answer-container">
                <div styleName="answer">
                  <strong className="light">{savedAnswer}</strong>
                </div>
                <div styleName="edit-button-container">
                  <Button
                    icon={<IconEdit title={'Edit Answer'} />}
                    onClick={() =>
                      this.setState({
                        userAnswer: savedAnswer,
                        isCorrect: null,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div styleName="info-text-container">
              <h3>{__('Things to think about')}</h3>
            </div>
            <Markdown text={answer.text} />
          </div>
        );

        var formElement = (
          <div>
            <textarea
              styleName="textarea"
              value={this.state.userAnswer}
              onChange={(evt) =>
                this.setState({ userAnswer: evt.target.value })
              }
              placeholder={__(
                "Enter your response here, there's no right or wrong answer"
              )}
            />
            <Button
              variant="primary"
              disabled={!isValidCurrentAnswer}
              onClick={this.handleSubmit}
              label={__('Submit')}
            />
          </div>
        );

        return (
          <QuizContainer>
            <div styleName="container">
              <div styleName="reflect-header">
                <h2>{title}</h2>
                {checkmark}
              </div>
              <Markdown text={question.text} />
              {isAnswered && isCorrect ? answerElement : formElement}
            </div>
          </QuizContainer>
        );
      },
    }),
    styles
  )
);

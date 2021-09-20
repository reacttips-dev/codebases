import { QuizContainer, QuizPrompt } from '@udacity/ureact-quiz-atom';

import AtomHelper from 'helpers/atom-helper';
import { Button } from '@udacity/veritas-components';
import ClassroomPropTypes from 'components/prop-types';
import CustomDragStyles from './inline-styles';
import DragItem from 'components/atoms/common/drag-item';
import DropZone from 'components/atoms/common/drop-zone';
import EvaluationsService from 'services/evaluations-service';
import { IconChecked } from '@udacity/veritas-icons';
import Markdown from '@udacity/ureact-markdown';
import PropTypes from 'prop-types';
import ResultModal from 'components/atoms/common/result-modal';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './index.scss';
import update from 'immutability-helper';

export const MatchingQuizAtom = cssModule(
  class extends React.Component {
    static displayName = 'atoms/matching-quiz-atom';

    static propTypes = {
      atom: ClassroomPropTypes.matchingQuizAtom,
      atoms: PropTypes.array,
      onFinish: PropTypes.func,
      updateUnstructuredUserStateData: PropTypes.func,
      unstructuredData: PropTypes.shape({
        is_correct: PropTypes.bool,
        answer_ids: PropTypes.array,
      }),
    };

    static contextTypes = {
      root: PropTypes.object,
    };

    static defaultProps = {
      atom: {},
      atoms: [],
      onFinish: _.noop,
      unstructuredData: {},
      updateUnstructuredUserStateData: _.noop,
    };

    constructor(props) {
      super(props);
      const {
        unstructuredData,
        atom: { question },
      } = props;
      const answerSelections = _.map(
        _.get(unstructuredData, 'answer_ids'),
        (id) => _.find(question.answers, { id: id })
      );
      const answerChoices = _.difference(question.answers, answerSelections);

      this.state = {
        activeHoverPosition: null,
        answerChoices,
        answersActive: false,
        answerSelections,
        answerSelectionsActive: false,
        dragItemsSelectable: true,
        feedbacks: [],
        video_feedback: question.video_feedback,
        isCorrect: (unstructuredData || {}).is_correct,
        isResultModalOpen: false,
        selectedAnswer: null,
      };
    }

    handleSubmitClick = () => {
      const { root } = this.context;
      const { answerSelections } = this.state;
      const { atom, nodeKey } = this.props;
      const answerIds = _.map(answerSelections, 'id');

      return EvaluationsService.gradeMatchingQuizAtom({
        nodeKey: nodeKey,
        rootKey: root.key,
        rootId: root.id,
        nodeId: atom.id,
        answerIds,
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
            answer_ids: answerIds,
            is_correct: is_correct,
          },
        });
      });
    };

    //Drop Zone Methods
    handleAnswerSelectionDrag = (selectedAnswerPosition) => {
      this.setState({
        activeHoverPosition: selectedAnswerPosition,
      });
    };

    handleAnswerChoiceDrag = (answersActive) => {
      this.setState({
        answersActive,
      });
    };

    resetItem = (item) => {
      this.handleAnswerChoicesDrop(item);
    };

    handleAnswerChoicesDrop = (item) => {
      const droppedAnswer = item || this.state.selectedAnswer;
      if (!_.find(this.state.answerChoices, { id: droppedAnswer.id })) {
        const updatedAnswerSelection = this.removeAnswer(droppedAnswer);
        const { answerChoices, answerSelections } = update(this.state, {
          $merge: updatedAnswerSelection,
        });

        answerChoices.push(droppedAnswer);

        this.setState({
          answerChoices,
          answerSelections,
        });
      }

      this.handleDragEnd();
    };

    handleAnswerSelectionsDrop = (position) => {
      const updatedAnswerSelection = this.removeAnswer();
      let { selectedAnswer, answerSelections, answerChoices } = update(
        this.state,
        {
          $merge: updatedAnswerSelection,
        }
      );
      answerSelections[position] = selectedAnswer;

      this.setState({
        answerChoices,
        answerSelections,
      });

      this.handleDragEnd();
    };

    removeAnswer = (item) => {
      const { selectedAnswer, answerChoices, answerSelections } = this.state;
      const answersIndex = AtomHelper.findItemIndexById(
        answerChoices,
        item || selectedAnswer
      );
      const selectionsIndex = AtomHelper.findItemIndexById(
        answerSelections,
        item || selectedAnswer
      );

      if (answersIndex > -1) {
        return {
          answerChoices: update(answerChoices, {
            $splice: [[answersIndex, 1, undefined]],
          }),
        };
      } else if (selectionsIndex > -1) {
        return {
          answerSelections: update(answerSelections, {
            $splice: [[selectionsIndex, 1, undefined]],
          }),
        };
      }
    };

    // Drag Item Methods
    handleDragStart = (answer) => {
      this.setState({
        dragItemsSelectable: false,
        selectedAnswer: answer,
      });
    };

    handleDragEnd = () => {
      this.setState({
        activeHoverPosition: null,
        answersActive: false,
        answerSelectionsActive: false,
        dragItemsSelectable: true,
        selectedAnswer: null,
      });
    };

    handleDragItemClick = (answerSelectionsActive) => {
      this.setState({
        answerSelectionsActive,
      });
    };

    _renderFocusedAnswerSelection = () => {
      return this._renderDragItem(this.state.selectedAnswer, {
        styles: CustomDragStyles.cloneAnswerShadowStyles,
      });
    };

    _renderUnfocusedAnswerSelection = () => {
      return this._renderDragItem(this.state.selectedAnswer, {
        styles: CustomDragStyles.invisibleAnswerStyles,
      });
    };

    isSelectedAnswer = (answer) => {
      return answer.id === (this.state.selectedAnswer || {}).id;
    };

    _renderAnswerChoices = () => {
      let { answerChoices, answersActive, selectedAnswer } = this.state;
      const renderedAnswers = _(answerChoices)
        .compact()
        .map((answer, i) => {
          if (this.isSelectedAnswer(answer) && !answersActive) {
            return this._renderUnfocusedAnswerSelection();
          } else if (this.isSelectedAnswer(answer) && answersActive) {
            return this._renderFocusedAnswerSelection();
          } else {
            return this._renderDragItem(answer, { index: i });
          }
        })
        .value();
      if (
        selectedAnswer &&
        answersActive &&
        !_.find(answerChoices, { id: selectedAnswer.id })
      ) {
        renderedAnswers.push(this._renderFocusedAnswerSelection());
      }

      return renderedAnswers.length ? (
        renderedAnswers
      ) : (
        <h3>{__('Submit to check your answer choices!')}</h3>
      );
    };

    _renderAnswerSelections = (items) => {
      const { activeHoverPosition } = this.state;
      return _(items)
        .compact()
        .map((item, i) => {
          if (activeHoverPosition !== null && this.isSelectedAnswer(item)) {
            return this._renderUnfocusedAnswerSelection();
          }
          return this._renderDragItem(item, { index: i });
        })
        .value();
    };

    _renderDragItem = (item, opts) => {
      const { dragItemsSelectable } = this.state;

      return (
        <DragItem
          key={item.id}
          type="answer"
          dragImageStyles={CustomDragStyles.cloneAnswerStyles}
          onDragEnd={this.handleDragEnd}
          onDragItemClick={this.handleDragItemClick}
          onDragStart={() => this.handleDragStart(item)}
          shadowStyles={opts.styles}
          tabIndex={dragItemsSelectable ? 0 : null}
          text={item.text}
          position={opts.index + 1 || 0}
        >
          <Markdown text={item.text} />
        </DragItem>
      );
    };

    _renderQuizPrompt() {
      const {
        nodeKey,
        atoms,
        atom: { question },
      } = this.props;
      const { index, count } = AtomHelper.getQuestionNumberAndCount(
        nodeKey,
        atoms
      );

      return (
        <QuizPrompt
          index={index}
          count={count}
          text={_.get(question, 'complex_prompt', {}).text}
        />
      );
    }

    _renderMatchingQuizPlaceholder() {
      const {
        atom: { question },
      } = this.props;
      return (
        <QuizContainer>
          {this._renderQuizPrompt()}
          <div className={styles['correct-answers']}>
            <IconChecked title={__('Checkmark')} size="lg" color="green" />{' '}
            {__('These are the correct matches.')}
          </div>
          {this._renderLabels()}
          <div className={styles['answer-selections']}>
            {_.map(question.concepts, (concept, position) => {
              return (
                <div className={styles.pair} key={position}>
                  <div className={styles.concept}>
                    <Markdown text={concept.text} />
                  </div>
                  <div className={styles['answer-selection-fake']}>
                    <div className={styles['fake-drag-item']}>
                      <Markdown text={_.get(concept, 'correct_answer.text')} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </QuizContainer>
      );
    }

    _renderLabels() {
      const {
        atom: { question },
      } = this.props;
      return (
        <div className={styles.labels}>
          <h3>
            <Markdown text={question.concepts_label} />
          </h3>
          <h3>
            <Markdown text={question.answers_label} />
          </h3>
        </div>
      );
    }

    render() {
      const {
        onFinish,
        atom: { question },
      } = this.props;
      const {
        isCorrect,
        isResultModalOpen,
        feedbacks,
        video_feedback,
      } = this.state;
      const {
        selectedAnswer,
        answerChoices,
        answerSelections,
        answerSelectionsActive,
        activeHoverPosition,
      } = this.state;
      const uniqueFeedbacks = _.uniq(feedbacks);

      return (
        <StaticContentPlaceholder
          placeholder={this._renderMatchingQuizPlaceholder()}
        >
          <div>
            {isResultModalOpen ? (
              <ResultModal
                feedback={feedbacks ? uniqueFeedbacks.join('\n\n') : null}
                video_feedback={video_feedback}
                hasAnswer={true}
                isOpen={isResultModalOpen}
                onContinueOnSuccessfulResult={onFinish}
                onRequestClose={() =>
                  this.setState({ isResultModalOpen: false })
                }
                passed={isCorrect}
              />
            ) : null}

            <QuizContainer>
              {this._renderQuizPrompt()}

              <div styleName="answer-choices">
                <DropZone
                  type="answer"
                  accessibilityContext="Answer choice selections - tab through answer choices to match to concepts below."
                  items={answerChoices}
                  onDragLeave={() => this.handleAnswerChoiceDrag(false)}
                  onDragEnter={() => this.handleAnswerChoiceDrag(true)}
                  onDrop={this.handleAnswerChoicesDrop}
                  tabIndex={0}
                >
                  {this._renderAnswerChoices()}
                </DropZone>
              </div>

              {this._renderLabels()}

              <div
                styleName={
                  answerSelectionsActive
                    ? 'active-answer-selections'
                    : 'answer-selections'
                }
              >
                {_.map(question.concepts, (concept, position) => {
                  const items = answerSelections[position]
                    ? [answerSelections[position]]
                    : [];
                  const activeHover = activeHoverPosition === position;
                  return (
                    <div styleName="pair" key={position}>
                      <div styleName="concept">
                        <Markdown text={concept.text} />
                      </div>
                      <div styleName="answer-selection">
                        <DropZone
                          type="answer"
                          accessibilityContext={concept.text}
                          itemLimit={1}
                          items={items}
                          onDragLeave={this.handleAnswerSelectionDrag}
                          onDragEnter={() =>
                            this.handleAnswerSelectionDrag(position)
                          }
                          onDrop={() =>
                            this.handleAnswerSelectionsDrop(position)
                          }
                          resetItem={this.resetItem}
                          tabIndex={0}
                        >
                          {activeHover && selectedAnswer
                            ? [this._renderFocusedAnswerSelection()]
                            : this._renderAnswerSelections(items)}
                        </DropZone>
                      </div>
                    </div>
                  );
                })}
              </div>
            </QuizContainer>

            <div styleName="buttons">
              <Button
                variant="primary"
                disabled={AtomHelper.validListSize(
                  answerSelections,
                  _.size(question.concepts)
                )}
                onClick={this.handleSubmitClick}
                label={__('Submit')}
              />
            </div>
          </div>
        </StaticContentPlaceholder>
      );
    }
  },
  styles
);

export default connect(
  null,
  actionsBinder('updateUnstructuredUserStateData')
)(MatchingQuizAtom);

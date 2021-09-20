import { __, i18n } from 'services/localization-service';

import AnalyticsMixin from 'mixins/analytics-mixin';
import Answer from './answers/answer';
import ClassroomPropTypes from 'components/prop-types';
import Instruction from './instruction';
import PropTypes from 'prop-types';
import QuestionContainer from './questions/question-container';
import TextHelper from 'helpers/text-helper';
import VideoHelper from 'helpers/video-helper';
import createReactClass from 'create-react-class';
import styles from './index.scss';

var TAB_INSTRUCTION = 1;
var TAB_QUESTION = 2;
var TAB_ANSWER = 3;

export default cssModule(
  createReactClass({
    displayName: 'atoms/quiz-atom',

    propTypes: {
      nodeKey: PropTypes.string.isRequired,
      atom: ClassroomPropTypes.quizAtom.isRequired,
      unstructuredData: PropTypes.object,
      isWideLayout: PropTypes.bool,
      onFinish: PropTypes.func,
      overlayPresent: PropTypes.bool,
    },

    mixins: [AnalyticsMixin],

    getDefaultProps() {
      return {
        unstructuredData: null,
        isWideLayout: false,
        onFinish: _.noop,
      };
    },

    getInitialState() {
      return {
        selectedTab: this._hasInstruction() ? TAB_INSTRUCTION : TAB_QUESTION,
      };
    },

    _getBackgroundImage() {
      var {
        atom: { question },
      } = this.props;
      return i18n.getCountryCode() === 'CN'
        ? question.non_google_background_image
        : question.background_image;
    },

    _getTabStyleName(isVisible) {
      return isVisible ? 'tab' : 'tab-hidden';
    },

    _hasAnswer() {
      var {
        atom: { answer },
      } = this.props;
      return (
        answer && (answer.text || (answer.video && answer.video.youtube_id))
      );
    },

    _hasInstruction() {
      var {
        atom: { instruction },
      } = this.props;
      return (
        instruction &&
        ((instruction.text && instruction.text !== '') ||
          (instruction.video &&
            instruction.video.youtube_id &&
            instruction.video.youtube_id !== ''))
      );
    },

    selectTab(selectedTab) {
      this.setState({ selectedTab });
    },

    handleContinueOnSuccessfulResult() {
      if (this._hasAnswer()) {
        this.setState({
          selectedTab: TAB_ANSWER,
        });
      } else {
        this.props.onFinish();
      }
    },

    handleIntroEnd() {
      this.setState({
        selectedTab: TAB_QUESTION,
      });
    },

    handleVideoSeen(trackingProps) {
      const { nodeKey } = this.props;
      this.trackVideoSeen({
        ...trackingProps,
        atomKey: nodeKey,
      });
    },

    handleSkipToQuizClick(evt) {
      evt.preventDefault();

      this.selectTab(TAB_QUESTION);
    },

    handleViewIntroClick(evt) {
      evt.preventDefault();

      this.selectTab(TAB_INSTRUCTION);
    },

    handleBackToQuizClick(evt) {
      evt.preventDefault();

      this.selectTab(TAB_QUESTION);
    },

    handleViewAnswer() {
      this.selectTab(TAB_ANSWER);
    },

    render() {
      const {
        isWideLayout,
        nodeKey,
        unstructuredData,
        atom,
        atom: { instruction, question, answer },
        overlayPresent,
      } = this.props;
      const { selectedTab } = this.state;
      const { nanodegree } = this.context;
      const isAlternativePlayer = VideoHelper.isAlternativePlayer(nanodegree);

      return (
        <div
          styleName={isWideLayout ? 'quiz-atom-wide' : null}
          className={TextHelper.directionClass(instruction && instruction.text)}
        >
          {this._hasInstruction() ? (
            <div
              styleName={this._getTabStyleName(selectedTab === TAB_INSTRUCTION)}
            >
              <Instruction
                {...instruction}
                isWideLayout={isWideLayout}
                isVisible={selectedTab === TAB_INSTRUCTION}
                onEnd={this.handleIntroEnd}
                onVideoSeen={this.handleVideoSeen}
                autoPlay={!overlayPresent}
                isAlternativePlayer={isAlternativePlayer}
              />
              <div styleName="buttons">
                <a
                  href="#"
                  styleName="skip-to-quiz"
                  onClick={this.handleSkipToQuizClick}
                >
                  {__('Start Quiz')}
                </a>
              </div>
            </div>
          ) : null}

          <div
            styleName={`${this._getTabStyleName(
              selectedTab === TAB_QUESTION
            )} tab-question`}
          >
            <QuestionContainer
              semanticType={question.semantic_type}
              title={question.title}
              prompt={question.prompt}
              evaluationId={question.evaluation_id}
              backgroundImage={this._getBackgroundImage()}
              altText={question.alt_text}
              files={question.initial_code_files}
              externalIframeUri={question.external_iframe_uri}
              widgets={question.widgets}
              nodeKey={nodeKey}
              nodeId={atom.id}
              unstructuredData={unstructuredData}
              hasAnswer={Boolean(this._hasAnswer())}
              onContinueOnSuccessfulResult={
                this.handleContinueOnSuccessfulResult
              }
              onViewAnswer={this._hasAnswer() ? this.handleViewAnswer : null}
            />
            {this._hasInstruction() ? (
              <a
                href="#"
                styleName="question-view-intro"
                onClick={this.handleViewIntroClick}
              >
                {__('View Intro')}
              </a>
            ) : null}
          </div>

          {this._hasAnswer() ? (
            <div
              styleName={`${this._getTabStyleName(
                selectedTab === TAB_ANSWER
              )} tab-answer`}
            >
              <Answer
                {...answer}
                isVisible={selectedTab === TAB_ANSWER}
                onVideoSeen={this.handleVideoSeen}
                onFinish={this.props.onFinish}
                isAlternativePlayer={isAlternativePlayer}
              />
              <div styleName="buttons">
                <a
                  href="#"
                  styleName="answer-view-intro"
                  onClick={this.handleViewIntroClick}
                >
                  {__('View Intro')}
                </a>

                <a
                  href="#"
                  styleName="answer-go-back"
                  onClick={this.handleBackToQuizClick}
                >
                  {__('Back to Quiz')}
                </a>
              </div>
            </div>
          ) : null}
        </div>
      );
    },
  }),
  styles,
  { allowMultiple: true }
);

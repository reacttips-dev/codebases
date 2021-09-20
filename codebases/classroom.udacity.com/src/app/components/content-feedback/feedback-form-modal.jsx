import { Button, RoundButton } from '@udacity/veritas-components';
import {
  IconClose,
  IconResizeExpand,
  IconSubtract,
} from '@udacity/veritas-icons';
import { feedback, response } from './_prop-types';
import PropTypes from 'prop-types';
import Select from '@udacity/ureact-select';
import SubPrompt from './sub-prompt';
import { __ } from 'services/localization-service';
import styles from './feedback-form-modal.scss';
import withFeedbackContext from './with-feedback-context';

@cssModule(styles)
export class FeedbackFormModal extends React.Component {
  static displayName = 'components/content-feedback/feedback-form-modal';

  static propTypes = {
    // withFeedbackContext
    feedbacks: PropTypes.arrayOf(feedback),
    subPromptResponses: PropTypes.objectOf(response),
    onCloseFeedbackModal: PropTypes.func,
    onSubmit: PropTypes.func,
    resetForm: PropTypes.func,
    showFeedbackModal: PropTypes.bool,
  };

  state = {
    minimized: false,
    categoryKey: null,
    subPromptResponses: {},
  };

  componentWillUnmount() {
    this.props.resetForm();
  }

  track = (evtName) => {
    const { track } = this.props;
    const { subPromptResponses, categoryKey } = this.state;
    track(evtName, { subPromptResponses, categoryKey });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    onSubmit();
    this.track('Feedback Sent');
    this.setState({
      categoryKey: null,
      subPromptResponse: {},
    });
  };

  handleCloseFeedbackModal = () => {
    const { onCloseFeedbackModal } = this.props;
    onCloseFeedbackModal();
    this.setState({ categoryKey: null, subPromptResponse: {} });
    this.track('Content Feedback Form Closed');
  };

  handleMinimizeToggle = () => {
    const { minimized } = this.state;
    this.setState({ minimized: !minimized });
  };

  handleCategorySelect = (evt) => {
    const { feedbacks } = this.props;
    const subPrompts = feedbacks[evt.value].subPrompts;
    let subPromptResponses = {};
    _.each(subPrompts, (subPrompt, idx) => {
      subPromptResponses[idx] = {
        answer: null,
        question: subPrompt.prompt, //set a default question for text inputs, but not radio ones, since there is none
      };
    });
    this.setState(
      {
        categoryKey: evt.value,
        subPromptResponses,
      },
      () => {
        this.handleQuestionAnswered();
      }
    );
  };

  handleSubPromptChange = (key, answer, question, radioKey) => {
    this.setState(({ subPromptResponses }) => ({
      subPromptResponses: {
        ...subPromptResponses,
        [key]: { answer, question, radioKey },
      },
    }));
  };

  handleQuestionAnswered = () => {
    this.track('Feedback Question Responded');
  };

  validateResponse() {
    const { categoryKey, subPromptResponses } = this.state;
    const { feedbacks } = this.props;

    if (_.isNil(categoryKey)) {
      return false;
    }
    const subPrompts = feedbacks[categoryKey].subPrompts;
    return !_.some(
      subPrompts,
      (subPrompt, idx) => subPrompt.required && !subPromptResponses[idx].answer
    );
  }

  _renderFeedbackForm() {
    const { feedbacks } = this.props;

    const { subPromptResponses, categoryKey } = this.state;

    const subPrompts =
      !_.isNil(categoryKey) && feedbacks[categoryKey].subPrompts;
    const categoryOptions = _.map(feedbacks, (feedback, idx) => {
      return {
        label: feedback.feedback,
        value: idx,
      };
    });

    return (
      <div>
        <div className={styles['picker']}>
          <h2>{__("What's your feedback?")}</h2>
          <Select
            name="FeedbackCategorySelect"
            options={categoryOptions}
            searchable={false}
            clearable={false}
            value={categoryKey}
            onChange={this.handleCategorySelect}
            placeholder={__('Select a category')}
          />
        </div>
        <ul className={styles['subprompt']}>
          {_.map(subPrompts, (subPrompt, idx) => {
            return (
              <SubPrompt
                key={idx}
                isFocus={idx === 0}
                onQuestionAnswered={this.handleQuestionAnswered}
                onChange={(answer, question, radioKey) =>
                  this.handleSubPromptChange(idx, answer, question, radioKey)
                }
                subPromptResponse={subPromptResponses[idx]}
                subPrompt={subPrompt}
              />
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    const { minimized } = this.state;
    const { showFeedbackModal } = this.props;

    if (showFeedbackModal) {
      return (
        <div
          className={
            styles[
              minimized
                ? 'feedback-form-container-minimized'
                : 'feedback-form-container'
            ]
          }
        >
          <div className={styles['header']}>
            <h2>{__('Send feedback')}</h2>
            <ul>
              <li>
                {minimized ? (
                  <RoundButton
                    label={__('Expand')}
                    variant="minimal"
                    icon={<IconResizeExpand color="cerulean" />}
                    onClick={this.handleMinimizeToggle}
                  />
                ) : (
                  <RoundButton
                    label={__('Minimize')}
                    variant="minimal"
                    icon={<IconSubtract color="cerulean" />}
                    onClick={this.handleMinimizeToggle}
                  />
                )}
              </li>
              <li>
                <RoundButton
                  label={__('Close')}
                  variant="minimal"
                  icon={<IconClose color="cerulean" />}
                  onClick={this.handleCloseFeedbackModal}
                />
              </li>
            </ul>
          </div>
          <div className={styles['content-wrapper']}>
            <div className={styles['content']}>
              {this._renderFeedbackForm()}
            </div>
            <div className={styles['footer']}>
              <Button
                onClick={this.handleSubmit}
                label={__('Send')}
                variant="primary"
                small
                disabled={!this.validateResponse()}
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default withFeedbackContext(FeedbackFormModal);

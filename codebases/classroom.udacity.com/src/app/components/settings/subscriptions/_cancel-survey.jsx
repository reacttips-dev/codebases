import { Button, Heading } from '@udacity/veritas-components';

import { CANCEL_SURVEY } from 'constants/cancel-survey';
import CancelQuestion from './_cancel-question';
import { FLEX_SUBSCRIPTION } from 'constants/payment-status';
import PropTypes from 'prop-types';
import { TYPES } from 'constants/survey';
import { __ } from 'services/localization-service';
import styles from './_assisted-cancel-followup.scss';

const initialState = {
  cancelReasonKey: '',
  cancelFollowUp: false,
  cancelInFlight: false,
  dropdownFollowUp: '',
  radioSelection: '',
  radioSelectionFollowUp: '',
  showInitialQuestion: true,
  otherText: '',
  otherTextFollowUp: '',
  otherTextAreaFollowUp: '',
};

@cssModule(styles)
export class CancelSurvey extends React.Component {
  static propTypes = {
    onSurveyComplete: PropTypes.func.isRequired,
    itemType: PropTypes.string.isRequired,
    isPreorder: PropTypes.bool.isRequired,
    periodEndDate: PropTypes.string,
    refundable: PropTypes.bool.isRequired,
  };

  state = initialState;

  resetCancelForm = () => {
    this.setState(initialState);
  };

  handleReasonChange = (reason) => {
    const radioSelection = _.get(reason, 'raw');
    const cancelReasonKey = _.get(reason, 'key');
    let showInitialQuestion = _.includes(['', 'Other'], radioSelection);
    let cancelFollowUp;

    // show the initial question if there's no follow up question
    // and mark cancelFollowUp question as complete
    if (!CANCEL_SURVEY.FOLLOW_UP_QUESTIONS[cancelReasonKey]) {
      showInitialQuestion = true;
      cancelFollowUp = true;
    } else {
      showInitialQuestion = false;
      cancelFollowUp = false;
    }

    this.setState({
      cancelReasonKey,
      radioSelection,
      showInitialQuestion,
      cancelFollowUp,
    });
  };

  handleFollowUpDropdownChange = (reason) => {
    const dropdownFollowUp = _.get(reason, 'value');
    const cancelFollowUp = dropdownFollowUp ? true : false;
    this.setState({ dropdownFollowUp, cancelFollowUp });
  };

  handleFollowUpReasonChange = (reason) => {
    const radioSelectionFollowUp = _.get(reason, 'raw');
    this.setState({ radioSelectionFollowUp, cancelFollowUp: true });
  };

  handleFollowUpTextAreaChange = (otherTextAreaFollowUp) => {
    const cancelFollowUp = !_.isEmpty(otherTextAreaFollowUp);
    this.setState({ otherTextAreaFollowUp, cancelFollowUp });
  };

  handleOtherReasonChange = (otherText) => {
    this.setState({ otherText, radioSelection: 'Other' });
  };

  handleOtherFollowUpChange = (otherTextFollowUp) => {
    this.setState({
      otherTextFollowUp,
      followUpSelection: 'Other',
      cancelFollowUp: true,
    });
  };

  handleCancelSurveyClick = async () => {
    const { onSurveyComplete } = this.props;
    const { cancelReasonKey } = this.state;
    const cancelReason = this.getCancelReason();
    const question = _.get(
      CANCEL_SURVEY.FOLLOW_UP_QUESTIONS,
      `[${cancelReasonKey}].question`
    );
    const reason = this.getCancelFollowUpReason();
    const followUp = {
      cancel_follow_up_question: question,
      cancel_follow_up_reason: reason,
    };

    this.setState({ cancelInFlight: true });
    await onSurveyComplete(cancelReason, followUp);
    this.setState({ cancelInFlight: false });

    this.resetCancelForm();
  };

  itemName = () => {
    const { itemType } = this.props;
    return itemType === FLEX_SUBSCRIPTION ? __('Subscription') : __('Payment');
  };

  getCancelReason = () => {
    const { radioSelection, otherText } = this.state;
    let cancelReason = radioSelection;
    if (radioSelection === 'Other') {
      cancelReason += ' - ' + otherText;
    }
    return cancelReason;
  };

  getCancelFollowUpReason = () => {
    const {
      dropdownFollowUp,
      radioSelectionFollowUp,
      otherTextFollowUp,
      otherTextAreaFollowUp,
    } = this.state;
    let cancelReason = '';
    if (radioSelectionFollowUp === 'Other') {
      cancelReason = radioSelectionFollowUp + ' - ' + otherTextFollowUp;
    } else {
      cancelReason =
        dropdownFollowUp || radioSelectionFollowUp || otherTextAreaFollowUp;
    }
    return cancelReason;
  };

  getCancelMessage = () => {
    const { itemType, periodEndDate, refundable } = this.props;
    let msg;
    switch (true) {
      // case isIntercomCancel && itemType === FLEX_SUBSCRIPTION && refundable:
      //   msg = __(
      //     "Tell us why you'd like to cancel so we can improve. We will reach out over email with more information on how to complete the cancellation process. Once completed, you will lose access immediately. Your refund will be posted to your billing history."
      //   );
      //   break;
      case itemType === FLEX_SUBSCRIPTION && refundable:
        msg = __(
          'To help us improve our programs, please let us know why you would like to cancel. Canceling your subscription will result in loss of access immediately. Your refund will be posted to your billing history.'
        );
        break;
      // case isIntercomCancel && itemType === FLEX_SUBSCRIPTION && !refundable:
      //   msg = isPreorder
      //     ? __(
      //         "Tell us why you'd like to cancel so we can improve. Canceling your subscription will discontinue future and auto-renew payments."
      //       )
      //     : __(
      //         "Tell us why you'd like to cancel so we can improve. We will reach out over email with more information on how to complete the cancellation process. Once completed, your subscription will discontinue future and auto-renew payments. Your enrollment will be active through <%= periodEndDate %>.",
      //         {periodEndDate}
      //       );
      //   break;
      case itemType === FLEX_SUBSCRIPTION && !refundable:
        msg = /*isPreorder
          ? __(
              "Tell us why you'd like to cancel so we can improve. Canceling your subscription will discontinue future and auto-renew payments."
            )
          : */ __(
          'To help us improve our programs, please let us know why you would like to cancel. Canceling your subscription will discontinue future and auto-renew payments. Your enrollment will be active through <%= periodEndDate %>.',
          { periodEndDate }
        );
        break;
      default:
        msg = __(
          'To help us improve our programs, please let us know why you would like to cancel.'
        );
    }
    return msg;
  };

  renderInitialQuestion = () => {
    const { isPreorder } = this.props;
    const { radioSelection, otherText } = this.state;

    return (
      <CancelQuestion
        heading={<Heading size="h1">{__('Leaving So Soon?')}</Heading>}
        question={this.getCancelMessage()}
        reasons={CANCEL_SURVEY.getReasons({ isPreorder })}
        type={TYPES.RADIO}
        onReasonChange={this.handleReasonChange}
        radioSelection={radioSelection}
        value={radioSelection}
        hasOtherOption
        onOtherTextChange={this.handleOtherReasonChange}
        otherText={otherText}
      />
    );
  };

  renderFollowUpQuestion = (key) => {
    const followUp = CANCEL_SURVEY.FOLLOW_UP_QUESTIONS[key];

    if (!followUp) {
      return null;
    }

    const {
      radioSelectionFollowUp,
      dropdownFollowUp,
      otherTextFollowUp,
      otherTextAreaFollowUp,
    } = this.state;

    let value;
    switch (followUp.type) {
      case TYPES.DROPDOWN:
        value = dropdownFollowUp;
        break;
      case TYPES.RADIO:
        value = radioSelectionFollowUp;
        break;
      case TYPES.TEXT_AREA:
        value = otherTextAreaFollowUp;
        break;
      default:
        value = '';
    }

    return (
      <CancelQuestion
        heading={<Heading size="h1">{__('Tell us more')}</Heading>}
        question={followUp.question}
        reasons={followUp.options}
        type={followUp.type}
        onDropdownChange={this.handleFollowUpDropdownChange}
        onReasonChange={this.handleFollowUpReasonChange}
        radioSelection={this.radioSelectionFollowUp}
        hasOtherOption={followUp.hasOtherOption}
        value={value}
        onOtherTextChange={this.handleOtherFollowUpChange}
        otherText={otherTextFollowUp}
        onTextChange={this.handleFollowUpTextAreaChange}
        hiddenLabel={followUp.hiddenLabel}
      />
    );
  };

  render() {
    const {
      cancelFollowUp,
      cancelInFlight,
      cancelReasonKey,
      showInitialQuestion,
      otherText,
    } = this.state;

    let question;
    if (showInitialQuestion) {
      question = this.renderInitialQuestion();
    } else if (cancelReasonKey) {
      question = this.renderFollowUpQuestion(cancelReasonKey);
    }

    return (
      <div>
        {question}
        <Button
          label={__('Cancel <%= item_name %>', {
            item_name: this.itemName(),
          })}
          disabled={
            _.isEmpty(cancelReasonKey) ||
            (_.isEmpty(otherText) && !cancelFollowUp) ||
            cancelInFlight
          }
          variant="destructive"
          onClick={this.handleCancelSurveyClick}
        />
      </div>
    );
  }
}

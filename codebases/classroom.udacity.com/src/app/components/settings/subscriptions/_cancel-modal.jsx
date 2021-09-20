import * as CANCEL from './_cancel-flow-constants';
import { CancelByChat, CancelError } from './_assisted-cancel-followup';
import {
  SUPPORT_BY,
  bestSupportOption,
  sendCancelDiscountEvent,
  sendCancelRequestInitiated,
  sendModalCloseEvent,
  sendModalOpenEvent,
} from './_cancel-flow-logic';
import { CancelSurvey } from './_cancel-survey';
import CancelSurveyWithDiscount from './_cancel-survey-with-discount';
import { Modal } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { i18n } from 'services/localization-service';
import styles from './_cancel-modal.scss';

@cssModule(styles)
export default class CancelModal extends React.Component {
  static displayName = 'settings/setting-subscriptions/_cancel-modal';

  static propTypes = {
    cancelEventProps: PropTypes.object.isRequired,
    cancelFlowFeatures: PropTypes.object.isRequired,
    itemType: PropTypes.string.isRequired,
    isPreorder: PropTypes.bool.isRequired,
    handleOrderHistoryUpdate: PropTypes.func.isRequired,
    nanodegreeTitle: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    onSelfServeCancel: PropTypes.func.isRequired,
    onSelfServeDiscountApplied: PropTypes.func.isRequired,
    periodEndDate: PropTypes.string,
    refundable: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
  };

  state = {
    chatId: CANCEL.INTERCOM_ID.CHAT,
    modalType: SUPPORT_BY.SELF_SERVE_DISCOUNT.name,
  };

  componentDidUpdate(prevProps) {
    const justOpened = !prevProps.show && this.props.show;
    if (justOpened) {
      sendModalOpenEvent(this.props.cancelEventProps, this.state.modalType);
    }
  }

  handleModalClose = () => {
    const { handleOrderHistoryUpdate } = this.props;
    handleOrderHistoryUpdate();
    sendModalCloseEvent(this.props.cancelEventProps, this.state.modalType);
    this.props.onHide();
  };

  handleCatalogOpen = () => {
    sendCancelDiscountEvent(
      this.props.cancelEventProps,
      this.state.modalType,
      CANCEL.EVENT_LABEL.SELF_SERVE_DISCOUNT_SEARCH_CATALOG
    );
    window.open('https://www.udacity.com/courses/all');
  };

  handleSelfServeCancel = async (cancelReason, followUp) => {
    this.sendCancelEvent(CANCEL.EVENT_LABEL.SELF_SERVE, {
      cancel_reason: cancelReason,
      cancel_follow_up: followUp,
    });

    await this.props.onSelfServeCancel(cancelReason, followUp);

    this.props.onHide();
  };

  handleSelfServeDiscountCancel = async (cancelReason) => {
    this.sendCancelEvent(CANCEL.EVENT_LABEL.SELF_SERVE_DISCOUNT_DISQUALIFIED, {
      cancel_reason: cancelReason,
    });

    await this.props.onSelfServeCancel(cancelReason);
  };

  handleSelfServeDiscountAbandoned = async (
    cancelReason,
    discountedAmount,
    subTotalAmount,
    refundedAmount
  ) => {
    sendCancelDiscountEvent(
      this.props.cancelEventProps,
      this.state.modalType,
      CANCEL.EVENT_LABEL.SELF_SERVE_DISCOUNT_ABANDONED,
      {
        cancel_reason: cancelReason,
        discounted_amount: discountedAmount,
        refunded_amount: refundedAmount,
        subtotal_amount: subTotalAmount,
      }
    );
  };

  handleSelfServeDiscountPresented = async (
    cancelReason,
    discountedAmount,
    subTotalAmount,
    refundedAmount
  ) => {
    sendCancelDiscountEvent(
      this.props.cancelEventProps,
      this.state.modalType,
      CANCEL.EVENT_LABEL.SELF_SERVE_DISCOUNT_PRESENTED,
      {
        cancel_reason: cancelReason,
        discounted_amount: discountedAmount,
        refunded_amount: refundedAmount,
        subtotal_amount: subTotalAmount,
      }
    );
  };

  handleSelfServeDiscountAccepted = async (
    cancelReason,
    discountedAmount,
    subTotalAmount,
    refundedAmount
  ) => {
    sendCancelDiscountEvent(
      this.props.cancelEventProps,
      this.state.modalType,
      CANCEL.EVENT_LABEL.SELF_SERVE_DISCOUNT_ACCEPTED,
      {
        cancel_reason: cancelReason,
        discounted_amount: discountedAmount,
        refunded_amount: refundedAmount,
        subtotal_amount: subTotalAmount,
      }
    );
  };

  handleSelfServeDiscountApplied = async (
    cancelReason,
    discountedAmount,
    subTotalAmount,
    refundedAmount
  ) => {
    sendCancelDiscountEvent(
      this.props.cancelEventProps,
      this.state.modalType,
      CANCEL.EVENT_LABEL.SELF_SERVE_DISCOUNT_APPLIED,
      {
        cancel_reason: cancelReason,
        discounted_amount: discountedAmount,
        refunded_amount: refundedAmount,
        subtotal_amount: subTotalAmount,
      }
    );

    await this.props.onSelfServeDiscountApplied();
    this.props.onHide();
  };

  handleSelfServeDiscountApplyFailed = async (
    cancelReason,
    discountedAmount,
    subTotalAmount,
    refundedAmount
  ) => {
    sendCancelDiscountEvent(
      this.props.cancelEventProps,
      this.state.modalType,
      CANCEL.EVENT_LABEL.SELF_SERVE_DISCOUNT_APPLY_FAILED,
      {
        cancel_reason: cancelReason,
        discounted_amount: discountedAmount,
        refunded_amount: refundedAmount,
        subtotal_amount: subTotalAmount,
      }
    );
  };

  handleAlternateCancelOption = (alternateCancelOption) => {
    this.setState({ modalType: alternateCancelOption });
  };

  preventIntercomDuplicates = () => {
    if (this.state.chatId) {
      this.setState({ chatId: '' });
    } else {
      // eslint-disable-next-line new-cap
      typeof window.Intercom === 'function' && window.Intercom('show');
    }
  };

  sendCancelEvent = (label, extraProps) => {
    sendCancelRequestInitiated(
      this.props.cancelEventProps,
      this.state.modalType,
      label,
      extraProps
    );
  };

  renderCancelModal() {
    switch (this.state.modalType) {
      case SUPPORT_BY.CHAT.name:
        return (
          <CancelByChat
            chatId={this.state.chatId}
            handleChat={() => {
              this.sendCancelEvent(CANCEL.EVENT_LABEL.CHAT_CLICKED);
              this.preventIntercomDuplicates();
            }}
          />
        );
      case SUPPORT_BY.SELF_SERVE.name: {
        const { itemType, periodEndDate, isPreorder, refundable } = this.props;

        return (
          <CancelSurvey
            onSurveyComplete={this.handleSelfServeCancel}
            itemType={itemType}
            periodEndDate={periodEndDate}
            isPreorder={isPreorder}
            refundable={refundable}
          />
        );
      }
      case SUPPORT_BY.SELF_SERVE_DISCOUNT.name: {
        const {
          itemType,
          periodEndDate,
          isPreorder,
          refundable,
          subscriptionUrn,
          originalPrice,
          nanodegreeTitle,
          cancelFlowFeatures,
        } = this.props;

        const alternateCancelOption = bestSupportOption(
          i18n.getCountryCode(),
          cancelFlowFeatures
        );

        return (
          <CancelSurveyWithDiscount
            onSurveyCancel={this.handleSelfServeDiscountCancel}
            onSurveyDiscountApplied={this.handleSelfServeDiscountApplied}
            onSurveyDiscountAccepted={this.handleSelfServeDiscountAccepted}
            onSurveyDiscountApplyFailed={
              this.handleSelfServeDiscountApplyFailed
            }
            onSurveyDiscountPresented={this.handleSelfServeDiscountPresented}
            onSurveyDiscountAbandoned={this.handleSelfServeDiscountAbandoned}
            handleSurveyModalClose={this.handleModalClose}
            handleCatalogOpen={this.handleCatalogOpen}
            handleAlternateCancelOption={this.handleAlternateCancelOption}
            itemType={itemType}
            periodEndDate={periodEndDate}
            isPreorder={isPreorder}
            refundable={refundable}
            subscriptionUrn={subscriptionUrn}
            originalPrice={originalPrice}
            nanodegreeTitle={nanodegreeTitle}
            alternateCancelOption={alternateCancelOption}
          />
        );
      }
      default:
        return <CancelError />;
    }
  }

  render() {
    return (
      <Modal
        open={this.props.show}
        onClose={this.handleModalClose}
        label={__('Cancel Subscription')}
        closeLabel={__('Close Modal')}
        scrollable={false}
      >
        {this.renderCancelModal()}
      </Modal>
    );
  }
}

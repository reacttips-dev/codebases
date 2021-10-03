import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { StyledPaymentDetailsModalBody } from "../../../_components/styled/home/stylesHome";
import moment from "moment";
import { BILLING_AND_PRICING_DATE_FORMAT } from "../../../_components/details/constants";
import { StyledButton } from "../../../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BILLING_PLANS } from "../../../_utils/routes";
import { withRouter } from "react-router-dom";

class TldrPaymentDetailsModal extends Component {
  viewAllPlans = () => {
    this.props.onHide();
    this.props.history.push({
      pathname: BILLING_PLANS,
      state: {
        activeSubscription: this.props.subscription.subscribedPlan,
      },
    });
  };

  currencyFormatter = (amount) => {
    const { subscription } = this.props;

    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.subscribedPlan?.plan
        ? subscription?.subscribedPlan?.plan?.currency
        : "USD",
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  render() {
    const { show, onHide, subscription } = this.props;
    const totalAmount = parseFloat(
      subscription?.subscribedPlan?.plan?.amount *
        subscription.subscribedPlan?.quantity
    ).toFixed(2);

    return (
      <Modal show={show} onHide={onHide} centered size="md" backdrop="static">
        <Modal.Header>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>

        <hr className="modal-hr" />
        <StyledPaymentDetailsModalBody>
          <div className="plan-details-row">
            <div className="plan-period-column">
              <span className="plan-period-title">Period</span>
              <span className="period-start-end-dates">
                {moment(
                  subscription?.subscribedPlan?.current_period_start
                ).format(BILLING_AND_PRICING_DATE_FORMAT)}{" "}
                -{" "}
                {moment(
                  subscription?.subscribedPlan?.current_period_end
                ).format(BILLING_AND_PRICING_DATE_FORMAT)}
              </span>
            </div>
            <div className="plan-period-column">
              <span className="plan-period-title">Payment Method</span>
              <span className="payment-method-details">
                •••• •••• ••••{" "}
                {
                  subscription?.subscribedPlan?.customer?.payment_method?.card
                    ?.last4
                }
              </span>
            </div>
          </div>
          <div className="payment-details-separator" />
          <div className="plan-details-row">
            <span>{subscription?.subscribedPlan?.plan?.product?.name}</span>

            <div>
              <span>
                {subscription?.subscribedPlan?.quantity} x{" "}
                {this.currencyFormatter(
                  subscription?.subscribedPlan?.plan?.amount
                )}
              </span>
            </div>
          </div>
          <div className="payment-details-separator" />
          <span className="total-amount">
            <span>Total</span>
            <span>{this.currencyFormatter(totalAmount)}</span>
          </span>

          <StyledButton className="mt-3 buttons">
            Change Payment Method
            <FontAwesomeIcon icon="arrow-right" className="ml-2" />
          </StyledButton>

          <StyledButton
            className="mt-3 buttons"
            onClick={() => this.viewAllPlans()}
          >
            {subscription.subscribedPlan.hasOwnProperty("plan")
              ? "Change Plan"
              : "View plans"}
            <FontAwesomeIcon icon="arrow-right" className="ml-2" />
          </StyledButton>
        </StyledPaymentDetailsModalBody>
        <hr className="modal-hr" />

        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onHide();
            }}
            variant="warning"
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  subscription: state.subscription,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TldrPaymentDetailsModal));

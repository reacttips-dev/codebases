import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import { BILLING_PLANS } from "../../../_utils/routes";
import { StyledPaymentStatusModalBody } from "../../../_components/styled/home/stylesHome";

class TldrUpgradeSubscriptionModal extends Component {
  viewAllPlans = () => {
    const { subscription } = this.props;

    this.props.history.push({
      pathname: BILLING_PLANS,
      state: {
        activeSubscription: subscription.subscribedPlan,
      },
    });
  };

  render() {
    const { show, onHide } = this.props;

    return (
      <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
        <Modal.Header>
          <Modal.Title>Upgrade Subscription</Modal.Title>
        </Modal.Header>

        <hr className="modal-hr" />
        <StyledPaymentStatusModalBody>
          <FontAwesomeIcon icon="frown" className="icon" />
          <p className="title">Oops!</p>
          <p className="body-text">
            This feature is not available in your current plan. Please upgrade
            to use this feature.
          </p>
        </StyledPaymentStatusModalBody>
        <hr className="modal-hr" />

        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onHide();
            }}
            variant="outline-warning"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              this.viewAllPlans();
            }}
            variant="warning"
          >
            View Plans
            <FontAwesomeIcon icon="arrow-right" className="ml-2" />
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
)(withRouter(TldrUpgradeSubscriptionModal));

import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { StyledTrialPeriodEndedModalBody } from "../../../_components/styled/home/stylesHome";
import { withRouter } from "react-router-dom";
import { BILLING_PLANS } from "../../../_utils/routes";
import { BrandTextLogo } from "../../../_components/common/statelessView";

class TldrTrialEndedModal extends Component {
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
    const { show } = this.props;

    return (
      <Modal show={show} centered size="lg" backdrop="static">
        <StyledTrialPeriodEndedModalBody>
          <div className="modal-content-column">
            <BrandTextLogo height={40} width={160} />

            <span className="heading">free trial has ended!</span>

            <span className="message">
              We hope you have enjoyed using Simplified at its best in this 14
              days trial. To continue using our platform please choose one of
              our plans.
            </span>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                this.viewAllPlans();
              }}
              variant="warning"
              className="modal-button"
            >
              Choose a Plan
            </Button>
          </div>

          <div className="modal-img-column">
            <img
              src="https://assets.simplified.co/images/templates-collage.png"
              alt=""
            />
          </div>
        </StyledTrialPeriodEndedModalBody>
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
)(withRouter(TldrTrialEndedModal));

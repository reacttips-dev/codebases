import React, { useState } from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  StyledCurrentPlanWrapper,
  StyledCurrentPlanContainer,
} from "../../_components/styled/settings/stylesSettings";
import { StyledButton } from "../../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import TldrCancelSubscriptionModal from "./Modals/TldrCancelSubscriptionModal";
import {
  cancelSubscription,
  redirectToCheckout,
} from "../../_actions/subscriptionActions";
import TldrPaymentDetailsModal from "./Modals/TldrPaymentDetailsModal";
import { BILLING_AND_PRICING_DATE_FORMAT } from "../../_components/details/constants";

const TldrCurrentPlan = (props) => {
  const history = useHistory();
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);

  function viewAllPlans() {
    // history.push({
    //   pathname: BILLING_PLANS,
    //   state: {
    //     activeSubscription: props.subscription.subscribedPlan,
    //   },
    // });
  }

  function cancelSubscription() {
    const { subscription } = props;

    setLoading(true);
    props
      .cancelSubscription(
        subscription.subscribedPlan?.id,
        subscription.subscribedPlan?.current_period_end
      )
      .then(() => {
        setShowCancelSubscriptionModal(false);
        setLoading(false);
      });
  }

  function currencyFormatter(amount) {
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.subscribedPlan?.plan
        ? subscription?.subscribedPlan?.plan?.currency
        : "USD",
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  }

  const { subscription } = props;
  const { plan, current_period_end, trial_end, trial_remaining_days } =
    subscription.subscribedPlan;
  const nextPaymentDate = moment(current_period_end).format(
    BILLING_AND_PRICING_DATE_FORMAT
  );
  const freeTrialEndDate = moment(trial_end).format(
    BILLING_AND_PRICING_DATE_FORMAT
  );

  return (
    <>
      {isEmpty(subscription.subscribedPlan) ? (
        <>
          Something went wrong while fetching your subscription, please try
          again later.
        </>
      ) : (
        <>
          <StyledCurrentPlanWrapper>
            <div className="content-div">
              <StyledCurrentPlanContainer>
                <Row>
                  {subscription.subscribedPlan.hasOwnProperty("plan") ? (
                    <>
                      <Col>
                        <span className="current-plan-headings">Your Plan</span>
                        <div className="current-plan-price-column">
                          <p className="current-plan-title">
                            {plan?.product.name ? plan?.product.name : "-"}
                          </p>
                          <p className="current-plan-price-subtitle">
                            {plan?.product?.description}
                          </p>
                          {/* <p className="current-plan-price-subtitle">
                            {subscription.subscribedPlan?.quantity} member(s)
                          </p> */}
                        </div>
                      </Col>
                      <Col>
                        <span className="current-plan-headings">
                          For
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="payment-details">
                                Payment details
                              </Tooltip>
                            }
                          >
                            <FontAwesomeIcon
                              icon="info-circle"
                              onClick={() => {
                                setShowPaymentDetailsModal(true);
                              }}
                            />
                          </OverlayTrigger>
                        </span>
                        <div className="current-plan-price-column">
                          <p className="current-plan-price-title">
                            {plan?.amount
                              ? plan?.amount > 0
                                ? `${currencyFormatter(plan?.amount)}`
                                : "Free"
                              : "-"}
                          </p>
                          <p className="current-plan-price-subtitle">
                            {plan?.interval
                              ? plan?.interval !== null &&
                                parseInt(plan?.amount) > 0
                                ? `per ${plan?.interval} per member`
                                : "For as long as you wish"
                              : ""}
                          </p>
                        </div>
                      </Col>
                      <Col>
                        <span className="current-plan-headings">
                          {trial_remaining_days !== null &&
                          trial_remaining_days >= 0
                            ? "Free until"
                            : "Your Next bill"}
                        </span>
                        <div className="current-plan-price-column">
                          <p className="current-plan-title">
                            {trial_remaining_days !== null &&
                            trial_remaining_days >= 0
                              ? freeTrialEndDate
                              : parseInt(plan?.amount) > 0
                              ? nextPaymentDate
                              : "-"}
                          </p>
                          {trial_remaining_days !== null &&
                          trial_remaining_days >= 0 ? (
                            <p className="current-plan-price-subtitle">
                              {trial_remaining_days === 0
                                ? "Your trial ends today"
                                : trial_remaining_days === 1
                                ? `${trial_remaining_days} day remaining`
                                : trial_remaining_days > 1
                                ? `${trial_remaining_days} days remaining`
                                : null}
                            </p>
                          ) : null}
                        </div>
                      </Col>
                    </>
                  ) : (
                    <Col>
                      <span className="current-plan-headings">Your Plan</span>
                      <div className="current-plan-price-column">
                        <p className="current-plan-title">
                          {plan?.product.name
                            ? plan?.product.name
                            : subscription?.subscribedPlan?.name}
                        </p>
                        {trial_remaining_days !== null &&
                        trial_remaining_days < 0 ? (
                          <p className="current-plan-price-subtitle trial-ended-warning">
                            Your trial period is over. Please consider upgrading
                            the subscription.
                          </p>
                        ) : (
                          <p className="current-plan-price-subtitle">
                            {trial_remaining_days === 0
                              ? "Your trial ends today"
                              : trial_remaining_days === 1
                              ? `${trial_remaining_days} day remaining`
                              : trial_remaining_days > 1
                              ? `${trial_remaining_days} days remaining`
                              : null}
                          </p>
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
              </StyledCurrentPlanContainer>
            </div>
            <div className="current-plan-buttons-column">
              <StyledButton className="buttons" onClick={() => viewAllPlans()}>
                {subscription.subscribedPlan.hasOwnProperty("plan")
                  ? "Change Plan"
                  : "Coming soon.."}
                <FontAwesomeIcon icon="arrow-right" className="ml-2" />
              </StyledButton>
            </div>
          </StyledCurrentPlanWrapper>

          <TldrCancelSubscriptionModal
            show={showCancelSubscriptionModal}
            onHide={() => {
              setShowCancelSubscriptionModal(false);
            }}
            onYes={() => cancelSubscription()}
            loading={loading}
          />

          <TldrPaymentDetailsModal
            show={showPaymentDetailsModal}
            onHide={() => {
              setShowPaymentDetailsModal(false);
            }}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  subscription: state.subscription,
});

const mapDispatchToProps = (dispatch) => ({
  cancelSubscription: (id, endDate) =>
    dispatch(cancelSubscription(id, endDate)),
  redirectToCheckout: (stripeObj, priceId) =>
    dispatch(redirectToCheckout(stripeObj, priceId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrCurrentPlan);

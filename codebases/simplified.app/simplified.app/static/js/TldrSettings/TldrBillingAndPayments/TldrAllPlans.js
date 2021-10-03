import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyledAllAvailablePlansContainer,
  StyledAllPlansComponent,
  StyledSubscriptionPlanCard,
} from "../../_components/styled/settings/stylesSettings";
import {
  ALL_SUBSCRIPTION_PLANS_ENDPOINT,
  SUBSCRIPTION_ENDPOINT,
  CREATE_CHECKOUT_SESSION_ENDPOINT,
  SHOW_MY_TEAM_MEMBERS,
} from "../../_actions/endpoints";
import { handleHTTPError } from "../../_actions/errorHandlerActions";
import {
  StyledButton,
  StyledNavbarButton,
} from "../../_components/styled/styles";
import { ShowCenterSpinner } from "../../_components/common/statelessView";
import Switch from "react-switch";
import { accent, accentGrey, white } from "../../_components/styled/variable";
import { useHistory } from "react-router-dom";
import { BILLING_AND_PAYMENT } from "../../_utils/routes";
import { Breadcrumb, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import Format from "string-format";
import { connect } from "react-redux";
import { showToast } from "../../_actions/toastActions";
import { subscriptionFeaturesList } from "../../_components/details/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TldrPaymentStatusModal from "./Modals/TldrPaymentStatusModal";
import { redirectToCheckout } from "../../_actions/subscriptionActions";
import { useStripe } from "@stripe/react-stripe-js";
import TldrPlanSwitchConfirmationModal from "./Modals/TldrPlanSwitchConfirmationModal";
import { syncWorkSpaces } from "../../_actions/authActions";

const TldrAllPlans = (props) => {
  const history = useHistory();
  const stripe = useStripe();
  const [resData, setResData] = useState({
    payload: [],
    loaded: false,
  });
  const [updatingPlan, setUpdatinPlan] = useState(false);
  const [checked, setChecked] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState(
    history.location.state.activeSubscription
  );
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState({
    state: false,
    title: "",
    status: "",
  });
  const [adminMember, setAdminMember] = useState({});
  const [currentOrgMembers, setCurrentOrgMembers] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState({
    state: false,
    grade: "",
    selectedPlan: null,
  });

  useEffect(() => {
    fetchSubscriptionPlans();
    fetchCurrentMembers();
  }, []);

  function fetchSubscriptionPlans() {
    axios
      .get(ALL_SUBSCRIPTION_PLANS_ENDPOINT)
      .then((res) => {
        setResData({
          payload: res.data.results,
          loaded: true,
        });
      })
      .catch((error) => {
        handleHTTPError(error);
      });
  }

  function fetchCurrentMembers() {
    const { payload } = props.auth;
    axios
      .get(SHOW_MY_TEAM_MEMBERS + payload.selectedOrg + "/members")
      .then((res) => {
        setCurrentOrgMembers(res.data.count);
        res.data.results.forEach((member) => {
          if (member.is_admin) {
            setAdminMember(member);
          }
        });
      })
      .catch((error) => {
        handleHTTPError(error, props);
      });
  }

  function changeSubscription(newPlan) {
    setUpdatinPlan(true);

    axios
      .put(Format(SUBSCRIPTION_ENDPOINT, activeSubscription?.id), {
        plan: newPlan.id,
      })
      .then((res) => {
        setUpdatinPlan(false);
        setShowConfirmationModal({
          state: false,
          grade: "",
          selectedPlan: null,
        });
        setShowPaymentStatusModal({
          state: true,
          status: "success",
        });
        props.syncWorkSpaces(() => {});
      })
      .catch((error) => {
        setUpdatinPlan(false);
        setShowPaymentStatusModal({
          state: true,
          status: "error",
        });

        handleHTTPError(error);
      });
  }

  function closeAllPlans() {
    history.replace(BILLING_AND_PAYMENT);
  }

  function onSwitchChange(checked, event, id) {
    setChecked(checked);
  }

  function openCheckoutForm(selectedPlan) {
    if (parseInt(selectedPlan?.unit_amount) === 0 && currentOrgMembers > 1) {
      return;
    }
    if (adminMember?.user_id !== auth?.payload?.user?.pk) {
      return;
    }

    const { subscribedPlan } = props.subscription;
    if (
      selectedPlan?.unit_amount > 0 &&
      (subscribedPlan.customer === undefined ||
        (subscribedPlan.customer !== undefined &&
          subscribedPlan?.customer?.payment_method?.card === null))
    ) {
      axios
        .post(CREATE_CHECKOUT_SESSION_ENDPOINT, { price: selectedPlan.id })
        .then((res) => {
          stripe.redirectToCheckout({ sessionId: res.data.session_id });
        });
    } else {
      setShowConfirmationModal({
        state: true,
        grade:
          parseInt(subscribedPlan?.plan?.amount) >
          parseInt(selectedPlan?.unit_amount / 100)
            ? "downgrade"
            : "upgrade",
        selectedPlan: selectedPlan,
      });
    }
  }

  function currencyFormatter(amount) {
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: props.subscription?.subscribedPlan?.plan
        ? props.subscription?.subscribedPlan?.plan?.currency
        : "USD",
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  }

  var filteredPlans = [];
  const freePlan = resData.payload[0];
  const paidPlans = resData.payload.slice(1, resData.payload.length);
  filteredPlans = paidPlans.filter((plan) => {
    if (checked) {
      return plan.recurring.interval === "year";
    } else {
      return plan.recurring.interval === "month";
    }
  });
  filteredPlans.length > 0 && filteredPlans.unshift(freePlan);

  const { subscribedPlan } = props.subscription;
  const { auth } = props;
  const childElement = filteredPlans.map((plan, index) => {
    const { id, product, unit_amount } = plan;
    const isPlanActive = activeSubscription?.plan?.product.id === product.id;
    const basePrice = unit_amount / 100;

    return (
      <StyledSubscriptionPlanCard
        key={`${index}_${id}`}
        className={
          activeSubscription?.plan?.product.id === product.id
            ? "col card active"
            : "col card"
        }
        planColor={subscriptionFeaturesList[index]?.color}
      >
        <div className="title">{product.name}</div>
        <p className="plan-context">
          {subscriptionFeaturesList[index]?.context}
        </p>
        <div className="price-title">
          {!checked
            ? `${currencyFormatter(basePrice)}`
            : `${currencyFormatter(basePrice / 12)}`}
          <p>per month</p>
        </div>
        <div className="subscription-plan-footer">
          <p>
            {parseInt(basePrice) === 0
              ? "Free for as long as you wish"
              : !checked
              ? `per member`
              : `${currencyFormatter(basePrice)} per year per member`}
          </p>
          {isPlanActive ? (
            <span className="mt-1 mb-1 mt-3 current-plan-text">
              Current Plan
            </span>
          ) : (
            <OverlayTrigger
              placement="bottom"
              overlay={
                parseInt(basePrice) === 0 && currentOrgMembers > 1 ? (
                  <Tooltip>
                    The free forever plan is only available for solo or personal
                    use; if you would like to use the "Free forever" plan,
                    please remove the members from this workspace or create new
                    workspace.
                  </Tooltip>
                ) : adminMember?.user_id !== auth?.payload?.user?.pk ? (
                  <Tooltip>
                    You need to be the owner of this workspace to switch
                    subscriptions.
                  </Tooltip>
                ) : (
                  <div></div>
                )
              }
            >
              <StyledButton
                className={
                  (parseInt(basePrice) === 0 && currentOrgMembers > 1) ||
                  adminMember?.user_id !== auth?.payload?.user?.pk
                    ? "mt-1 mb-1 mt-3 upgrade-plan-button disabled"
                    : "mt-1 mb-1 mt-3 upgrade-plan-button enabled"
                }
                tldrbtn="primary"
                key="add"
                onClick={() => openCheckoutForm(plan)}
              >
                {updatingPlan[index] ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Please wait...</span>
                  </>
                ) : (
                  <div>
                    {parseInt(subscribedPlan?.plan?.amount) > basePrice
                      ? "Downgrade"
                      : "Upgrade"}
                  </div>
                )}
              </StyledButton>
            </OverlayTrigger>
          )}
        </div>
        <hr className="tldr-hl" />
        <p className="plan-additional-feature">
          {subscriptionFeaturesList[index]?.additional_feature}
        </p>
        <div className="plan-features-list">
          <ul className="feature-unordered-list">
            {subscriptionFeaturesList[index]?.features.map((feature, index) => {
              return <li key={index}>{feature}</li>;
            })}
          </ul>
        </div>
      </StyledSubscriptionPlanCard>
    );
  });

  return (
    <>
      <StyledAllAvailablePlansContainer>
        <Breadcrumb>
          <Breadcrumb.Item onClick={closeAllPlans}>Billing</Breadcrumb.Item>
          <Breadcrumb.Item active>All plans</Breadcrumb.Item>
        </Breadcrumb>
        {!resData.loaded ? (
          <ShowCenterSpinner loaded={resData.loaded} />
        ) : (
          <StyledAllPlansComponent>
            <div className="payment-type-row">
              {subscribedPlan?.trial_remaining_days < 0 && (
                <span className="subscription-free-period-info">
                  {subscribedPlan?.trial_remaining_days < 0
                    ? "Trial period is over."
                    : subscribedPlan?.trial_remaining_days === 0
                    ? "Your trial ends today"
                    : subscribedPlan?.trial_remaining_days === 1
                    ? `${subscribedPlan?.trial_remaining_days} free day remaining`
                    : subscribedPlan?.trial_remaining_days > 1
                    ? `${subscribedPlan?.trial_remaining_days} free days remaining`
                    : null}
                </span>
              )}

              <div className="additional-members-container">
                <FontAwesomeIcon icon="users" className="mr-2" />
                <span>{`${currentOrgMembers} member(s)`}</span>
              </div>

              <div className="plan-billing-cycle-type-container">
                <span
                  className={
                    checked ? "input-options-text" : "input-options-text active"
                  }
                >
                  Billed monthly
                </span>
                <Switch
                  onChange={onSwitchChange}
                  checked={checked}
                  offColor={white}
                  onColor={accent}
                  offHandleColor={accentGrey}
                  checkedIcon={false}
                  uncheckedIcon={false}
                  height={15}
                  width={40}
                />
                <span
                  className={
                    checked ? "input-options-text active" : "input-options-text"
                  }
                >
                  Billed annually, <span>(20% off)</span>
                </span>
              </div>
            </div>

            <div className="section">
              <div className="row">{childElement}</div>
            </div>

            <StyledNavbarButton
              className="mt-4"
              onClick={() => {
                window.open("https://simplified.co/pricing", "_blank");
              }}
            >
              Learn More
              <FontAwesomeIcon icon="arrow-right" className="ml-2" />
            </StyledNavbarButton>
          </StyledAllPlansComponent>
        )}
      </StyledAllAvailablePlansContainer>

      <TldrPaymentStatusModal
        show={showPaymentStatusModal.state}
        title={showPaymentStatusModal.title}
        bodyText={showPaymentStatusModal.bodyText}
        status={showPaymentStatusModal.status}
      />

      <TldrPlanSwitchConfirmationModal
        show={showConfirmationModal.state}
        grade={showConfirmationModal.grade}
        newSubscription={showConfirmationModal.selectedPlan}
        onHide={() =>
          setShowConfirmationModal({
            state: false,
            grade: "",
            selectedPlan: null,
          })
        }
        onYes={() => changeSubscription(showConfirmationModal.selectedPlan)}
        loading={updatingPlan}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  subscription: state.subscription,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  showToast: (payload) => dispatch(showToast(payload)),
  redirectToCheckout: (stripeObj, priceId) =>
    dispatch(redirectToCheckout(stripeObj, priceId)),
  syncWorkSpaces: (callback) => dispatch(syncWorkSpaces(callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrAllPlans);

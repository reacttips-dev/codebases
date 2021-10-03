import axios from "axios";
import {
  CANCEL_SUBSCRIPTION_ENDPOINT,
  CREATE_CHECKOUT_SESSION_ENDPOINT,
  SUBSCRIBED_PLAN_ENDPOINT,
  SUBSCRIPTION_PAYMENT_HISTORY_ENDPOINT,
} from "./endpoints";
import { handleHTTPError } from "./errorHandlerActions";
import { GET_SUBSCRIPTION } from "./types";
import Format from "string-format";
import { showToast } from "./toastActions";
import moment from "moment";
import { BILLING_AND_PRICING_DATE_FORMAT } from "../_components/details/constants";
import { analyticsTrackEvent } from "../_utils/common";
import { syncWorkSpaces } from "./authActions";

export const getSubscription = () => (dispatch) => {
  return axios
    .get(SUBSCRIBED_PLAN_ENDPOINT)
    .then((res) => {
      if (res.data?.subscription?.trial_remaining_days < 0) {
        dispatch(syncWorkSpaces(() => {}));
        analyticsTrackEvent("freeTrialEnded");
      }

      const today = new Date();
      if (
        res.data?.subscription?.plan?.amount > 0 &&
        moment(today).format(BILLING_AND_PRICING_DATE_FORMAT) >
          moment(res.data?.subscription?.current_period_end).format(
            BILLING_AND_PRICING_DATE_FORMAT
          )
      ) {
        analyticsTrackEvent("subscriptionEnded", {
          subscriptionId: res.data?.subscription?.plan?.id,
        });
      }

      dispatch({
        type: GET_SUBSCRIPTION,
        payload:
          res.data.status === 400
            ? { subscription: {}, features: [] }
            : res.data,
      });
    })
    .catch((error) => {
      handleHTTPError(error);
    });
};

export const cancelSubscription =
  (subscriptionId, subscriptionLastDate) => (dispatch) => {
    const lastDate = moment(subscriptionLastDate).format(
      BILLING_AND_PRICING_DATE_FORMAT
    );

    return axios
      .put(Format(CANCEL_SUBSCRIPTION_ENDPOINT, subscriptionId))
      .then((res) => {
        analyticsTrackEvent("subscriptionCancelled", {
          subscriptionId: subscriptionId,
        });

        dispatch(
          showToast({
            message: `Your Subscribtion is still valid till ${lastDate}`,
            heading: "Subscription cancelled!",
            type: "success",
          })
        );
      })
      .catch((error) => {
        handleHTTPError(error);
        dispatch(
          showToast({
            message: "Oops, something went wrong. Please try again later.",
            heading: "Error",
            type: "error",
          })
        );
      });
  };

export const redirectToCheckout = (stripe, priceId) => (dispatch) => {
  axios
    .post(CREATE_CHECKOUT_SESSION_ENDPOINT, { price: priceId })
    .then((res) => {
      stripe.redirectToCheckout({ sessionId: res.data.session_id });
    });
};

export const fetchPaymentHistory = () => (dispatch) => {
  return axios
    .get(SUBSCRIPTION_PAYMENT_HISTORY_ENDPOINT)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      handleHTTPError(error);
      return error;
    });
};

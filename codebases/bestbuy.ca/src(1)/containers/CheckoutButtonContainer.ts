import { connect } from "react-redux";
import { CheckoutButtonWrapper } from "../react/BasketPage/components/checkoutButtons/";
import { getLineItemIDsForUnacceptedServicePlans } from "../redux/selectors/offerIdsWithNoServicePlanAcceptedSelector";
import { highlightAcceptServicePlan } from "../redux/servicePlan";
const mapStateToProps = (state) => ({
    cart: state.cart,
    features: state.config.features,
    lineItemIDsForUnacceptedServicePlans: getLineItemIDsForUnacceptedServicePlans(state),
    servicePlans: state.servicePlan && state.servicePlan.availableServicePlans,
});
const mapDispatchToProps = (dispatch) => ({
    onServicePlansNotAccepted: (lineItemIDsForUnacceptedServicePlans) => {
        dispatch(highlightAcceptServicePlan(lineItemIDsForUnacceptedServicePlans));
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(CheckoutButtonWrapper);
//# sourceMappingURL=CheckoutButtonContainer.js.map
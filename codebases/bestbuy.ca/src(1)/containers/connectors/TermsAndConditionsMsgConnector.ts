import { connect } from "react-redux";
import * as FromCart from "../../redux/cart";
const mapStateToProps = (state, props) => {
    const selectedPlan = FromCart.getCurrentlyAttachedServicePlan(state.cart, props.parentLineItemId);
    const parentSku = FromCart.getSkuByLineItemId(state.cart, props.parentLineItemId);
    return {
        parentSku,
        selectedPlanSku: selectedPlan ? selectedPlan.sku.id : "",
    };
};
export default connect(mapStateToProps);
//# sourceMappingURL=TermsAndConditionsMsgConnector.js.map
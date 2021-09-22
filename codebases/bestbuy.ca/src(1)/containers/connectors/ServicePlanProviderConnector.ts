var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connect } from "react-redux";
import { CartStatus, LineItemType, } from "../../business-rules/entities";
import * as FromCart from "../../redux/cart";
import * as FromServicePlan from "../../redux/servicePlan";
const mapStateToProps = (state, props) => {
    const selectedPlan = FromCart.getCurrentlyAttachedServicePlan(state.cart, props.parentLineItemId);
    return {
        apiErrorOccurred: FromCart.isCartStatus(state.cart, CartStatus.FAILED),
        lineItemIDsWithNoWarrantyAccepted: state.servicePlan.lineItemIDsWithNoWarrantyAccepted,
        planType: FromServicePlan.getLineItemServicePlanType(state.servicePlan, props.parentLineItemId),
        plans: FromServicePlan.getServicePlans(state.servicePlan, props.parentLineItemId),
        selectedPlan: selectedPlan ? selectedPlan.sku.id : "",
    };
};
const mapDispatchToProps = (dispatch, ownProps) => ({
    onAdd: (sku) => __awaiter(void 0, void 0, void 0, function* () {
        yield dispatch(FromCart.addChildItem(ownProps.parentLineItemId, {
            lineItemType: LineItemType.Psp,
            quantity: 1,
            sku,
        }));
    }),
    onRemove: () => __awaiter(void 0, void 0, void 0, function* () {
        yield dispatch(FromCart.removeCurrentlyAttachedServicePlan(ownProps.parentLineItemId));
    }),
    onServicePlanAcceptChange: (isAccepted) => {
        dispatch(FromServicePlan.updateAcceptServicePlan(ownProps.parentLineItemId, isAccepted));
    },
});
export default connect(mapStateToProps, mapDispatchToProps);
//# sourceMappingURL=ServicePlanProviderConnector.js.map
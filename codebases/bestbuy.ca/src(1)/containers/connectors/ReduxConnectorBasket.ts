import { connect, } from "react-redux";
import { analyticsCartLoaded, analyticsMasterpassClicked, analyticsPaypalClicked, analyticsPostalCodeUpdated, analyticsVisaClicked, clearCart, clearCartFailureCode, clearRemovedItems, getBasketPage, removeChildItem, removeItem, resetAddOperationDialog, updateItemQuantity, } from "../../redux/cart";
const mapStateToProps = (state) => ({
    cart: state.cart,
});
const mapDispatchToProps = (dispatch, props) => ({
    analyticsCartLoaded: () => dispatch(analyticsCartLoaded()),
    analyticsPaypalClicked: () => dispatch(analyticsPaypalClicked()),
    analyticsPostalCodeUpdated: (postalCode) => dispatch(analyticsPostalCodeUpdated(postalCode)),
    analyticsVisaClicked: () => dispatch(analyticsVisaClicked()),
    cleanUp: () => dispatch(clearRemovedItems()),
    clearCart: () => dispatch(clearCart()),
    dismissCartError: () => dispatch(clearCartFailureCode()),
    getBasketPage: () => dispatch(getBasketPage(props.getAvailabilities, props.itemsToRemove)),
    onMasterpassClicked: () => dispatch(analyticsMasterpassClicked()),
    removeChildItem: (lineItemId, childItemId) => dispatch(removeChildItem(lineItemId, childItemId)),
    removeItem: (lineItemId) => dispatch(removeItem(lineItemId)),
    resetAddOperationDialog: () => dispatch(resetAddOperationDialog()),
    updateItemQuantity: (lineItemId, quantity) => dispatch(updateItemQuantity(lineItemId, quantity)),
});
export default connect(mapStateToProps, mapDispatchToProps);
//# sourceMappingURL=ReduxConnectorBasket.js.map
import { connect, } from "react-redux";
import { addToCart, clearCart, resetAddOperationDialog, showConfirmation, } from "../../redux/cart/";
import { confirmOrder, resetCheckout, reviewOrder } from "../../redux/checkout/";
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        checkout: state.checkout,
    };
};
const mapDispatchToProps = (dispatch) => ({
    add: (offer, onSuccessConfirmation) => dispatch(addToCart(offer, onSuccessConfirmation)),
    clearCart: () => dispatch(clearCart()),
    confirmOrder: () => dispatch(confirmOrder()),
    resetAddOperationDialog: () => dispatch(resetAddOperationDialog()),
    resetCheckout: () => dispatch(resetCheckout()),
    reviewOrder: (orderData) => dispatch(reviewOrder(orderData)),
    showConfirmation: () => dispatch(showConfirmation()),
});
export default connect(mapStateToProps, mapDispatchToProps);
//# sourceMappingURL=ReduxConnectorCheckout.js.map
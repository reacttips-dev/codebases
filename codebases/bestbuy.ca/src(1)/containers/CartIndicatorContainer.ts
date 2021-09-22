/**
 *  Point of contact for redux-connected component modules
 *
 *  ie: import { AddToCartComponent, Toaster } from 'components';
 *
 */
import { connect } from "react-redux";
import { CartIndicator } from "../react";
import { refillCart, resetAddOperationDialog } from "../redux/cart";
const mapStateToProps = (state) => ({
    apiStatusCode: state.cart.apiStatusCode,
    orderNumber: state.order && state.order.orderNumber,
    showConfirmation: state.cart.showConfirmation,
    status: state.cart.status,
    totalQuantity: state.cart.totalQuantity,
});
const mapDispatchToProps = (dispatch) => ({
    onClose: () => dispatch(resetAddOperationDialog()),
    onMount: () => dispatch(refillCart()),
});
export const CartIndicatorContainer = connect(mapStateToProps, mapDispatchToProps)(CartIndicator);
//# sourceMappingURL=CartIndicatorContainer.js.map
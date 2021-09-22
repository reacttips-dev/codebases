import { connect } from "react-redux";
import { getSkuByLineItemId } from "../../redux/cart/selectors";
const mapStateToProps = (state, ownProps) => ({
    sku: getSkuByLineItemId(state.cart, ownProps.lineItemId),
});
export default connect(mapStateToProps);
//# sourceMappingURL=ReduxBenefitLinkConnector.js.map
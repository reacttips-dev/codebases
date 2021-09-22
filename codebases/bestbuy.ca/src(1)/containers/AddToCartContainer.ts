/**
 *  Point of contact for redux-connected component modules
 *
 *  ie: import { AddToCartComponent, Toaster } from 'components';
 *
 */
import { AddToCart } from "../react/";
import ReduxConnectorCheckout from "./connectors/ReduxConnectorCheckout";
const AddToCartContainer = ReduxConnectorCheckout(AddToCart); // TODO Figure out proper types
export { AddToCartContainer, };
//# sourceMappingURL=AddToCartContainer.js.map
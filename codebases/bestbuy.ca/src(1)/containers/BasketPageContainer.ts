/**
 *  Point of contact for redux-connected component modules
 *
 *  ie: import { AddToCartComponent, Toaster } from 'components';
 *
 */
import { BasketPage } from "../react/";
import ReduxConnectorBasket from "./connectors/ReduxConnectorBasket";
const BasketPageContainer = ReduxConnectorBasket(BasketPage); // TODO Figure out proper types
export { BasketPageContainer, };
//# sourceMappingURL=BasketPageContainer.js.map
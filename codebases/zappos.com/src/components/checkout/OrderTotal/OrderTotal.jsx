import cn from 'classnames';

import PlaceOrder from 'components/checkout/OrderTotal/PlaceOrder';
import TermsAndConditions from 'components/checkout/OrderTotal/TermsAndConditions';
import Total from 'components/checkout/OrderTotal/Total';

import css from 'styles/containers/checkout/orderTotal.scss';

export const OrderTotal = ({ isOrderReadyToSubmit, isPlacingOrder, isStickyPlaceOrder, onPlaceOrderClick, orderTotal = 0 }) => (
  <ul className={cn(css.section, { [css.isSticky]: isStickyPlaceOrder })}>
    <li><Total total={orderTotal} /></li>
    <li><TermsAndConditions /></li>
    <li><PlaceOrder isOrderReadyToSubmit={isOrderReadyToSubmit} isPlacingOrder={isPlacingOrder} onPlaceOrderClick={onPlaceOrderClick} /></li>
  </ul>
);

export default OrderTotal;

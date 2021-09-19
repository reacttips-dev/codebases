import PropTypes from 'prop-types';

import css from 'styles/components/checkout/OrderTotal/placeOrder.scss';

const PlaceOrder = ({ isOrderReadyToSubmit, isPlacingOrder, onPlaceOrderClick }, { testId = f => f }) => (
  <div className={css.wrapper} data-test-id={testId('placeOrderSection')}>
    <button
      type="button"
      disabled={!isOrderReadyToSubmit || isPlacingOrder}
      className={css.button}
      data-test-id={testId('placeOrderButton')}
      onClick={onPlaceOrderClick}>{isPlacingOrder ? 'Submitting...' : 'Place Your Order'}</button>
  </div>
);

PlaceOrder.contextTypes = {
  testId: PropTypes.func
};

export default PlaceOrder;

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cn from 'classnames';

import { AppState } from 'types/app';
import useMartyContext from 'hooks/useMartyContext';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/cart/cartErrors.scss';

interface OwnProps {
  isModal?: boolean;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export const CartErrors = ({ cart, isModal = false }: Props) => {
  const {
    testId,
    marketplace: { cart: { cartName } }
  } = useMartyContext();

  const { error, cartObj: { savedItems } } = cart;

  return (
    (savedItems?.length || error) ?
      <div className={cn(css.container, { [css.modal]: isModal })}>
        <p data-test-id={testId('cartError')}>{error}</p>

        { !!savedItems?.length &&
          <p data-test-id={testId('oosError')}>An item in your {cartName} is out of stock. It will not show when you proceed to checkout.</p>
        }
      </div>
      :
      null
  );

};

export const mapStateToProps = (state: AppState) => {
  const { cart } = state;

  return {
    cart
  };
};

const connector = connect(mapStateToProps);
const ConnectedCartErrors = connector(CartErrors);
export default withErrorBoundary('CartErrors', ConnectedCartErrors);

import Uri from 'jsuri';

import Naptime from 'bundles/naptimejs';
import PropTypes from 'prop-types';
import React from 'react';
import { compose, getContext } from 'recompose';
import classnames from 'classnames';
import _ from 'lodash';
import CartsV2 from 'bundles/naptimejs/resources/carts.v2';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import constants from 'bundles/payments/common/constants';
import savedCartUtils from 'bundles/payments/lib/savedCartUtils';
import Imgix from 'js/components/Imgix';
import redirect from 'js/lib/coursera.redirect';
import path from 'js/lib/path';
import _t from 'i18n!nls/page';
import 'css!./__styles__/ShoppingCart';

type InputProps = {
  className?: string;
  hideAvatarBorder?: boolean;
};

type Props = InputProps & {
  cart?: CartsV2;
};

class ShoppingCart extends React.Component<Props> {
  componentDidMount() {
    const { cart } = this.props;
    if (!this.isValidCart(cart)) {
      savedCartUtils.reset();
    }
  }

  onClickHandler = (e: React.SyntheticEvent<any>): void => {
    e.preventDefault();
    redirect.setLocation(this.getCartPageUrl());
  };

  getCartPageUrl(): string {
    const cartInfo = savedCartUtils.get();
    const cartId = cartInfo && cartInfo.id;

    if (cartId) {
      return new Uri()
        .setPath(path.join(constants.rootPath, constants.cartUrl))
        .addQueryParam('cartId', cartId.toString())
        .toString();
    } else {
      return '/';
    }
  }

  isValidCart(cart?: CartsV2): boolean {
    return !!cart && !_.isEmpty(cart.cartItems);
  }

  render() {
    const { cart, hideAvatarBorder, className } = this.props;
    const hasCartToShow = this.isValidCart(cart);

    if (!hasCartToShow) {
      return null;
    }

    const cartPageUrl = this.getCartPageUrl();
    const classes = classnames('rc-ShoppingCart', className, {
      'rc-cart-left-border': hideAvatarBorder,
    });

    return (
      <li className={classes} role="menuitem">
        <TrackedA trackingName="cart" href={cartPageUrl} onClick={this.onClickHandler}>
          <Imgix src={constants.cartIcon} className="icon" alt={_t('Shopping cart: 1 item')} height={32} width={38} />
        </TrackedA>
      </li>
    );
  }
}

export default compose<Props, InputProps>(
  getContext({
    router: PropTypes.object.isRequired,
  }),
  // @ts-expect-error TSMIGRATION
  Naptime.createContainer(({ router }) => {
    const cartIdParam = router && router.location.query.cartId; // use the payments page cartId if available
    const cartInfo = savedCartUtils.get();
    const cartId = cartIdParam || (cartInfo && cartInfo.id);

    return {
      ...(cartId
        ? {
            cart: CartsV2.get(cartId),
          }
        : {}),
    };
  })
)(ShoppingCart);

import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import Link from 'components/hf/HFLink';
import { evModalInteraction } from 'events/modal';
import useMartyContext from 'hooks/useMartyContext';
import { ProductQuickViewLink } from 'components/productdetail/ProductQuickView';
import { getCardFlag } from 'helpers/cardUtils';
import { HYDRA_SEARCH_QUICK_SHOP } from 'constants/hydraTests';
import { getAssignmentGroup } from 'actions/ab';
import { AppState } from 'types/app';

import css from 'styles/components/common/productCardQuickShopLink.scss';

const ProductCardQuickShopLink = (props: any) => {
  const { appAdvertisement, hydraQuickShop, onClick, productId, styleId, colorId } = props;
  const { amethystTrack, testId, marketplace: { search: { hasStyleRoomFlag } } } = useMartyContext();
  const flag = getCardFlag({ ...props, hasStyleRoomFlag });
  const quickShopLinkClass = cn(css.quickShopLink, { [css.button]: hydraQuickShop === 2 });
  const productIdentifiers = { productId, styleId, colorId };

  if (!hydraQuickShop) {
    return null;
  }

  const onOpen = (e: React.MouseEvent<HTMLLinkElement>) => {
    amethystTrack(() => ([evModalInteraction, {
      modal: 'QUICK_SHOP_MODAL',
      type: 'MODAL_OPEN',
      method: e.detail ? 'MODAL_BUTTON_CLICK' : 'MODAL_KEY_PRESS',
      productIdentifiers
    }]));
  };

  const onClose = (e: React.MouseEvent<HTMLLinkElement>) => {
    amethystTrack(() => ([evModalInteraction, {
      modal: 'QUICK_SHOP_MODAL',
      type: 'MODAL_CLOSE',
      method: e.detail ? 'MODAL_BUTTON_CLICK' : 'MODAL_KEY_PRESS',
      productIdentifiers
    }]));
  };

  if (flag === 'style room') {
    return <Link
      to={props.link}
      className={quickShopLinkClass}
      onClick={onClick}
      data-test-id={testId('quickShopStyleRoomLink')}>Continue to Style Room</Link>;
  } else if (flag === 'trusted retailer') {
    return (
      <button className={quickShopLinkClass} type="button" onClick={onClick}>Shop at trusted site</button>
    );
  }

  return <ProductQuickViewLink
    onOpen={onOpen}
    onClose={onClose}
    className={quickShopLinkClass}
    cardData={props}
    hasBranchAd={appAdvertisement?.isShowing}>Quick Shop</ProductQuickViewLink>;
};

const mapStateToProps = (state: AppState) => {
  const { appAdvertisement } = state;
  return {
    hydraQuickShop: getAssignmentGroup(HYDRA_SEARCH_QUICK_SHOP, state),
    appAdvertisement
  };
};

export default connect(mapStateToProps, {})(ProductCardQuickShopLink);

import React, { useState } from 'react';
import loadable from '@loadable/component';
import cn from 'classnames';
import { parseUrl } from 'query-string';

import JanusPixel from 'components/common/JanusPixel';
import MelodyModal from 'components/common/MelodyModal';
import { QUICKVIEW_PRODUCT_MODAL_PAGE } from 'constants/amethystPageTypes';
import { combineSideEffects } from 'helpers/index.js';
import useUrlHash from 'hooks/useUrlHash';
import useMartyContext from 'hooks/useMartyContext';
import PlusCircle from 'components/icons/PlusCircle';
import { FormattedJanusReco } from 'types/mafia';
import { evModalInteraction } from 'events/modal';
import useEffectOnce from 'hooks/useEffectOnce';

const SimpleProductDetail = loadable(() => import('components/productdetail/SimpleProductDetail'));

import css from 'styles/components/productdetail/productQuickView.scss';

export interface QuickViewProps {
  closeModal: (args?: any) => void;
  // this is basically FormattedJanusReco | ProductSimilarStyle, but ProductSimilarStyle doesn't include link
  cardData: {
    styleId: string;
    productId: string;
    link?: string;
  };
  hasBranchAd?: boolean;
  options?: Options;
}

interface Options {
  hideCartModalPopUp?: boolean;
  addToCartText?: string;
  showSku?: boolean;
  hasStickAddToCart?: boolean;
  hasBranchAd?: boolean;
}

export const ProductQuickViewModal = ({ closeModal, cardData, options = { hideCartModalPopUp: false } }: QuickViewProps) => {
  const { styleId, productId, link } = cardData as FormattedJanusReco; // Realistically, `ProductSimilarStyle` would never go here
  const { router, amethystTrack } = useMartyContext();
  const { hideCartModalPopUp, hasStickAddToCart, hasBranchAd } = options;
  const janusQueryParams = { widget : 'RecordViewedItem', item : productId };
  const productQuery = { productId };
  useUrlHash(`quickview?productId=${productId}&styleId=${styleId}`, { hashEmptyEvent: closeModal });
  const linkToUse = link || `/product/${productId}`;

  const onViewDetailsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // prevent default link behavior
    amethystTrack(() => ([evModalInteraction, {
      modal: 'QUICK_SHOP_MODAL',
      type: 'MODAL_VIEW_DETAILS',
      method: e.detail ? 'MODAL_BUTTON_CLICK' : 'MODAL_KEY_PRESS'
    }]));
    window.history.back(); // removes the hash
    // Don't navigate forward until back event fired so we can make sure hash url state is removed so it cannot be returned to after heading to pdp
    window.addEventListener('popstate', () => void router.pushPreserveAppRoot(linkToUse), { once: true });
  };

  return <MelodyModal
    className={cn(css.modal, { [css.branchVisible]: hasBranchAd })}
    isOpen={true}
    onRequestClose={closeModal}
    contentLabel="Product Quick View"
    wrapperTestId="productQuickViewModal">
    <SimpleProductDetail
      id="product-quickview"
      productQuery={productQuery}
      initialStyleId={styleId}
      onAddToCart={(closeModal)}
      hideCartModalPopUp={hideCartModalPopUp}
      pageType={QUICKVIEW_PRODUCT_MODAL_PAGE}
      viewDetailsLink={linkToUse}
      onViewDetailsClick={onViewDetailsClick}
      hasStickAddToCart={hasStickAddToCart}/>
    <JanusPixel link={linkToUse} queryParams={janusQueryParams} />
  </MelodyModal>;
};

interface QuickViewRecoProps {
  cardData: FormattedJanusReco;
  onClick: (...args: any[]) => void;
  options?: Options;
  open?: boolean;
}

export const ProductQuickViewReco = ({ cardData, onClick, open: initialOpen = false, options = {} }: QuickViewRecoProps) => {
  const [open, setOpen] = useState(initialOpen);
  const { testId } = useMartyContext();
  const { addToCartText } = options;

  const closeModal = () => void setOpen(false);
  return <div className={css.emptySpace}>
    <button
      type="button"
      aria-label={`Open product quick view for ${cardData.brandName} ${cardData.productName}`}
      className={css.addItemButton}
      data-test-id={testId('addItemQuickviewButton')}
      onClick={combineSideEffects(() => setOpen(true), (e: React.MouseEvent<HTMLButtonElement>) => onClick(e, cardData))}>
      <div>
        <PlusCircle className={css.plusCircle}/>
        {addToCartText ? addToCartText : 'Add Item'}
      </div>
    </button>
    { open && <ProductQuickViewModal closeModal={closeModal} cardData={cardData} options={options}/> }
  </div>;
};

interface ProductQuickViewLinkProps {
  children: any;
  cardData: any;
  onOpen?: (args: any) => void;
  onClose?: (args: any) => void;
  className?: string;
  hasBranchAd?: boolean;
}

export const ProductQuickViewLink = ({ onOpen, onClose, children, cardData, className, hasBranchAd }: ProductQuickViewLinkProps) => {
  const [open, setOpen] = useState(false);
  const { testId } = useMartyContext();

  useEffectOnce(() => {
    if (!open && window.location.hash.includes('#quickview')) {
      const { query: { productId: modalProductId, styleId: modalStyleId } } = parseUrl(window.location.hash);
      if (modalProductId && modalStyleId && modalProductId === cardData.productId && modalStyleId === cardData.styleId) {
        setOpen(true);
      }
    }
  });

  const clickHandler = (e: any) => {
    setOpen(true);
    if (onOpen) {
      onOpen(e);
    }
  };

  const closeHandler = (e: any) => {
    setOpen(false);
    if (onClose) {
      onClose(e);
    }
  };

  const options = { hasBranchAd, hasStickAddToCart: true };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={clickHandler}
        data-test-id={testId('quickShopButton')}>{children}</button>
      {open && <ProductQuickViewModal
        cardData={cardData}
        closeModal={closeHandler}
        options={options}/>}
    </>
  );
};

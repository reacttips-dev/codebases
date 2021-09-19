import cn from 'classnames';
import React from 'react';
import template from 'lodash.template';
import { useInView } from 'react-intersection-observer';

import useMartyContext from 'hooks/useMartyContext';
import { AriaLiveTee } from 'components/common/AriaLive';
import ProductUtils from 'helpers/ProductUtils';
import { ProductSizing, ProductStyle } from 'types/cloudCatalog';
import { FormattedProductBundle } from 'reducers/detail/productDetail';
import { SelectedSizing } from 'types/product';
import AddToCartSticky from 'components/productdetail/stylepicker/AddToCartSticky';

import css from 'styles/components/productdetail/addToCart.scss';

interface Props {
  addToCartText: string;
  productDetail?: FormattedProductBundle;
  className?: string;
  hydraBlueSkyPdp: boolean;
  hydraStickyAddToCart: boolean;
  isGiftCard: string | boolean | undefined;
  lowStockMessage: string;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
  onHideSelectSizeTooltip: () => void;
  onShowSelectSizeTooltip: () => void;
  productStyle: ProductStyle;
  selectedSizing: SelectedSizing;
  sizing: ProductSizing;
  form?: string;
}

function formatBlueSkyStockMessage(message: string) {
  const pattern = /^Only (\d+) in stock$/;
  const match = message.match(pattern);
  return match ? `Only ${match[1]} left in stock!` : message;
}

const AddToCart = ({
  addToCartText,
  productDetail,
  className,
  hydraBlueSkyPdp,
  hydraStickyAddToCart,
  isGiftCard,
  lowStockMessage,
  onAddToCart,
  onHideSelectSizeTooltip,
  onShowSelectSizeTooltip,
  productStyle,
  selectedSizing,
  sizing,
  form
}: Props) => {
  const { marketplace: { pdp: { oosDisableButton } }, preventOnTouchDevice, testId } = useMartyContext();
  const { colorId, productId } = productStyle;
  let onHand = 1;
  let buttonText = addToCartText;
  let stockMessage;
  let stockInput;
  let stockId;
  let isDisabled;

  // If all dimensions are chosen, check the stock
  const isSelectionValid = ProductUtils.isSizeSelectionComplete(sizing, selectedSizing);
  if (isSelectionValid) {

    const stock = ProductUtils.getStockBySize(sizing.stockData, colorId, selectedSizing);

    if (stock) {
      stockInput = <input type="hidden" name="stockId" value={stock.id}/>;
      stockId = stock.id;
      onHand = parseInt(stock.onHand);
      if (onHand < 10 && lowStockMessage) {
        const compiled = template(lowStockMessage);
        stockMessage = compiled({ onHand });
      }
    } else {
      isDisabled = oosDisableButton;
      onHand = 0;
      buttonText = 'Out of Stock';
    }
  }

  const [addToCartRef, inView, entry] = useInView({ threshold: 0 });

  return (
    <div className={cn(css.addToCartControl, { [css.giftCard]: isGiftCard }, { [css.blueSky]: hydraBlueSkyPdp }, className)}>
      {stockInput}
      <input type="hidden" name="productId" value={productId}/>
      <input type="hidden" name="colorId" value={colorId}/>
      {stockMessage && hydraBlueSkyPdp && (
        <div className={css.stockMessage} data-test-id={testId('stockMessage')}><AriaLiveTee>{formatBlueSkyStockMessage(stockMessage)}</AriaLiveTee></div>
      )}
      <div className={css.btnContainer}>
        <button
          type="submit"
          className={cn(css.cartButton, { [css.mobileOos]: onHand < 1 && !oosDisableButton })}
          onMouseEnter={preventOnTouchDevice(onShowSelectSizeTooltip)}
          onMouseLeave={preventOnTouchDevice(onHideSelectSizeTooltip)}
          onFocus={preventOnTouchDevice(onShowSelectSizeTooltip)}
          onBlur={preventOnTouchDevice(onHideSelectSizeTooltip)}
          disabled={isDisabled}
          data-stock-id={stockId}
          data-track-action="Product-Page"
          data-track-label="PrForm"
          data-track-value="Add-To-Cart"
          data-test-id={testId('addToCart')}
          ref={addToCartRef}
          form={form}
        >
          {buttonText}
        </button>
        {stockMessage && !hydraBlueSkyPdp && (
          <div className={css.oldStockMessage} data-test-id={testId('stockMessage')}><AriaLiveTee>{stockMessage}</AriaLiveTee></div>
        )}
      </div>
      {hydraStickyAddToCart &&
        <AddToCartSticky
          inView={inView}
          entry={entry}
          productDetail={productDetail}
          addToCartText={buttonText}
          isDisabled={onHand < 1}
          stockId={stockId}
          productStyle={productStyle}
          isSelectionValid={isSelectionValid}
          onAddToCart={onAddToCart}
          onShowSelectSizeTooltip={onShowSelectSizeTooltip}
          onHideSelectSizeTooltip={onHideSelectSizeTooltip}
        />
      }
    </div>
  );
};

export default AddToCart;

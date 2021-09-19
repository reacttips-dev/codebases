import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Location } from 'history';
import cn from 'classnames';

import { evProductDimensionSelected } from 'events/product';
import { trackError } from 'helpers/ErrorUtils';
import ProductUtils from 'helpers/ProductUtils';
import AddToCart from 'components/productdetail/stylepicker/AddToCart';
import ColorChooser from 'components/productdetail/stylepicker/ColorChooser';
import SizingChooser from 'components/productdetail/stylepicker/SizingChooser';
import TwoDayShippingPerk from 'components/productdetail/stylepicker/TwoDayShippingPerk';
import SwankySwatchBox from 'components/productdetail/swankyswatch/SwankySwatchBox';
import PageContent from 'components/landing/PageContent';
import marketplace from 'cfg/marketplace.json';
import { track } from 'apis/amethyst';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { MapSomeDimensionIdTo, ProductStockData, ProductStyle, SizingValue } from 'types/cloudCatalog';
import { FormattedProductSizing, ProductDetailState, StyleThumbnail } from 'reducers/detail/productDetail';
import { SelectedSizing } from 'types/product';

import css from 'styles/components/productdetail/stylePicker.scss';

const { pdp: { addToCartText, lowStockMessage, sizingPlaceholder, showStyleChooserPrefix } } = marketplace;

interface Props {
  makeProductNotifyMe?: () => JSX.Element;
  showOosNotifyMe: boolean;
  styleList: ProductStyle[];
  product: ProductDetailState;
  productId: string;
  productType: string;
  productImage: string;
  productTitle?: string;
  sizing: FormattedProductSizing;
  genders: string[];
  selectedSizing: SelectedSizing;
  selectedStyle: ProductStyle;
  thumbnails: StyleThumbnail[];
  dimensionValidation: Partial<MapSomeDimensionIdTo<boolean>>;
  onStockChange: (styleId: string, selectedSizing: SelectedSizing, { label, name, selectedOption }: {
    label: string | null;
    name?: string;
    selectedOption?: SizingValue;
  }) => void;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
  addToCartAction: string;
  isGiftCard: boolean | '' | undefined;
  isSelectSizeTooltipVisible: boolean | undefined;
  isSelectSizeTooltipHighlighted: boolean | undefined;
  onShowSelectSizeTooltip: () => void;
  onHideSelectSizeTooltip: () => void;
  onUnhighlightSelectSizeTooltip: () => void;
  showSizeGender: boolean;
  showSizeChartLink: boolean;
  sizingPredictionId?: string | null;
  isOnDemandEligible?: boolean | null | undefined;
  hasRecommendedSizing: boolean;
  location: Location;
  sizeSymphonyContent?: unknown;
  addToCartSymphonyContent?: unknown;
  hydraPrimeTwoDayShipping?: boolean;
  hydraStickyAddToCart: boolean;
  isNonStandardShipOptionLabels?: boolean;
  pageType: string;
  includeColorDropDown?: boolean;
  id?: string;
  hydraBlueSkyPdp: boolean;
  showAddToCart?: boolean;
}

export class StylePicker extends Component<Props> {

  static contextTypes = {
    testId: PropTypes.func,
    router: PropTypes.object
  };

  static defaultProps = {
    includeColorDropDown: true
  };

  trackColorChangeEvent = (styleId: string, colorName: string) => {
    const { pageType } = this.props;
    const eventData = {
      dimension: 'COLOR_DIMENSION',
      dimensionId: styleId,
      dimensionLabel: colorName,
      sourcePage: pageType
    };
    track(() => ([evProductDimensionSelected, eventData]));
  };

  onColorChange = (styleId: string, colorName: string) => {
    const {
      props: { onStockChange, selectedSizing },
      trackColorChangeEvent
    } = this;
    onStockChange(styleId, selectedSizing, { label: 'color' });
    trackColorChangeEvent(styleId, colorName);
  };

  colorChooserOnColorChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, selectedIndex, options } = target;
    if (options?.[selectedIndex]) {
      const selectedColorText = options[selectedIndex].text;
      this.onColorChange(value, selectedColorText);
    }
  };

  swankySwatchOnColorChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { dataset: { colorName, styleId } } = target as HTMLInputElement;
    styleId && colorName && this.onColorChange(styleId, colorName);
  };

  onSizeChange = (options: SizingValue[], event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
    const {
      onStockChange,
      pageType,
      productId,
      selectedSizing,
      selectedStyle,
      sizing
    } = this.props;
    const newSizes = Object.assign({}, selectedSizing, {});
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    const trackLabel = target.getAttribute('data-track-label');
    newSizes[name] = value;
    const selectedOption = options.find(option => option.id === value);
    onStockChange(selectedStyle.styleId, newSizes, { label: trackLabel, name, selectedOption });
    if (selectedOption) {
      interface EventData {
        dimensionDirty: string | undefined;
        dimensionId: string;
        dimensionLabel: string;
        sourcePage: string;
        stock?: ProductStockData;
        asin?: string;
      }

      const eventData: EventData = {
        dimensionDirty: sizing.dimensionIdToName[name],
        dimensionId: selectedOption.id,
        dimensionLabel: selectedOption.value,
        sourcePage: pageType
      };

      const completedSizing = Object.assign({}, selectedSizing, { [name]: value });
      if (ProductUtils.isSizeSelectionComplete(sizing, completedSizing)) {
        const stock = ProductUtils.getStockBySize(sizing.stockData, selectedStyle.colorId, completedSizing, true);

        // If stock is null, return and allow the secondary cloud cat call to get ASIN.
        if (!stock) {
          return;
        }

        eventData.stock = stock;
        const stockStyle = selectedStyle?.stocks.find(({ stockId }) => stockId === stock.id);

        // If stockStyle is undefined or there is not an ASIN in the returned object, return for secondary cloud cat call to get ASIN.
        if (!stockStyle || !stockStyle.asin) {
          return;
        }

        eventData.asin = stockStyle.asin;
      }

      track(() => ([
        evProductDimensionSelected, eventData
      ]));
    } else if (value) {
      trackError(`Unable to find matching option for size id ${value} on productId ${productId}`, 'ERROR');
    }
  };

  makeColorChooser = () => {
    const {
      props: {
        hydraBlueSkyPdp,
        id,
        isGiftCard,
        product,
        productType,
        selectedStyle,
        styleList
      },
      colorChooserOnColorChange,
      swankySwatchOnColorChange
    } = this;

    if (hydraBlueSkyPdp) {
      return (
        <SwankySwatchBox
          onColorChange={swankySwatchOnColorChange}
          productState={product}
          productType={productType}
          selectedStyle={selectedStyle}
          styleList={styleList}
        />
      );
    }

    return (
      <ColorChooser
        id={id}
        isAssignedAirplaneSeatSizing={hydraBlueSkyPdp}
        isGiftCard={isGiftCard}
        onColorChange={colorChooserOnColorChange}
        selectedStyle={selectedStyle}
        showColorLabel={true}
        showStyleChooserPrefix={showStyleChooserPrefix}
        styleList={styleList}
      />
    );
  };

  render() {
    const {
      makeProductNotifyMe,
      onAddToCart,
      addToCartAction,
      selectedStyle,
      showOosNotifyMe,
      sizing,
      selectedSizing,
      product,
      productType,
      genders,
      dimensionValidation,
      onShowSelectSizeTooltip,
      onHideSelectSizeTooltip,
      hydraPrimeTwoDayShipping,
      hydraStickyAddToCart,
      includeColorDropDown,
      isNonStandardShipOptionLabels,
      isGiftCard,
      isSelectSizeTooltipVisible,
      isSelectSizeTooltipHighlighted,
      showSizeGender,
      showSizeChartLink,
      sizingPredictionId,
      isOnDemandEligible,
      hasRecommendedSizing,
      location,
      sizeSymphonyContent,
      addToCartSymphonyContent,
      id,
      hydraBlueSkyPdp,
      showAddToCart = true
    } = this.props;
    const { makeColorChooser } = this;
    const { productId } = selectedStyle || {};
    return (
      <form
        method="POST"
        id="buyBoxForm"
        action={addToCartAction}
        onSubmit={onAddToCart}>
        {includeColorDropDown && makeColorChooser()}
        {!isGiftCard &&
          <SizingChooser
            id={id}
            product={product}
            productId={productId}
            productType={productType}
            genders={genders}
            sizing={sizing}
            selectedSizing={selectedSizing}
            dimensionValidation={dimensionValidation}
            sizingPlaceholder={sizingPlaceholder}
            onSizeChange={this.onSizeChange}
            showSizeGender={showSizeGender}
            showSizeChartLink={showSizeChartLink}
            isSelectSizeTooltipVisible={isSelectSizeTooltipVisible}
            isSelectSizeTooltipHighlighted={isSelectSizeTooltipHighlighted}
            sizingPredictionId={sizingPredictionId}
            isOnDemandEligible={isOnDemandEligible}
            hasRecommendedSizing={hasRecommendedSizing}
            location={location}
            sizeSymphonyContent={sizeSymphonyContent}
            hydraBlueSkyPdp={hydraBlueSkyPdp}
          />
        }
        {hydraBlueSkyPdp && showOosNotifyMe && !isGiftCard && makeProductNotifyMe && makeProductNotifyMe()}
        {!!addToCartSymphonyContent && (
          <PageContent
            containerDataId="pdp-buybox"
            additionalClassName={css.symphonyBuyBoxPageContentCart}
            slotDetails={addToCartSymphonyContent}/>
        )}
        {showAddToCart && (
          <div className={cn({ [css.blueSkyAtcContainer]: hydraBlueSkyPdp })}>
            <div className={cn({ [css.blueSkyAddToCartWrapper]: hydraBlueSkyPdp })}>
              <AddToCart
                onAddToCart={onAddToCart}
                productStyle={selectedStyle}
                selectedSizing={selectedSizing}
                sizing={sizing}
                addToCartText={addToCartText}
                lowStockMessage={lowStockMessage}
                hydraStickyAddToCart={hydraStickyAddToCart}
                onShowSelectSizeTooltip={onShowSelectSizeTooltip}
                onHideSelectSizeTooltip={onHideSelectSizeTooltip}
                isGiftCard={isGiftCard}
                productDetail={product.detail}
                hydraBlueSkyPdp={hydraBlueSkyPdp}
              />
            </div>
          </div>)}
        { hydraPrimeTwoDayShipping && <TwoDayShippingPerk isNonStandardShipOptionLabels={isNonStandardShipOptionLabels} hydraBlueSkyPdp={hydraBlueSkyPdp} /> }
      </form>
    );
  }
}

export default withErrorBoundary('StylePicker', StylePicker);

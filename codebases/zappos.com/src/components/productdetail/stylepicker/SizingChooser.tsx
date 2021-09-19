/* ESLint errors suppressed for #4183 */
/* eslint-disable css-modules/no-undef-class */
/* eslint css-modules/no-unused-class: [2, { markAsUsed: ['giftCard'] }] */ /* This class is used in the other uses of stylePickerDropdown.scss */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import ExecutionEnvironment from 'exenv';
import template from 'lodash.template';
import debounce from 'lodash.debounce';
import { Location } from 'history';

import AriaLive from 'components/common/AriaLive';
import { capitalize, openPopup } from 'helpers/index';
import { head } from 'helpers/lodashReplacement';
import { trackEvent } from 'helpers/analytics';
import { onEvent } from 'helpers/EventHelpers';
import { setRecommendedFit } from 'actions/productdetail/sizingChooser';
import { fireOnDemandEvent } from 'actions/productdetail/onDemandSizing';
import { fireSizingImpression, productSizeChanged, validateDimensions } from 'actions/productDetail';
import RecommendedSizing from 'components/productdetail/stylepicker/RecommendedSizing';
import GenericSizeBiasReco from 'components/productdetail/stylepicker/GenericSizeBiasReco';
import PageContent from 'components/landing/PageContent';
import ProductUtils from 'helpers/ProductUtils';
import { isDesktop } from 'helpers/ClientUtils';
import AirplaneSeatSizing, { AirplaneProductSizing } from 'components/productdetail/stylepicker/AirplaneSeatSizing';
import { showAirplaneSizing } from 'helpers/AirplaneSeatSizing';
import { AppState } from 'types/app';
import { FormattedProductSizing, ProductDetailState } from 'reducers/detail/productDetail';
import { MapSomeDimensionIdTo, SizingDimension, SizingValue } from 'types/cloudCatalog';
import { SelectedSizing } from 'types/product';

import css from 'styles/components/productdetail/stylePickerDropdown.scss';

type Gender = 'Men' | 'Mens' | 'Women' | 'Womens';
const VALID_DISPLAY_GENDERS: Gender[] = ['Men', 'Mens', 'Women', 'Womens'];
const NORMALIZED_GENDER = {
  'Men': 'Men',
  'Mens': 'Men',
  'Women': 'Women',
  'Womens': 'Women'
};

interface State {
  isOnDemandSizingModalOpen: boolean;
  isDesktopView: boolean | null;
}

interface OwnProps {
  id: string | undefined;
  product: ProductDetailState;
  productId: string;
  productType: string;
  genders: string[];
  sizing: FormattedProductSizing;
  selectedSizing: SelectedSizing;
  dimensionValidation: Partial<MapSomeDimensionIdTo<boolean>>;
  sizingPlaceholder: string;
  onSizeChange: (options: SizingValue[], event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => void;
  showSizeGender: boolean;
  showSizeChartLink: boolean;
  isSelectSizeTooltipVisible: boolean | undefined;
  isSelectSizeTooltipHighlighted: boolean | undefined;
  sizingPredictionId?: string | null;
  isOnDemandEligible: boolean | null | undefined;
  hasRecommendedSizing: boolean;
  location: Location;
  sizeSymphonyContent: unknown;
  hydraBlueSkyPdp: boolean;
  setRecommendedFit?: any;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function makePlaceholder(sizingPlaceholder: string, gender: string, dimensionName: string) {
  const compiled = template(sizingPlaceholder);
  const placeholder = compiled({ gender, dimensionName: capitalize(dimensionName) });
  return placeholder.replace(/\s+/g, ' ');
}

function makeSizingOption(option: SizingValue, sizingPredictionId?: string | null) {
  const { id, value } = option;
  // The markup needs to be returned separately otherwise it causes a re-rendering error:
  // https://github01.zappos.net/mweb/marty/issues/3175
  return (sizingPredictionId && sizingPredictionId === id) ?
    <option key={id} value={id}>{`${value} - Recommended Size`}</option> :
    <option key={id} value={id}>{value}</option>;
}

function makeSingleValue(option: SizingValue, dimensionId: string, dimensionName: string, testId: <T extends string | undefined>(id: T) => T, hydraBlueSkyPdp: boolean) {
  // option _could_ be undefined if the product is incorrectly setup.  Don't blow up if it setup wrong.
  option = option || { value: '', id: '' };
  return (
    <div className={cn(css.styleChooserText, { [css.singleOptionBlueSky]: hydraBlueSkyPdp })} data-test-id={testId(`${dimensionId}-singleValue`)}>
      <input type="hidden" name={dimensionId} value={option.id}/>
      <span className={css.dimensionLabel}>{capitalize(dimensionName)}: </span>
      {option.value}
    </div>
  );
}

const SymphonySizeBuyBoxContent = ({ sizeSymphonyContent }: any) => {
  if (sizeSymphonyContent) {
    return (
      <PageContent
        containerDataId="pdp-buybox"
        additionalClassName={css.symphonyBuyBoxPageContentSize}
        slotDetails={sizeSymphonyContent}
      />
    );
  }
  return null;
};

export class SizingChooser extends Component<Props, State> {
  static contextTypes = {
    testId: PropTypes.func
  };

  state: State = {
    isOnDemandSizingModalOpen: false,
    isDesktopView: null
  };

  componentDidMount() {
    this._isMounted = true;
    onEvent(window, 'resize', this.handleResize, undefined, this);
    this.handleResize();
  }

  componentDidUpdate(prevProps: Props) {
    const { product: { isOnDemandEligible, sizingPredictionId, sizingPredictionValue } } = this.props;
    const { fireSizingImpression, product: { sizingPredictionId: prevSizingPredictionId, isOnDemandEligible: prevIsOnDemandEligible } } = prevProps;
    if (sizingPredictionId !== prevSizingPredictionId && sizingPredictionValue && sizingPredictionId) {
      fireSizingImpression('DIRECT_PREDICTION', { id: sizingPredictionId, value: sizingPredictionValue });
    } else if (isOnDemandEligible && isOnDemandEligible !== prevIsOnDemandEligible) {
      fireSizingImpression('ON_DEMAND_ELIGIBLE');
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _isMounted: boolean | undefined;

  handleResize = debounce(() => {
    // isDesktop doesnt work serverside, will be null serverside, or bool clientside
    if (this._isMounted) {
      this.setState({ isDesktopView: ExecutionEnvironment.canUseDOM ? isDesktop() : null });
    }
  }, 100);

  handleCalculateSizeClick = () => {
    const { fireOnDemandEvent } = this.props;
    fireOnDemandEvent('start');
    this.setState({ isOnDemandSizingModalOpen: true });
  };

  handleCloseModalClick = () => {
    this.setState({ isOnDemandSizingModalOpen: false });
  };

  handleSetRecommendedFit = (predictedSize: string) => {
    const { product, setRecommendedFit, setRecommendedFitAction, productSizeChanged, fireSizingImpression } = this.props;
    this.setState({ isOnDemandSizingModalOpen: false });
    const setRecommendedFitHandler = setRecommendedFit || setRecommendedFitAction;
    setRecommendedFitHandler(predictedSize);

    const { selectedSizing, detail } = product;
    if (detail) {
      const { productId, sizing: { dimensions } } = detail;
      const newSelectedSizing = { ...selectedSizing };

      const sizeDimension = dimensions.find(dim => dim.name === 'size');
      const dimValues = sizeDimension && sizeDimension.units[0].values;
      const sizeObj = dimValues && dimValues.find(({ value }) => value === predictedSize);
      if (sizeObj) {
        newSelectedSizing[`d${(sizeDimension as SizingDimension).id}`] = sizeObj.id;
        productSizeChanged(newSelectedSizing);
        validateDimensions();
      }

      fireSizingImpression('ON_DEMAND_PREDICTION', sizeObj);
      trackEvent('TE_PDP_SIZING', `${productId}:SizeSelected:${predictedSize}`);
    }
  };

  isNeededValuesSelected(selectedVal: string | undefined, options: SizingValue[] | undefined, isSelectSizeTooltipVisible: boolean | undefined) {
    return !selectedVal && options && options.length > 1 && isSelectSizeTooltipVisible;
  }

  makeLabelMessaging(showSizeGender: boolean, gender: string, dimensionName: string, needMoreSelections: boolean | undefined, isSelectSizeTooltipHighlighted: boolean | undefined) {
    const { testId } = this.context;
    if (needMoreSelections) {
      const text = ProductUtils.buildSizeMessagingText(dimensionName);
      return <>
        <span className={css.needSelectionLabel} data-test-id={testId('selectionError')}>{text}</span>
        { isSelectSizeTooltipHighlighted && <AriaLive> {text} </AriaLive> }
      </>;
    } else if ((showSizeGender || dimensionName === 'size') && gender !== '') {
      return `${gender} ${dimensionName}`;
    }
    return dimensionName;
  }

  render() {
    const { testId } = this.context;
    const {
      genders,
      sizing,
      selectedSizing,
      dimensionValidation,
      sizingPlaceholder,
      product,
      productType,
      onSizeChange,
      showSizeGender,
      showSizeChartLink,
      isSelectSizeTooltipVisible,
      isSelectSizeTooltipHighlighted,
      sizingPredictionId,
      isOnDemandEligible,
      onDemandSizing,
      hasRecommendedSizing,
      location,
      sizeSymphonyContent,
      id,
      hydraBlueSkyPdp
    } = this.props;

    const { isOnDemandSizingModalOpen, isDesktopView } = this.state;
    const { predictedSize } = onDemandSizing;
    const { genericSizeBiases, detail } = product;

    if (!detail) {
      return null;
    }

    const { productId, styles } = detail;
    const isSingleShoe = ProductUtils.isSingleShoe(styles);
    const gender: string = genders.length === 1 && VALID_DISPLAY_GENDERS.includes(head(genders)) ? head(genders).replace(/s?$/, '\'s') : '';
    const onDemandSizingGender = genders.length === 1 ? NORMALIZED_GENDER[head(genders) as Gender] : null;
    const sizeDimension = sizing.dimensions.find(dimension => dimension.name === 'size');
    const showRecommendedSizing = hasRecommendedSizing && sizeDimension && ProductUtils.isShoeType(productType) && gender && !isSingleShoe && (isOnDemandEligible !== false);
    const showGenericSizeBiasReco = !sizeSymphonyContent && !predictedSize && Boolean(genericSizeBiases);

    let selectedSize: string | undefined;

    // TODO need to make showAirplaneSizing more permissive
    // - should show for product 8905549
    // - should NOT show for product 9562120
    if (showAirplaneSizing(hydraBlueSkyPdp, productType, sizing.airplaneCache, isSingleShoe)) {
      return (
        <AirplaneSeatSizing
          sizing={sizing as AirplaneProductSizing}
          product={product}
          onDemandSizingGender={onDemandSizingGender}
          showRecommendedSizing={showRecommendedSizing}
          onSizeChange={onSizeChange}
          onOpenModal={this.handleCalculateSizeClick}
          onCloseModal={this.handleCloseModalClick}
          handleSetRecommendedFit={this.handleSetRecommendedFit}
          hydraBlueSkyPdp={hydraBlueSkyPdp}
          selectedSize={selectedSize}
          location={location}
          handleCalculateSizeClick={this.handleCalculateSizeClick}
          isOnDemandSizingModalOpen={isOnDemandSizingModalOpen}
          isDesktopView={isDesktopView as boolean}
          sizingPredictionId={sizingPredictionId}
          isSelectSizeTooltipVisible={!!isSelectSizeTooltipVisible}
          isSingleShoe={isSingleShoe}
          showGenericSizeBiasReco={showGenericSizeBiasReco}
        />
      );
    } else {
      return (
        <>
          { isSelectSizeTooltipHighlighted && <AriaLive> Selection is incomplete. </AriaLive> }
          <div id="sizingChooser" className={cn(css.stackableStyleChooserSections, { [css.blueSkyStyleChooserSections]: hydraBlueSkyPdp })}>
            {sizing.dimensions.map((dimension, index) => {
              const dimensionId = `d${dimension.id}`;
              const dimensionName = dimension.name;
              const isSizeDimension = dimensionName === 'size';
              const options: SizingValue[] | undefined = sizing.allUnits[index].values;
              const isIncomplete = dimensionValidation[dimensionId];
              let selectedVal = selectedSizing[dimensionId];
              if (options && options.length === 1) {
                selectedVal = head(options).id;
              }

              const onDemandSizingPredictionSize = options?.find(option => option.value === predictedSize);
              const onDemandSizingPredictionId = onDemandSizingPredictionSize ? onDemandSizingPredictionSize.id : null;
              const pdpDimensionSelectId = `${id || 'pdp'}-${dimensionName}-select`; // allow using a passed in id so no duplicate ids for complete the look (and other future situations we have more than one buy box on the page)
              const needMoreSelections = this.isNeededValuesSelected(selectedVal, options, isSelectSizeTooltipVisible);

              if (isSizeDimension && sizing.valueIdToName && selectedVal) {
                selectedSize = sizing.valueIdToName[selectedVal]?.value;
              }

              return (
                <Fragment key={dimensionName}>

                  {/* Mobile specific size elements START */}
                  {isDesktopView === false && isSizeDimension && (
                    <div className={css.mobileOnlyBlock}>
                      <SymphonySizeBuyBoxContent sizeSymphonyContent={sizeSymphonyContent}/>
                      {showGenericSizeBiasReco && genericSizeBiases && (
                        <GenericSizeBiasReco currentProductId={productId} genericSizeBiases={genericSizeBiases} />
                      )}
                      {showRecommendedSizing &&
                        <RecommendedSizing
                          onOpenModal={this.handleCalculateSizeClick}
                          onCloseModal={this.handleCloseModalClick}
                          product={product}
                          gender={onDemandSizingGender}
                          handleSetRecommendedFit={this.handleSetRecommendedFit}
                          selectedSize={selectedSize}
                          location={location}
                          handleCalculateSizeClick={this.handleCalculateSizeClick}
                          isOnDemandSizingModalOpen={isOnDemandSizingModalOpen}
                          isDesktopView={isDesktopView}
                        />
                      }
                    </div>
                  )}
                  {/* Mobile specific size elements END */}

                  <div
                    className={cn(
                      css.styleChooserSection,
                      { [css.invalidDimensionControl]: isIncomplete },
                      { [css.onlyOneChooserSection]: sizing.dimensions.length === 1 },
                      { [css.blueSky]: hydraBlueSkyPdp })
                    }
                    data-test-id={testId(`${dimensionId}-sizingChooser`)}>
                    <label className={cn({ [css.sizeDropdownLabel]: hydraBlueSkyPdp, [css.singleVal]: options && options.length <= 1 })} htmlFor={pdpDimensionSelectId}>
                      {this.makeLabelMessaging(showSizeGender, gender, dimensionName, needMoreSelections, isSelectSizeTooltipHighlighted)}
                      {showSizeChartLink && isSizeDimension && ProductUtils.isShoeType(productType) && (
                        <span className={css.styleChooserSizeChart}>
                          <span> (<a
                            href="/cs/mmf-popop.zml"
                            target="_blank"
                            onClick={openPopup}
                            data-popup-options="width=1000,height=800"
                            data-track-action="Product-Page"
                            data-track-label="Tabs"
                            data-track-value="Size-Chart">Size Chart</a>)</span>
                        </span>
                      )}:
                    </label>

                    {/* Desktop specific size elements START */}
                    {isDesktopView === true && isSizeDimension &&
                      <>
                        <SymphonySizeBuyBoxContent sizeSymphonyContent={sizeSymphonyContent}/>
                        {showGenericSizeBiasReco && genericSizeBiases && (
                          <GenericSizeBiasReco currentProductId={productId} genericSizeBiases={genericSizeBiases} />
                        )}
                        {showRecommendedSizing &&
                          <RecommendedSizing
                            onOpenModal={this.handleCalculateSizeClick}
                            onCloseModal={this.handleCloseModalClick}
                            product={product}
                            gender={onDemandSizingGender}
                            handleSetRecommendedFit={this.handleSetRecommendedFit}
                            selectedSize={selectedSize}
                            location={location}
                            handleCalculateSizeClick={this.handleCalculateSizeClick}
                            isOnDemandSizingModalOpen={isOnDemandSizingModalOpen}
                            isDesktopView={isDesktopView}
                          />
                        }
                      </>
                    }
                    {/* Desktop specific size elements END */}

                    {options && options.length > 1 ? (
                      <div className={css.styleChooserControlWrapper}>
                        <select
                          id={pdpDimensionSelectId}
                          name={dimensionId}
                          className={cn(css.styleChooserControl, {
                            [css.highlighted]: isSelectSizeTooltipHighlighted,
                            [css.recommendedSizeSelect]: selectedVal && (selectedVal === sizingPredictionId || selectedVal === onDemandSizingPredictionId),
                            [css.needSelection]: needMoreSelections
                          })}
                          value={selectedVal || sizingPredictionId || ''}
                          onChange={onSizeChange.bind(this, options)}
                          data-track-label={dimensionName}>
                          <option value="">{makePlaceholder(sizingPlaceholder, gender, dimensionName)}</option>
                          {options.map(option =>
                            makeSizingOption(option, sizingPredictionId)
                          )}
                        </select>
                      </div>
                    ) : makeSingleValue(options![0], dimensionId, dimensionName, testId, hydraBlueSkyPdp)}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </>
      );
    }
  }
}

const mapStateToProps = (state: AppState) => {
  const { sizingChooser: { onDemandSizing } } = state;
  return {
    onDemandSizing
  };
};

const mapDispatchToProps = {
  fireSizingImpression,
  fireOnDemandEvent,
  setRecommendedFitAction: setRecommendedFit,
  productSizeChanged,
  validateDimensions
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(SizingChooser);
/* eslint-enable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, RouteComponentProps } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import ExecutionEnvironment from 'exenv';
import { Location } from 'history';
import queryString from 'query-string';

import { Accordion, AccordionItem, AccordionItemProps } from 'components/common/MelodyAccordion';
import RecosCompleteTheLook from 'components/productdetail/RecosCompleteTheLook';
import SwatchPicker from 'components/productdetail/SwatchPicker';
import LazyHowItWasWorn from 'components/productdetail/LazyHowItWasWorn';
import { PRODUCT_PAGE } from 'constants/amethystPageTypes';
import {
  HYDRA_BLUE_SKY_PDP,
  HYDRA_PRIME_TWO_DAY_SHIPPING,
  HYDRA_STICKY_ADD_TO_CART,
  HYDRA_SUBSCRIPTION_TEST
} from 'constants/hydraTests';
import { CUSTOMER_DROPDOWN_DIMENSION_SELECTION, SAVED_SESSION_DIMENSION_SELECTION } from 'constants/productDimensionSelectionSourceTypes';
import { NO_VIZ } from 'constants/productRecoTypes';
import { LazyAsk } from 'containers/LazyAsk';
import { pvProduct } from 'events/product';
import { evAddToCart } from 'events/cart';
import { evRecommendationClick } from 'events/recommendations';
import {
  BrandStylesNotifyModal,
  OutOfStockModalWrapper,
  ProductNotifyModal,
  ReportAnErrorModal
} from 'components/productdetail/asyncProductPageModals';
import OutOfStockPopover from 'components/productdetail/OutOfStockPopoverWrapper';
import { onPrimeTwoDayShippingImpression } from 'actions/impressions';
import { getHeartCounts, getHearts, heartProduct, toggleHeartingLoginModal, unHeartProduct } from 'actions/hearts';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { getHeartProps } from 'helpers/HeartUtils';
import { saveInfluencerToken } from 'helpers/InfluencerUtils';
import { evLandingPageInfluencer } from 'events/influencer';
import { pageTypeChange } from 'actions/common';
import { addAdToQueue } from 'actions/ads';
import { isAssigned, isInAssignment, triggerAssignment } from 'actions/ab';
import { createAddToCartMicrosoftUetEvent, pushMicrosoftUetEvent } from 'actions/microsoftUetTag';
import { onLookupRewardsTransparencyPointsForItem } from 'store/ducks/rewards/actions';
import { buildProductPageRecoKey, getRecosSlot } from 'helpers/RecoUtils';
import {
  addItemToCart,
  fetchBrandPromo,
  fetchProductReviews,
  fetchProductSearchSimilarity,
  fetchSizingPrediction,
  getPdpStoriesSymphonyComponents,
  hideSelectSizeTooltip,
  highlightSelectSizeTooltip,
  loadProductDetailPage,
  onProductDescriptionCollapsed,
  productSizeChanged,
  productSwatchChange,
  setCarouselIndex,
  setProductDocMeta,
  showSelectSizeTooltip,
  toggleOosButton,
  toggleProductDescription,
  unhighlightSelectSizeTooltip,
  validateDimensions
} from 'actions/productDetail';
import {
  fetchProductReviewsWithMedia,
  hideReviewGalleryModal,
  showReviewGalleryModal
} from 'actions/reviews';
import { handleGetInfluencerStatus, handleGetInfluencerToken } from 'actions/influencer/influencer';
import { toggleBrandNotifyModal, toggleProductNotifyModal, toggleReportAnErrorModal } from 'actions/productdetail/sharing';
import { setLastSelectedSize } from 'actions/lastSelectedSizes';
import { submitNotifyBrandEmail } from 'actions/brand';
import { changeQuantity, showCartModal } from 'actions/cart';
import { fetchProductPageRecos } from 'actions/recos';
import { fetchRelatedProducts } from 'actions/relatedProducts';
import { sendIntentEvent } from 'apis/intent';
import { translateCartError } from 'apis/mafia';
import marketplace from 'cfg/marketplace.json';
import { PageLoader } from 'components/Loader';
import SiteAwareMetadata from 'components/SiteAwareMetadata';
import SocialCollectionsWidget from 'components/account/Collections/SocialCollectionsWidget';
import DontForget from 'components/productdetail/DontForget';
import ProductBreadcrumbs from 'components/productdetail/ProductBreadcrumbs';
import ProductCallout from 'components/productdetail/ProductCallout';
import ProductName from 'components/productdetail/ProductName';
import StylePicker from 'components/productdetail/stylepicker/StylePicker';
import ProductImages from 'components/productdetail/ProductImages';
import ProductGallery from 'components/productdetail/productGallery/ProductGallery';
import ProductSummary from 'components/productdetail/ProductSummary';
import HappyFeatureFeedback from 'components/HappyFeatureFeedback';
import ExpandableProductDescription from 'components/productdetail/description/ExpandableProductDescription';
import RecosDetail1 from 'components/productdetail/RecosDetail1';
import RecosDetail2 from 'components/productdetail/RecosDetail2';
import RecosDetail3 from 'components/productdetail/RecosDetail3';
import ReviewPreview from 'components/productdetail/ReviewPreview';
import SizeGroups from 'components/productdetail/sizegroups/SizeGroups';
import { indefiniteArticleSelector, openPopup, stripSpecialCharsDashReplace } from 'helpers/index.js';
import { usdToNumber } from 'helpers/NumberFormats';
import ProductUtils, { getProductImagesFormatted, productCalloutIconMap } from 'helpers/ProductUtils';
import { isDesktop, offset } from 'helpers/ClientUtils';
import { buildSeoBrandString, buildSeoProductString, buildSeoProductUrl } from 'helpers/SeoUrlBuilder';
import FitSurvey from 'components/productdetail/FitSurvey';
import LinkShare from 'components/productdetail/sharing/LinkShare';
import LinkCopiedToast from 'components/productdetail/sharing/LinkCopiedToast';
import FacebookShare from 'components/productdetail/sharing/FacebookShare';
import FacebookShareV2 from 'components/productdetail/sharing/FacebookShareV2';
import TwitterShare from 'components/productdetail/sharing/TwitterShare';
import TwitterShareV2 from 'components/productdetail/sharing/TwitterShareV2';
import PinterestShare from 'components/productdetail/sharing/PinterestShare';
import PinterestShareV2 from 'components/productdetail/sharing/PinterestShareV2';
import EmailShare from 'components/productdetail/sharing/EmailShare';
import SmsShare from 'components/productdetail/sharing/SmsShare';
import Price from 'components/productdetail/Price';
import ShippingAndReturnsBanner from 'components/productdetail/ShippingAndReturnsBanner';
import ReviewPhotoGallery from 'components/productdetail/ReviewPhotoGallery';
import ReviewGalleryWrapper from 'containers/ReviewGalleryWrapper';
import BrandPromo from 'components/productdetail/BrandPromo';
import MelodyVideoPlayer from 'components/common/melodyVideo/MelodyVideoPlayer';
import { POPUP_CLASS_RE, PRODUCT_DETAIL_IMAGE_PAGE_RE } from 'common/regex';
import { shouldRenderReviewGallery } from 'helpers/ReviewUtils';
import { getNumberOfAskQuestions } from 'helpers/AskUtils';
import {
  PDP_NARROW_MID,
  PDP_NARROW_TOP,
  PDP_WIDE_MID,
  PDP_WIDE_TOP
} from 'helpers/apsAdvertisement';
import { onEvent } from 'helpers/EventHelpers';
import { BranchPortal, createInjectionContext, LeafPortal, PortalNode } from 'helpers/PortalNodeManager';
import { titaniteView, track } from 'apis/amethyst';
import { stockSelectionCompleted } from 'store/ducks/productDetail/actions';
import GamSlot from 'components/common/GamSlot';
import JanusPixel from 'components/common/JanusPixel';
import ImageLazyLoader from 'components/common/ImageLazyLoader';
import { StructuredVideoObject } from 'components/common/StructuredDataTypes';
import LandingSlot from 'containers/LandingSlot';
import { getApproximateSize, getLastSelectedSize } from 'reducers/lastSelectedSizes';
import { ProductContextProvider } from 'components/productdetail/ProductContext';
import ReviewSummary from 'components/productdetail/ReviewSummary';
import { FormattedProductBundle, ProductDetailState, StyleThumbnail } from 'reducers/detail/productDetail';
import { ProductBrand, ProductSizing, ProductStyle, ProductVideo, SizingValue } from 'types/cloudCatalog';
import { PDPFeaturedImage, ProductDimensionValidation, SelectedSizing } from 'types/product';
import { RecosState } from 'reducers/recos';
import { AppState } from 'types/app';
import { StoreConnectedDataLoadingOutfitTreatment } from 'containers/OutfitExperimentWrapper';
import shippingBox from 'images/shipping-box.svg';
import { InfluencerStatus } from 'types/influencer';

import css from 'styles/containers/productDetail.scss';

/**
 * This definitely doesn't feel great, but `SiteAwareMetadata` does some funny business with higher-order-functions,
 * so until that file is typed, we need to cast it.
 */
const SiteMetadata = SiteAwareMetadata as any;

const {
  desktopBaseUrl,
  features: {
    showAsk: showAskConstant,
    showDontForget: showDontForgetConstant,
    showSizeGroups: showSizeGroupsConstant,
    showReviews,
    showOOSNotifyMe: showOOSNotifyMeFeature
  },
  hasHearting,
  links,
  recos: { showSimilarItemsYouMayLike, showCustomersWhoViewedThisItemAlsoViewed },
  isInfluencerProgramEnabled
} = marketplace;

// map of the component prop name to hydra test name for ab tests the component is built for.
const TEST_PROP_TO_NAME = {
  hydraPrimeTwoDayShipping: HYDRA_PRIME_TWO_DAY_SHIPPING,
  hydraStickyAddToCart: HYDRA_STICKY_ADD_TO_CART,
  hydraBlueSkyPdp: HYDRA_BLUE_SKY_PDP,
  hydraZsub: HYDRA_SUBSCRIPTION_TEST
} as const;

interface State {
  isSpotlightActive: boolean;
  isLinkCopiedToastActive: boolean;
  spotlightLowResImageSrc: string | null;
  spotlightHiResImageSrc: string | null;
  spotlightHiResImageWidth: number;
  spotlightHiResImageHeight: number;
  spotlightWrapperHeight: number;
  mouseCoordinates: any;
  movementRatioX: number;
  movementRatioY: number;
}

interface Params {
  productId: string;
  colorId?: string;
  seoName?: string;
}

type Props = PropsFromRedux & RouteComponentProps<Params, {}> & typeof defaultProps;

const defaultProps = {
  enableSlideUpHeader: true,
  trackEvent,
  trackLegacyEvent
};

// requires productId from path param with optional colorId from path.
export class ProductDetail extends Component<Props, State> {

  static fetchDataOnServer(store: any, location: Location, { productId, colorId, seoName }: Params) {
    const { dispatch } = store;
    return dispatch(loadProductDetailPage(productId, { colorId, seoName, firePixel: true, includeOosSizing: false }));
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    testId: PropTypes.func
  };

  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);
    this.onStockChange = this.onStockChange.bind(this);
    this.onProductDescriptionToggle = this.onProductDescriptionToggle.bind(this);
    this.onProductDescriptionCollapsed = this.onProductDescriptionCollapsed.bind(this);
    this.onRecoClicked = this.onRecoClicked.bind(this);
    this.onSwatchStyleChosen = this.onSwatchStyleChosen.bind(this);
    this.onHideSelectSizeTooltip = this.onHideSelectSizeTooltip.bind(this);
    this.unhighlightAndHideSelectSizeTooltip = this.unhighlightAndHideSelectSizeTooltip.bind(this);
    this.getHeartCountsDebounced = debounce(this.getHeartCountsDebounced.bind(this), 350);
    this.checkForHearts = this.checkForHearts.bind(this);
    this.getRecosToDisplay = this.getRecosToDisplay.bind(this);
  }

  state: State = {
    isSpotlightActive: false,
    isLinkCopiedToastActive: false,
    spotlightLowResImageSrc: '',
    spotlightHiResImageSrc: '',
    spotlightHiResImageWidth: 0,
    spotlightHiResImageHeight: 0,
    spotlightWrapperHeight: 0,
    mouseCoordinates: {},
    movementRatioX: 0,
    movementRatioY: 0
  };

  componentDidMount() {
    titaniteView();
    const {
      addAdToQueue,
      getHearts,
      onPrimeTwoDayShippingImpression,
      pageTypeChange,
      pdpConfig
    } = this.props;

    // you do not need to call assignTests more than once - just store the
    // result of the first call in a variable.
    //
    // we must call assignTests exactly once in componentDidMount, however, in
    // order to ensure all tests in TEST_PROP_TO_NAME are triggered.
    const { hydraPrimeTwoDayShipping } = this.assignTests();

    this.blueSkyCollectionNode = createInjectionContext();

    if (hydraPrimeTwoDayShipping) {
      onPrimeTwoDayShippingImpression(PRODUCT_PAGE);
    }

    pageTypeChange('product');

    const {
      lastSelectedSizes,
      product: { detail, reviewData, sizingPredictionId },
      params: { productId, colorId, seoName },
      fetchBrandPromo,
      fetchProductReviews,
      fetchProductReviewsWithMedia,
      fetchRelatedProducts,
      fetchSizingPrediction,
      handleGetInfluencerToken,
      isShowingThirdPartyAds,
      getPdpStoriesSymphonyComponents,
      location,
      productSwatchChange,
      setProductDocMeta,
      showDontForget,
      showReviews,
      showSizeGroups,
      toggleBrandNotifyModal,
      toggleProductNotifyModal,
      toggleReportAnErrorModal,
      trackEvent,
      pdpConfig: { hasSymphonyStories },
      hydraBlueSkyPdp
    } = this.props;
    const { styles, defaultProductType, productId: detailProductId } = detail || {};
    // Tests triggered client side on willMount don't get updated props for the initial didMount
    // Instead we need to manually store the result of the assignment for checks done during didMount
    // See https://github.com/reactjs/react-redux/issues/210 for context.
    const isDesktopSize = isDesktop();

    if (isShowingThirdPartyAds) {
      const slots = [
        { name:PDP_NARROW_MID },
        { name: PDP_NARROW_TOP },
        { name: PDP_WIDE_MID },
        { name: PDP_WIDE_TOP }
      ];

      addAdToQueue(slots);
    }

    // Setting event watcher for popup link clicks set by content
    onEvent(document.body, 'click', (e: React.MouseEvent) => {
      const { target } = e;
      const element = target as HTMLElement;
      if (element && element.tagName === 'A' && POPUP_CLASS_RE.test(element.className)) {
        openPopup(e);
      }
    }, undefined, this);

    onEvent(document.body, 'click', this.onBuyBoxPageContentClick, undefined, this);

    // if we client routed we need to load everything
    if (!detail || detailProductId !== productId || (styles && styles.length === 0)) {
      this.fetchData(productId);
    } else if (styles) {
      setProductDocMeta(detail, colorId);
      this.getRewardsTransparencyData();
      // product data is loaded, but non-critical pieces may not
      if (window.pageYOffset === 0 && !isDesktop()) {
        this.slideUpHeader();
      }

      if (showSizeGroups || showDontForget) {
        fetchRelatedProducts(productId);
      }

      if (hasSymphonyStories && productId) {
        getPdpStoriesSymphonyComponents(productId);
      }

      if (showReviews && (!reviewData || reviewData.productId !== productId || reviewData.page !== 1 || reviewData.offset !== 0)) {
        fetchProductReviews(productId, 1, 0, false);
        fetchProductReviewsWithMedia(productId);
      }

      const style = ProductUtils.getStyleByColor(detail.styles, colorId);

      // If we direct link to an OOS product, we fall back to the first available style
      // In this instance (if no in stock style matches our colorId from the URL parameter)
      // Make sure we "select" that first style
      if (colorId && !styles.some(style => style.colorId === colorId)) {
        const { colorId: newColorId } = styles[0];
        productSwatchChange(newColorId);
        this.useSeoUrl(detail, newColorId);
      }

      if (detailProductId === productId && seoName !== buildSeoProductString(detail, colorId)) {
        this.useSeoUrl(detail, colorId);
      }

      if (pdpConfig.showSizingPrediction && colorId && !sizingPredictionId && ProductUtils.isShoeType(defaultProductType)) {
        fetchSizingPrediction(productId, colorId);
      }

      if (isDesktopSize) { // desktop-only features
        if (pdpConfig.showBrandPromo && detail.brandId) {
          fetchBrandPromo(detail.brandId);
        }
      }
      track(() => ([pvProduct, style]));
    }
    if (detailProductId) {
      this.checkForRecos(defaultProductType, detailProductId, styles, { colorId });
    }
    trackEvent('TE_PV_PDP', productId);

    if (location.hash) {
      if (location.hash.indexOf('showModal=notifyoos') > -1) {
        toggleProductNotifyModal(true);
      } else if (location.hash.indexOf('showModal=notifybrand') > -1) {
        toggleBrandNotifyModal(true);
      } else if (location.hash.indexOf('showModal=reportanerror') > -1) {
        toggleReportAnErrorModal(true);
      }
    }

    // Get hearting list
    getHearts();

    const lastSelectedSizesDoneLoading = lastSelectedSizes && Boolean(Object.keys(lastSelectedSizes).length);
    const shouldSetApproximateSizes = detail?.sizing && lastSelectedSizesDoneLoading;
    if (pdpConfig.autoSelectApproximateSizes && shouldSetApproximateSizes) {
      this.handleSetApproximateSizes();
    }

    // Get Influencer Status and token
    if (hydraBlueSkyPdp && isInfluencerProgramEnabled) {
      handleGetInfluencerToken();
    }

    const { search } = location;
    const { infToken } = queryString.parse(search) || {};
    if (infToken) {
      saveInfluencerToken(infToken);
      track(() => ([evLandingPageInfluencer, { linkId: infToken, pageId: PRODUCT_PAGE } ]));
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      params,
      trackEvent,
      product: { detail },
      pdpConfig,
      sessionId: prevSessionId,
      showCartModal,
      params: {
        colorId
      },
      hydraPrimeTwoDayShipping: prevHydraPrimeTwoDayShipping
    } = prevProps;

    const {
      productId
    } = detail || {};

    const {
      isCartModalShowing,
      product: { isSimilarStylesLoading, detail: nextDetail },
      params: {
        productId: nextProductId,
        colorId: nextColorId,
        seoName: nextSeoName
      },
      fetchSizingPrediction,
      fetchBrandPromo,
      hydraPrimeTwoDayShipping,
      lastSelectedSizes,
      onPrimeTwoDayShippingImpression,
      sendIntentEvent,
      sessionId,
      toggleOosButton
    } = this.props;

    const {
      productId: nextDetailProductId,
      styles: nextStyles,
      defaultProductType: nextProductType
    } = nextDetail || {};

    if (hydraPrimeTwoDayShipping && hydraPrimeTwoDayShipping !== prevHydraPrimeTwoDayShipping) {
      onPrimeTwoDayShippingImpression(PRODUCT_PAGE);
    }

    if (nextProductId !== params.productId) {
      titaniteView();
      this.fetchData(nextProductId);
      trackEvent('TE_PV_PDP', nextProductId);
    }

    if (prevSessionId !== sessionId) {
      sendIntentEvent('view', { page_id: 'details', custom_1: productId });
    }

    const newProductLoaded = nextDetail && ((productId !== nextDetailProductId) || !detail);
    const newColorId = nextDetail && ((colorId !== nextColorId));
    // update pretty URL if the product data for a new product has loaded
    if (nextDetail && nextDetailProductId === nextProductId) {

      if (newProductLoaded && buildSeoProductString(nextDetail, nextColorId) !== nextSeoName && nextColorId) {
        this.useSeoUrl(nextDetail, nextColorId);
      }

      // if the color changed but the product didn't, fetch new recos.
      if (!newProductLoaded && colorId !== nextColorId) {
        isCartModalShowing && showCartModal(false);
        toggleOosButton(false);
        this.checkForRecos(nextProductType, nextProductId, nextStyles, { colorId: nextColorId });
      }
    }

    if (newColorId || newProductLoaded) {
      this.getRewardsTransparencyData(); // if colorId differs from next colorId, make the call again
    }
    // for client routing, this block is for calls we need to make once the product itself has loaded.
    if (newProductLoaded) {
      const style = nextStyles && ProductUtils.getStyleByColor(nextStyles, nextColorId);

      track(() => ([pvProduct, style]));

      if (window.pageYOffset === 0 && !isDesktop()) {
        this.slideUpHeader();
      }

      if (pdpConfig.showSizingPrediction && ProductUtils.isShoeType(nextProductType) && nextColorId) {
        fetchSizingPrediction(nextProductId, nextColorId);
      }

      if (isDesktop()) { // desktop-only features
        if (pdpConfig.showBrandPromo && nextDetail?.brandId) {
          fetchBrandPromo(nextDetail.brandId);
        }
      }

      this.checkForRecos(nextProductType, nextDetailProductId || nextProductId, nextStyles, { colorId: nextColorId });
    }

    if (!isSimilarStylesLoading) {
      this.checkForHearts(prevProps, this.props);
    }

    // Attempt to set approximate sizes when last selected sizes load from local storage, a new product is loaded, or a new color is selected
    const lastSelectedSizesDoneLoading = lastSelectedSizes && !Object.keys(prevProps.lastSelectedSizes).length && Object.keys(lastSelectedSizes).length;
    const shouldSetApproximateSizes = nextDetail && (lastSelectedSizesDoneLoading || newProductLoaded || colorId !== nextColorId);

    if (pdpConfig.autoSelectApproximateSizes && shouldSetApproximateSizes) {
      this.handleSetApproximateSizes();
    }
  }

  componentWillUnmount() {
    const {
      isCartModalShowing, hideReviewGalleryModal, showCartModal, toggleReportAnErrorModal
    } = this.props;
    const { isSpotlightActive } = this.state;
    isCartModalShowing && showCartModal(false);
    hideReviewGalleryModal();
    toggleReportAnErrorModal(false);
    if (!PRODUCT_DETAIL_IMAGE_PAGE_RE.test(location.pathname)) {
      this.resetCarouselIndex();
    }

    // we probably don't need to do this, since the component is being unmounted let's cleanup
    if (isSpotlightActive) {
      this.zoomOut();
    }
  }

  // Types for function-bound refs on `this`
  buyBox: undefined | null | HTMLDivElement;
  theater: undefined | null | HTMLDivElement;
  spotlightWrapper: undefined | null | HTMLButtonElement;
  spotlight: undefined | null | HTMLDivElement;
  blueSkyCollectionNode: undefined | PortalNode;

  getRewardsTransparencyData = () => {
    const { onLookupRewardsTransparencyPointsForItem, isGiftCard, hasRewardsTransparency } = this.props;
    if (!isGiftCard && hasRewardsTransparency) {
      onLookupRewardsTransparencyPointsForItem();
    }
  };

  getRecosToDisplay(slot: 'slot0' | 'slot1' | 'slot2' | 'slot3', props: Props) {
    const {
      similarProductRecos: recoStoreData,
      product: { detail },
      params
    } = props;

    const { colorId } = params || {};

    const {
      productId,
      styles
    } = detail || {};

    if (!styles) {
      return;
    }

    const style = ProductUtils.getStyleByColor(styles, colorId);
    const { lastReceivedRecoKey, janus: janusRecos = {} } = recoStoreData;
    if (productId) {
      const recosForProduct = janusRecos[buildProductPageRecoKey(productId, style?.styleId)] || janusRecos;
      return getRecosSlot(recosForProduct, slot, lastReceivedRecoKey);
    }
  }

  handleSetApproximateSizes() {
    const {
      hydraBlueSkyPdp,
      productSizeChanged,
      validateDimensions,
      lastSelectedSizes,
      params,
      product : {
        detail,
        selectedSizing
      },
      stockSelectionCompleted
    } = this.props;
    const {
      styles,
      sizing
    } = detail as FormattedProductBundle;
    const {
      dimensionsSet,
      hypercubeSizingData,
      valuesSet,
      stockData
    } = sizing || {};
    const gender = ProductUtils.getGender(detail);

    if (hydraBlueSkyPdp) {
      return;
    }

    const approximateSizes = dimensionsSet?.reduce((selectedSizes: SelectedSizing, dimensionId) => {
      const lastSelectedSize = getLastSelectedSize(lastSelectedSizes, gender, dimensionId);
      const value = valuesSet[dimensionId];
      const sizeOptions = value && Object.values(value)[0];
      const approximateSize = getApproximateSize(sizeOptions, lastSelectedSize, hypercubeSizingData);
      return approximateSize
        ? { ...selectedSizes, [dimensionId] : approximateSize }
        : selectedSizes;
    }, {});
    // do not auto select the approximate sizes unless they are in stock
    const style = ProductUtils.getStyleByColor(styles, params.colorId);
    const inStock = Boolean(ProductUtils.getStockBySize(stockData, style.colorId, { ...approximateSizes, ...selectedSizing }));
    if (Object.keys(approximateSizes).length && inStock) {
      // spread approximate sizes first so existing selections stay put
      const newSizing = { ...approximateSizes, ...selectedSizing };
      productSizeChanged(newSizing);
      if (ProductUtils.isSizeSelectionComplete(sizing, newSizing)) {
        stockSelectionCompleted({ source: SAVED_SESSION_DIMENSION_SELECTION });
      }
      validateDimensions();
    }
  }

  checkForHearts(props: Props, nextProps: Props) {
    const dontForgetStyles = props.dontForget?.product?.styles;
    const nextDontForgetStyles = nextProps.dontForget?.product?.styles;

    const detail1 = this.getRecosToDisplay('slot1', props);
    const nextDetail1 = this.getRecosToDisplay('slot1', nextProps);
    const nextDetail1Recos = nextDetail1?.recos;

    const detail2 = this.getRecosToDisplay('slot2', props);
    const nextDetail2 = this.getRecosToDisplay('slot2', nextProps);
    const nextDetail2Recos = nextDetail2?.recos;

    const detail3 = this.getRecosToDisplay('slot3', props);
    const nextDetail3 = this.getRecosToDisplay('slot3', nextProps);
    const nextDetail3Recos = nextDetail3?.recos;

    if ((dontForgetStyles !== nextDontForgetStyles) ||
        (detail1?.recos !== nextDetail1Recos) ||
        (detail2?.recos !== nextDetail2Recos) ||
        (detail3?.recos !== nextDetail3Recos)) {
      const allRecos = [
        ...(nextDetail1Recos || []),
        ...(nextDetail2Recos || []),
        ...(nextDetail3Recos || []),
        ...(nextDontForgetStyles || [])
      ];
      this.getHeartCountsDebounced(allRecos);
    }
  }

  fetchData(productId: string) {
    const {
      loadProductDetailPage,
      fetchProductReviews,
      fetchProductReviewsWithMedia,
      fetchRelatedProducts,
      getPdpStoriesSymphonyComponents,
      params: { colorId, seoName },
      showReviews,
      showSizeGroups,
      showDontForget,
      pdpConfig: { hasSymphonyStories }
    } = this.props;
    const { isSpotlightActive } = this.state;
    if (isSpotlightActive) {
      this.zoomOut();
    }

    loadProductDetailPage(productId, { colorId, seoName, firePixel: true, includeOosSizing: false });

    if (hasSymphonyStories) {
      getPdpStoriesSymphonyComponents(productId);
    }

    if (showSizeGroups || showDontForget) {
      fetchRelatedProducts(productId);
    }

    if (showReviews) {
      fetchProductReviews(productId, 1, 0, false);
      fetchProductReviewsWithMedia(productId);
    }
  }

  /**
   * Trigger all the tests defined in TEST_PROP_TO_NAME, and return a map of
   * component prop name to whether the user is in the treatment.
   */
  assignTests = () => {
    const results: Partial<Record<keyof typeof TEST_PROP_TO_NAME, boolean>> = {};
    const { triggerAssignment } = this.props;
    Object.keys(TEST_PROP_TO_NAME).forEach(prop => {
      const propName = prop as keyof typeof TEST_PROP_TO_NAME;
      const result = triggerAssignment(TEST_PROP_TO_NAME[propName]);
      results[propName] = isInAssignment(result);
    });
    return results;
  };

  getHeartCountsDebounced(...args: Parameters<typeof getHeartCounts>) {
    this.props.getHeartCounts(...args);
  }

  resetCarouselIndex() {
    const { setCarouselIndex } = this.props;
    setCarouselIndex(0);
  }

  slideUpHeader() {
    if (!this.props.enableSlideUpHeader || typeof document === 'undefined') {
      return;
    }
    const interval = window.setInterval(() => {
      const summaryContainer = typeof document !== 'undefined' && document.getElementById('productRecap');
      if (summaryContainer) {
        clearInterval(interval);
        summaryContainer.scrollIntoView();
      }
    }, 20);
  }

  checkForRecos(productType = '', productId: string, styles: ProductStyle[] = [], { colorId }: { colorId: string | undefined }) {
    const { hydraBlueSkyPdp, fetchProductPageRecos } = this.props;
    const productStyleId = (ProductUtils.getStyleByColor(styles, colorId) || {}).styleId;

    if (!productStyleId) {
      return;
    }

    const recoType = ProductUtils.shouldUseVisualRecos(productType);
    fetchProductPageRecos(productId, productStyleId, recoType !== NO_VIZ, hydraBlueSkyPdp);
  }

  useSeoUrl(product: FormattedProductBundle, colorId?: string) {
    this.context.router.replacePreserveAppRoot(this.buildSeoUrl(product, colorId));
  }

  buildSeoUrl(product: FormattedProductBundle, colorId?: string) {
    const { search, hash } = this.props.location;
    return `${buildSeoProductUrl(product, colorId)}${search ? search : ''}${ hash || ''}`;
  }

  showAndHighlightSelectSizeTooltip() {
    const { showSelectSizeTooltip, highlightSelectSizeTooltip } = this.props;
    showSelectSizeTooltip();
    highlightSelectSizeTooltip();
  }

  unhighlightAndHideSelectSizeTooltip() {
    const { hideSelectSizeTooltip, unhighlightSelectSizeTooltip } = this.props;
    unhighlightSelectSizeTooltip();
    hideSelectSizeTooltip();
  }

  setLastSelectedSizes() {
    const {
      setLastSelectedSize,
      product : {
        detail,
        selectedSizing
      }
    } = this.props;
    const { sizing : { hypercubeSizingData = {} } } = detail as FormattedProductBundle;

    const gender = ProductUtils.getGender(detail);
    Object.entries(selectedSizing).forEach(([dimensionId, sizeId]) => {
      if (sizeId) {
        const range = hypercubeSizingData[sizeId];
        if (gender && dimensionId && range) {
          setLastSelectedSize(gender, dimensionId, sizeId, range.min, range.max);
        }
      }
    });
  }

  onAddToCart = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    const {
      addItemToCart,
      changeQuantity,
      product,
      pushMicrosoftUetEvent,
      trackLegacyEvent,
      toggleOosButton,
      showCartModal
    } = this.props;
    const { detail, selectedSizing, colorId } = product;
    const { styles, sizing } = detail as FormattedProductBundle;
    const style = ProductUtils.getStyleByColor(styles, colorId);
    const currentColorId = colorId || style.colorId;
    const stock = ProductUtils.getStockBySize(sizing.stockData, currentColorId, selectedSizing);
    e.preventDefault();
    if (!stock) {
      toggleOosButton(true);
      this.makeOutOfStock();
    } else {

      let { stockId: { value: stockId } = { value: undefined } } = e.target as HTMLFormElement, sticky;
      if (!stockId) {
        ({ dataset: { sticky, stockId } = { sticky: undefined, stockId: undefined } } = e.currentTarget as HTMLElement);
      }
      const isSticky = Boolean(sticky);
      /* To differentiate sticky vs non-sticky add to cart, the sticky button fires this method via onClick (opposed to the native form submit)
         We need to read the stockID from the button directly, since the event doesn't have access to the hidden stockId input in AddToCart.jsx
      */
      if (stockId && ProductUtils.isSizeSelectionComplete(sizing, selectedSizing)) {
        trackLegacyEvent('CartAddItem', null, `stockId:${stockId}|styleId:${style.styleId}`);
        const amethystEventBundle = { ...style, addedFrom: PRODUCT_PAGE, isSticky };
        track(() => ([evAddToCart, amethystEventBundle]));
        pushMicrosoftUetEvent(createAddToCartMicrosoftUetEvent(stockId, +usdToNumber(style.price), 'product'));
        this.setLastSelectedSizes();
        changeQuantity({ items: [{ stockId, quantity: 1, quantityAddition: true }] }, { firePixel: true })
          .then(response => {
            const error = translateCartError(response);
            if (error) {
              alert(error);
            } else {
              addItemToCart(); // monetate event
              showCartModal(true, stockId);
            }
          });
      } else {
        this.handleAddToCartIncomplete(style, sizing, selectedSizing, isSticky);
      }
    }
  };

  // re-usable handler for onAddToCart cases where sizing selection is incomplete
  handleAddToCartIncomplete = (style: ProductStyle, sizingData: ProductSizing, selectedSizing: SelectedSizing, isSticky: boolean) => {
    this.showAndHighlightSelectSizeTooltip();
    this.props.validateDimensions(true);
    const firstInvalidDimensionName = ProductUtils.getMissingDimensionName(selectedSizing, sizingData);
    const missingDimension = firstInvalidDimensionName ? `${firstInvalidDimensionName}_dimension`.toUpperCase() : 'UNKNOWN_PRODUCT_DIMENSION';
    track(() => ([evAddToCart, { ...style, incompleteAddToCart: true, missingDimension, addedFrom: PRODUCT_PAGE, isSticky }]));

    // Do not scroll or show the alert dialog on desktop
    if (!isDesktop()) {
      if (this.buyBox) {
        this.buyBox.scrollIntoView(true);
      }
      // scroll into view is async, so we want the elements to be in view when they see this alert.
      setTimeout(() => {
        alert(`Please select ${indefiniteArticleSelector(firstInvalidDimensionName)} ${firstInvalidDimensionName}.`);
      }, 25);
    }
  };

  getStyleId = () => {
    const {
      product: { detail, colorId }
    } = this.props;
    if (detail) {
      const { styleId } = ProductUtils.getStyleByColor(detail?.styles, colorId);
      return styleId;
    }
  };

  onStockChange(
    styleId: string,
    selectedSizing: SelectedSizing,
    { label, name, selectedOption }: { label: string | null; name?: string; selectedOption?: SizingValue}
  ) {
    const { product: { detail }, productSizeChanged, stockSelectionCompleted, validateDimensions, productSwatchChange } = this.props;
    if (detail) {
      const { colorId } = ProductUtils.getStyleMap(detail.styles)[styleId];
      const { sizing } = detail;
      if (label === 'color') {
        productSwatchChange(colorId);
        this.context.router.replacePreserveAppRoot(this.buildSeoUrl(detail, colorId));
      } else {
        productSizeChanged(selectedSizing);
        validateDimensions();
        if (ProductUtils.isSizeSelectionComplete(sizing, selectedSizing)) {
          stockSelectionCompleted({ name, selectedOption, source: CUSTOMER_DROPDOWN_DIMENSION_SELECTION });
          this.unhighlightAndHideSelectSizeTooltip();
        }
      }
    }
  }

  onProductDescriptionToggle(e: React.MouseEvent<HTMLButtonElement>) {
    const { dataset } = e.target as HTMLElement;
    const { trackValue } = dataset;
    trackValue && this.props.toggleProductDescription(trackValue);
  }

  onProductDescriptionCollapsed(ref: React.RefObject<HTMLElement>) {
    this.props.onProductDescriptionCollapsed(ref);
  }

  onShowReportError = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { toggleReportAnErrorModal } = this.props;
    event.preventDefault();
    toggleReportAnErrorModal(true);
  };

  onRecoClicked(
    e: React.MouseEvent,
    {
      cardData: { productId },
      amethystRecoType: widgetType,
      index
    }: {
      cardData: { productId: string };
      amethystRecoType: string;
      index: number;
    }
  ) {
    track(() => ([
      evRecommendationClick, {
        index,
        recommendationType: 'PRODUCT_RECOMMENDATION',
        recommendationValue: productId,
        recommendationSource: 'EP13N',
        widgetType: widgetType
      }
    ]));
  }

  onOpenProductNotifyMe = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { toggleProductNotifyModal, trackLegacyEvent } = this.props;
    event.preventDefault();
    trackLegacyEvent('Product-Page', 'OOS', 'Notify-Me');
    toggleProductNotifyModal(true);
  };

  onCloseProductNotifyMe = () => {
    this.props.toggleProductNotifyModal(false);
  };

  onOpenBrandNotify = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { toggleBrandNotifyModal } = this.props;
    event.preventDefault();
    toggleBrandNotifyModal(true);
  };

  onCloseBrandNotify = () => {
    this.props.toggleBrandNotifyModal(false);
  };

  onOutofStockPopoverShown = () => {
    const {
      params: { productId, colorId },
      product: { detail },
      fetchProductSearchSimilarity
    } = this.props;
    if (detail) {
      const { styles } = detail;
      const style = ProductUtils.getStyleByColor(styles, colorId);
      if (style) {
        fetchProductSearchSimilarity(productId, style.styleId);
      }
    }
  };

  showNoSizeSelected = (sizing: ProductSizing, selectedSizing: SelectedSizing) => {
    const { validateDimensions } = this.props;

    this.showAndHighlightSelectSizeTooltip();
    validateDimensions(true);
    const firstInvalidDimensionName = ProductUtils.getMissingDimensionName(selectedSizing, sizing);

    // Do not show the alert dialog on desktop
    if (!isDesktop()) {
      alert(`Please select a ${firstInvalidDimensionName}.`);
    }
  };

  handleThumbnailClick = () => {
    const { isSpotlightActive } = this.state;
    if (isSpotlightActive) {
      this.zoomOut();
    }
    trackLegacyEvent('Product-Page', 'PrImage', 'Thumbnail-Swap-Click');
  };

  handleProductImageClick = (lowResImageSrc: string, hiResImageSrc: string, lowResImageWidth: number, lowResImageHeight: number, mouseCoordinates: { pageX: number; pageY: number }) => {
    this.setState({
      isSpotlightActive: true,
      spotlightLowResImageSrc: lowResImageSrc,
      spotlightHiResImageSrc: hiResImageSrc,
      spotlightHiResImageWidth: lowResImageWidth * 4,
      spotlightHiResImageHeight: lowResImageHeight * 4,
      mouseCoordinates
    }, () => {
      this.setHeightsAndOffsets();
    });
  };

  setHeightsAndOffsets = () => {
    const { pdpConfig, hydraBlueSkyPdp } = this.props;
    const productImagesEl = document.querySelector(pdpConfig.spotlightProductImagesId);
    const productImagesOffset = offset(productImagesEl);
    /**
     * OIDIA Test case for spotlight zoom calculation (this fixes an issue with zoom feature not calculation properly)
     * @TODO Consolidate once tests are over
     */
    let spotlightWrapperHeight;
    if (hydraBlueSkyPdp) {
      // OIDIA Calculation fix (should always relies on the height of the container - which varies in position and size)
      spotlightWrapperHeight = productImagesOffset?.height || 500; // default min-height for the productImage container
    } else {
      // Current calculation
      const productImagesOffsetTop = productImagesOffset.top + productImagesOffset.height;
      const theaterOffsetTop = offset(this.theater).top;
      spotlightWrapperHeight = productImagesOffsetTop - theaterOffsetTop;
    }

    this.setState({ spotlightWrapperHeight }, () => {
      this.calcMovementRatios();
    });
  };

  handleSpotlightWrapperMouseMove = (event: React.MouseEvent) => {
    this.moveSpotlight(event);
  };

  zoomOut = () => {
    this.setState({
      spotlightLowResImageSrc: null,
      spotlightHiResImageSrc: null,
      spotlightHiResImageWidth: 0,
      spotlightHiResImageHeight: 0,
      spotlightWrapperHeight: 0,
      movementRatioX: 0,
      movementRatioY: 0,
      mouseCoordinates: {},
      isSpotlightActive: false
    });
  };

  calcMovementRatios = () => {
    if (this.spotlightWrapper) {
      const { spotlightWrapperHeight } = this.state;
      const spotlightWrapperWidth = Math.abs(this.spotlightWrapper.offsetWidth);
      const { spotlightHiResImageWidth, spotlightHiResImageHeight, mouseCoordinates } = this.state;

      this.setState({
        movementRatioX: (spotlightHiResImageWidth - spotlightWrapperWidth) / spotlightWrapperWidth,
        movementRatioY: (spotlightHiResImageHeight - spotlightWrapperHeight) / spotlightWrapperHeight
      }, () => {
        this.moveSpotlight(mouseCoordinates);
      });
    }
  };

  moveSpotlight = (event: React.MouseEvent) => {
    if (this.spotlight && this.spotlightWrapper) {
      const { movementRatioX, movementRatioY } = this.state;
      const relativeX = event.pageX - offset(this.spotlightWrapper).left;
      const relativeY = event.pageY - offset(this.spotlightWrapper).top;

      const spotlightLeft = relativeX * movementRatioX;
      const spotlightTop = relativeY * movementRatioY;

      this.spotlight.style.left = `${-spotlightLeft}px`;
      this.spotlight.style.top = `${-spotlightTop}px`;
    }
  };

  makeSpotlight = () => {
    const {
      isSpotlightActive,
      spotlightWrapperHeight,
      spotlightLowResImageSrc,
      spotlightHiResImageSrc,
      spotlightHiResImageWidth,
      spotlightHiResImageHeight
    } = this.state;
    const { testId } = this.context;

    const style: { height?: number; display?: string} = {};
    if (spotlightWrapperHeight) {
      style.height = spotlightWrapperHeight;
    } else {
      style.display = 'none';
    }

    return (
      <>
        <button
          type="button"
          ref={el => this.spotlightWrapper = el}
          style={style}
          className={cn(css.spotlightWrapper, { [css.active]: isSpotlightActive })}
          onMouseMove={this.handleSpotlightWrapperMouseMove}
          tabIndex={isSpotlightActive ? 0 : -1 }
          data-test-id={testId('zoomedImageFrame')}>
          <div ref={el => this.spotlight = el} className={css.spotlight} data-test-id={testId('spotlightImageContainer')}>
            {spotlightLowResImageSrc &&
              <img
                src={spotlightLowResImageSrc}
                className={css.spotlightLowResImage}
                width={spotlightHiResImageWidth}
                height={spotlightHiResImageHeight}
                alt="presentation"/>
            }
            {spotlightHiResImageSrc &&
              <img
                src={spotlightHiResImageSrc}
                className={css.spotlightHiResImage}
                width={spotlightHiResImageWidth}
                height={spotlightHiResImageHeight}
                alt="presentation"/>
            }
          </div>
        </button>
        <button
          type="button"
          data-test-id={testId('spotlightClose')}
          className={css.spotClose}
          tabIndex={isSpotlightActive ? 0 : -1}
          aria-label="Zoom out of product image"/>
      </>
    );
  };

  makeFavoritesButton(style: ProductStyle, sizing: ProductSizing, selectedSizing: SelectedSizing) {
    const { hydraBlueSkyPdp, params:  { productId }, product: { detail } } = this.props;
    const firstInvalidDimensionName = ProductUtils.getMissingDimensionName(selectedSizing, sizing);
    const missingDimension = firstInvalidDimensionName && `${firstInvalidDimensionName}_dimension`.toUpperCase();
    const productImages: PDPFeaturedImage[] = getProductImagesFormatted(style?.images, detail?.defaultProductType);

    /**
     * For the BlueSky PDP, we render the collection widget in a different spot.  Instead of duplicating markup,
     * We create two separate containers for each experience, and render into either via a portal depending on the treatment/control assignment
     * using the PortalNodeManager API
     */

    if (!this.blueSkyCollectionNode) {
      return null;
    }

    return (
      <BranchPortal node={this.blueSkyCollectionNode}>
        <SocialCollectionsWidget
          canAddNewCollection={true}
          shouldAddImmediately={true}
          getStyleId={this.getStyleId}
          productId={productId}
          colorId={style.colorId}
          price={style.price}
          missingDimension={missingDimension}
          sourcePage={PRODUCT_PAGE}
          hydraBlueSkyPdp={hydraBlueSkyPdp}
          productImages={productImages}
        />
      </BranchPortal>
    );
  }

  makeSharingButtons() {
    const {
      customerFirstName,
      product: { detail },
      params: { productId, colorId },
      location,
      hydraBlueSkyPdp,
      obfuscatedCustomerId,
      influencer: {
        status: influencerStatus,
        influencerToken
      }
    } = this.props;

    const { isLinkCopiedToastActive } = this.state;
    const { hash = '' } = location;
    const shouldOpenTellAFriendModal = hash.toLowerCase().includes('#showmodal=tellafriend');
    const { fbAppId } = links.sharing;
    const { testId } = this.context;

    if (hydraBlueSkyPdp) {
      if (detail) {
        const {
          styles,
          brandName,
          productName,
          defaultImageUrl
        } = detail;
        const style = ProductUtils.getStyleByColor(styles, colorId);
        const [ link, notificationMessage ] = isInfluencerProgramEnabled && influencerStatus === InfluencerStatus.ACTIVE
          ? [ ProductUtils.getInfluencerSharingButtonLink(productId, influencerToken, colorId), 'Your unique influencer URL is copied.' ]
          : [ ProductUtils.getSharingButtonLink(productId, colorId), 'Product link copied.' ];
        const product = {
          link: link,
          name: `${brandName} ${productName}`,
          style: style.color,
          image: defaultImageUrl
        };

        const onSharingButtonClick = () => {
          if (isInfluencerProgramEnabled && influencerStatus === InfluencerStatus.ACTIVE && obfuscatedCustomerId) {
            ProductUtils.generateShareLinkAmethystEvent(obfuscatedCustomerId, productId, influencerToken, colorId);
          }
        };

        const showToast = () => {
          this.setState({ isLinkCopiedToastActive: true });
          setTimeout(() => this.setState({ isLinkCopiedToastActive: false }), 4000);
        };

        return (
          <div>
            <div className={css.sharingV2}>
              <div className={css.sharingIconsV2} data-test-id={testId('shareSectionV2')}>
                <LinkShare
                  className={css.link}
                  product={product}
                  onClick={onSharingButtonClick}
                  showToast={showToast}/>
                <FacebookShareV2
                  className={css.facebookV2}
                  appId={fbAppId}
                  product={product}
                  onClick={onSharingButtonClick}/>
                <TwitterShareV2
                  className={css.twitterV2}
                  product={product}
                  onClick={onSharingButtonClick}/>
                <PinterestShareV2
                  className={css.pinterestV2}
                  product={product}
                  onClick={onSharingButtonClick}/>
              </div>
            </div>
            {isLinkCopiedToastActive && <LinkCopiedToast notificationMessage={notificationMessage}/>}
          </div>
        );
      }
      return null;
    }

    if (detail) {
      const style = ProductUtils.getStyleByColor(detail.styles, colorId);
      const product = {
        link: ProductUtils.getSharingButtonLink(productId, colorId),
        name: `${detail.brandName} ${detail.productName}`,
        style: style.color,
        image: detail.defaultImageUrl
      };

      return (
        <div className={css.sharing}>
          <span className={css.sharePrefix}>Share:</span>
          <div className={css.sharingIcons} data-test-id={testId('shareSection')}>
            <FacebookShare className={css.facebook} appId={fbAppId} product={product}/>
            <TwitterShare className={css.twitter} product={product}/>
            <PinterestShare className={css.pinterest} product={product}/>
            <SmsShare className={css.sms} product={product}/>
            <EmailShare
              product={product}
              productId={productId}
              colorId={colorId || style.colorId}
              firstName={customerFirstName}
              shouldOpenTellAFriendModal={shouldOpenTellAFriendModal}
              hash={hash}
            />
          </div>
        </div>
      );
    }
    return null;
  }

  onSwatchStyleChosen(event: React.MouseEvent) {
    event.preventDefault();
    const { currentTarget } = event;
    const { dataset: { styleId } = { styleId: undefined } } = currentTarget as HTMLElement;
    const { isSpotlightActive } = this.state;
    const { product: { selectedSizing } } = this.props;
    styleId && this.onStockChange(styleId, selectedSizing, { label: 'color' });
    if (isSpotlightActive) {
      this.zoomOut();
    }
  }

  // Only used for mobile, desktop version is baked into `<DesktopImageCarousel />`
  makeSwatchPicker(productStyles: Record<string, ProductStyle>, style: ProductStyle, styleThumbnails: StyleThumbnail[], isGiftCard?: boolean | '') {
    const {
      hydraBlueSkyPdp,
      product: {
        detail
      }
    } = this.props;
    if (detail) {
      return !isGiftCard && !hydraBlueSkyPdp && (
        <div className={css.swatchPicker} id="swatchPicker">
          <SwatchPicker
            productStyles={productStyles}
            selectedStyleId={style.styleId}
            onStyleChange={this.onSwatchStyleChosen}
            thumbnails={styleThumbnails} />
        </div>
      );
    }
    return null;
  }

  onHideSelectSizeTooltip() {
    const { product: { isSelectSizeTooltipHighlighted }, hideSelectSizeTooltip } = this.props;
    if (!isSelectSizeTooltipHighlighted) {
      hideSelectSizeTooltip();
    }
  }

  makeProductNotifyMe = () => {
    // leaving a comment here that says "Can't find your size?" because someone
    // is gonna search that and "Can&apos;t find your size?" won't match
    const { testId } = this.context;
    const { hydraBlueSkyPdp } = this.props;
    return (
      <div className={cn(css.notifyMe, { [css.blueSkyNotifyMe]: hydraBlueSkyPdp })}>
        <button
          type="button"
          className={cn(css.notifyMeButton, { [css.blueSkyNotifyMeButton]: hydraBlueSkyPdp })}
          onClick={this.onOpenProductNotifyMe}
          data-test-id={testId('notifyMe')}>Can&apos;t find your size?</button>
      </div>
    );
  };

  makeStylePicker({
    product,
    style,
    styleThumbnails,
    selectedSizing,
    dimensionValidation,
    sizingPredictionId,
    isOnDemandEligible
  }: {
    product: FormattedProductBundle;
    style: ProductStyle;
    styleThumbnails: StyleThumbnail[];
    selectedSizing: SelectedSizing;
    dimensionValidation: ProductDimensionValidation;
    sizingPredictionId: string | null;
    isOnDemandEligible: boolean | null | undefined;
  }) {
    const {
      hydraPrimeTwoDayShipping,
      location,
      symphonyStory: { slotData },
      product: {
        detail,
        isSelectSizeTooltipVisible,
        isSelectSizeTooltipHighlighted
      },
      isGiftCard,
      isNonStandardShipOptionLabels,
      pdpConfig,
      showOOSNotifyMe,
      showSelectSizeTooltip,
      hydraBlueSkyPdp
    } = this.props;
    const { testId } = this.context;
    if (style && detail) {
      const { defaultImageUrl, brandName, productName, styles } = detail;
      return (
        <div id="buyBox" className={cn(css.stylePicker, { [css.noBorder]: hydraBlueSkyPdp })} ref={c => this.buyBox = c}>
          <div className={cn(css.newStylePicker, { [css.whiteBg]: hydraBlueSkyPdp })}>
            <StylePicker
              makeProductNotifyMe={this.makeProductNotifyMe}
              styleList={styles}
              product={this.props.product}
              productId={product.productId}
              productType={product.defaultProductType}
              productImage={defaultImageUrl}
              productTitle={`${brandName} ${productName}`}
              sizing={product.sizing}
              genders={product.genders}
              selectedSizing={selectedSizing}
              selectedStyle={style}
              thumbnails={styleThumbnails}
              dimensionValidation={dimensionValidation.dimensions}
              onStockChange={this.onStockChange}
              onAddToCart={this.onAddToCart}
              addToCartAction={pdpConfig.addToCartAction}
              isGiftCard={isGiftCard}
              isSelectSizeTooltipVisible={isSelectSizeTooltipVisible}
              isSelectSizeTooltipHighlighted={isSelectSizeTooltipHighlighted}
              onShowSelectSizeTooltip={showSelectSizeTooltip}
              onHideSelectSizeTooltip={this.onHideSelectSizeTooltip}
              onUnhighlightSelectSizeTooltip={this.unhighlightAndHideSelectSizeTooltip}
              showOosNotifyMe={showOOSNotifyMe}
              showSizeGender={pdpConfig.showSizeGender}
              showSizeChartLink={pdpConfig.showSizeChartLink}
              sizingPredictionId={sizingPredictionId}
              isOnDemandEligible={isOnDemandEligible}
              hasRecommendedSizing={pdpConfig.hasRecommendedSizing}
              location={location}
              sizeSymphonyContent={slotData?.['buybox-size-1']}
              addToCartSymphonyContent={slotData?.['buybox-cart-1']}
              hydraPrimeTwoDayShipping={hydraPrimeTwoDayShipping}
              isNonStandardShipOptionLabels={isNonStandardShipOptionLabels}
              pageType={PRODUCT_PAGE}
              hydraBlueSkyPdp={hydraBlueSkyPdp}
              hydraStickyAddToCart={hydraBlueSkyPdp}
            />
            {pdpConfig.showRewardsCopy && (
              <div className={css.rewardsCopy}>
                Join Zappos Rewards & get Free 2-Business Day shipping.
                <Link
                  to="/zappos-rewards/"
                  data-track-action="Product-Page"
                  data-track-label="PrForm"
                  data-track-value="Rewards">Enroll now</Link>
              </div>
            )}
            {!hydraBlueSkyPdp && this.blueSkyCollectionNode && <LeafPortal node={this.blueSkyCollectionNode}/>}
            {this.makeFavoritesButton(style, product.sizing, selectedSizing)}
          </div>
          {!hydraBlueSkyPdp && showOOSNotifyMe && !isGiftCard && this.makeProductNotifyMe()}
          {pdpConfig.showBrandNotifyMe && !isGiftCard && !hydraBlueSkyPdp && (
            <div className={css.brandNotifyMe}>
              <a
                href={`${desktopBaseUrl}/prd/popups/brandNotifyMe.zml?brandId=${product.brandId}&brandName=${product.brandName}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Click to follow this brand and receive new product updates!"
                onClick={this.onOpenBrandNotify}
                data-test-id={testId('notifyMeNewStyles')}>Notify Me of New Styles</a>
            </div>
          )}
          {this.makeSharingButtons()}
          <GamSlot slot={PDP_WIDE_MID} />
        </div>
      );
    }
  }

  onBack = (e: React.MouseEvent) => {
    e.preventDefault();
    this.context.router.goBack();
  };

  makeOutOfStock = () => {
    const {
      product: { detail, similarStyles, selectedSizing },
      brandPage, params, pdpConfig, submitNotifyBrandEmail,
      productNotify,
      showOOSNotifyMe
    } = this.props;
    const { notifyEmail: { submitted } } = brandPage;
    if (detail) {
      const { productId, brandId, brandName, styles, sizing } = detail;
      const productStyles = ProductUtils.getStyleMap(styles);
      const style = ProductUtils.getStyleByColor(styles, params.colorId);
      const stock = ProductUtils.getStockBySize(sizing.stockData, style.colorId, selectedSizing);
      // Different marketplaces show different popups when stock is not available
      if (pdpConfig.showOutOfStockPopover) {
        return (
          <OutOfStockPopover
            brandId={brandId}
            brandName={brandName}
            recos={similarStyles}
            stock={stock}
            isSubmitted={submitted}
            onBrandNotifySubmit={submitNotifyBrandEmail}
            onShow={this.onOutofStockPopoverShown}
          />
        );
      } else if (showOOSNotifyMe) {
        return (
          <OutOfStockModalWrapper
            detail={detail}
            productId={productId}
            style={style}
            sizing={sizing}
            selectedSizing={selectedSizing}
            productStyles={productStyles}
            onOpenProductNotifyMe={this.onOpenProductNotifyMe}
            isProductNotifyOpen={productNotify.modalShown}
            onCloseProductNotifyMe={this.onCloseProductNotifyMe}
            onStyleChange={this.onSwatchStyleChosen}
          />
        );
      }
    } else {
      return null;
    }
  };

  makeBrandLogo({ brand }: { brand: ProductBrand }, secureImageBaseUrl: string) {
    const { id, name, headerImageUrl } = brand;
    const { testId } = this.context;
    if (headerImageUrl) {
      const imgProps = {
        src: `${secureImageBaseUrl}${headerImageUrl}`,
        alt: name,
        itemProp: 'logo'
      };
      const placeholder = <div className={css.brandPlaceholder} />;
      return (
        <Link
          to={buildSeoBrandString(name, id)}
          title={name}
          data-track-action="Product-Page"
          data-track-label="Tabs"
          data-track-value="Brand-Logo"
          data-test-id={testId('brandLogo')}>
          <ImageLazyLoader
            imgProps={imgProps}
            placeholder={placeholder}
          />
        </Link>
      );
    } else {
      return (
        <p className={css.brandName}>
          <Link to={buildSeoBrandString(name, id)}>{name}</Link>
        </p>
      );
    }
  }

  makeVideoInDescription(videos: ProductVideo[] = [], productId: string, isYouTubeVideo: boolean, youtubeSrc?: string) {
    const video = videos.find(video => video.videoEncodingExtension === 'mp4');
    if (video) {
      const videoSrcUrl = isYouTubeVideo ? youtubeSrc : `${desktopBaseUrl}${video.filename}`;
      const slotDetails = {
        src: videoSrcUrl,
        productId,
        heading: 'Product Video',
        isEmbedded: isYouTubeVideo
      };
      const videoProps = {
        heightValue: '100%',
        isYouTubeVideo,
        slotDetails,
        widthValue: '100%'
      };
      return (
        <div className={css.descriptionVideo}>
          <MelodyVideoPlayer {...videoProps} showPlaceholder={true} />
        </div>
      );
    }
  }

  // TODO ts Type This once hearts are typed or refactored
  makeDontForget = (heartsData: any) => {
    const { dontForget, showDontForget } = this.props;
    let contents;
    if (showDontForget && dontForget) {
      contents = <DontForget {...dontForget} heartsData={heartsData} />;
    }
    return <div className={css.dontForget}>{contents}</div>;
  };

  handleReviewMediaClick = (reviewId: string, mediaIndex: number) => {
    this.props.showReviewGalleryModal(reviewId, mediaIndex);
  };

  makeAsk() {
    const { showAsk, params, product, hydraBlueSkyPdp } = this.props;
    if (showAsk) {
      return <div className={cn(css.askContainer, { [css.fullWidth]: hydraBlueSkyPdp })} data-test-id={this.context.testId('askContainer')}><LazyAsk product={product} params={params} /></div>;
    }
    return null;
  }

  makeSizeGroups() {
    const {
      params: { colorId: colorIdFromUrl },
      product: { detail },
      showSizeGroups, sizeGroups
    } = this.props;
    if (detail) {
      const { styles } = detail;
      const { colorId } = ProductUtils.getStyleByColor(styles, colorIdFromUrl);
      if (showSizeGroups) {
        return <SizeGroups
          {...sizeGroups}
          currentColorId={colorId} />;
      }
    }
    return null;
  }

  makeReviewPhotoGallery = ({
    divClass,
    includeHr,
    id,
    limitOverride,
    name,
    showMediaCount
  }: {
    divClass: string;
    includeHr: boolean;
    id?: string;
    limitOverride: number;
    name: string;
    showMediaCount: boolean;
  }) => {
    const {
      props: { reviewGallery, showReviews },
      handleReviewMediaClick
    } = this;
    if (!showReviews || !shouldRenderReviewGallery(reviewGallery)) {
      return null;
    }
    return (
      <ReviewPhotoGallery
        id={id}
        divClass={divClass}
        includeHr={includeHr}
        reviewGallery={reviewGallery}
        limit={limitOverride}
        placement={name}
        onOpenMediaReview={handleReviewMediaClick}
        showMediaCount={showMediaCount}
      />
    );
  };

  makeReviewPhotoGalleryAisle = () => this.makeReviewPhotoGallery({
    name: 'aisle',
    showMediaCount: true,
    includeHr: true,
    divClass: css.reviewPhotoGalleryAisle,
    id: 'photoVideo',
    limitOverride: 2
  });

  makeReviewPhotoGalleryBottom = () => {
    const { makeReviewPhotoGallery } = this;
    const { hydraBlueSkyPdp } = this.props;
    const opts = {
      name: 'bottom',
      showMediaCount: false,
      includeHr: true,
      divClass: cn(css.reviewPhotoGalleryBottom, { [css.fullWidth]: hydraBlueSkyPdp }),
      limitOverride : 10 // we show a max of 10 on desktop, and less so on other form factors. Limit the dom nodes and images we need to load
    };
    return makeReviewPhotoGallery(opts);
  };

  makeHighlightsAccordionSection = () => {
    const {
      params,
      product,
      forKidsProductCallout,
      hydraBlueSkyPdp,
      rewardsBrandPromos = {},
      pdpConfig,
      hasRewardsTransparency
    } = this.props;

    const {
      detail
    } = product;

    if (pdpConfig.showProductCallout && detail) {
      const {
        styles,
        brandId
      } = detail;

      const style = ProductUtils.getStyleByColor(styles, params.colorId);
      const attributes = style.taxonomyAttributes;

      if (ProductUtils.hasRewards(hasRewardsTransparency, rewardsBrandPromos, brandId) || (attributes &&
            attributes.filter(attribute => productCalloutIconMap.get(attribute.value)).length > 0)) {
        return <AccordionItem
          key="Highlights"
          heading="Highlights"
          accordionTestId="Highlights">
          <ProductCallout
            brandId={brandId}
            hydraBlueSkyPdp={hydraBlueSkyPdp}
            rewardsBrandPromos={rewardsBrandPromos}
            attributes={attributes}
            forKidsProductCallout={forKidsProductCallout}
            useTabbableTooltips
            useTooltipOverlay={false}
          />
        </AccordionItem>;
      }
      return null;
    }
  };

  makeItemInformationAccordionSection = () => {
    const {
      params,
      product,
      secureImageBaseUrl,
      hydraBlueSkyPdp,
      showReviews
    } = this.props;

    const {
      detail,
      isDescriptionExpanded
    } = product;

    const isLoaded = ProductUtils.isProductDataLoaded(product, params);

    if (!isLoaded) {
      return <PageLoader />;
    }

    if (!detail) {
      return null;
    }

    const {
      brandId,
      defaultProductType,
      description,
      productId
    } = detail;

    const isProductDescriptionExpanded = !!isDescriptionExpanded;
    const productInfoRef = React.createRef<HTMLElement>();

    return (
      <AccordionItem
        innerRef={productInfoRef}
        key="ProductInfo"
        heading="Product Information"
        accordionTestId="ProductInfo">
        <div className={cn({ [css.descriptionWrapper]: !hydraBlueSkyPdp }, { [css.fullWidth]: hydraBlueSkyPdp })}>
          <ExpandableProductDescription
            productId={productId}
            defaultProductType={defaultProductType}
            descriptionItems={description}
            allowCollapse={showReviews}
            isExpanded={isProductDescriptionExpanded}
            focusableRef={productInfoRef}
            onCollapse={this.onProductDescriptionCollapsed}
            onToggle={this.onProductDescriptionToggle}
            onReportError={this.onShowReportError}
            brandLogo={this.makeBrandLogo(detail, secureImageBaseUrl)}
            brandName={detail.brandName}
            brandId={brandId}
            hydraBlueSkyPdp={hydraBlueSkyPdp}
          />
        </div>
      </AccordionItem>
    );
  };

  makeProductAccordion = () => {
    const { testId } = this.context;
    const accordionSections: React.ReactElement<AccordionItemProps>[] = [];
    const highlights = this.makeHighlightsAccordionSection();
    const itemInfo = this.makeItemInformationAccordionSection();

    if (highlights) {
      accordionSections.push(highlights);
    }

    if (itemInfo) {
      accordionSections.push(itemInfo);
    }

    return (
      <div className={css.accordionContainer} data-test-id={testId('accordionContainer')}>
        { accordionSections.length > 0 &&
          <Accordion defaultOpenIndex={0} openMultiple>
            { accordionSections }
          </Accordion>
        }
      </div>
    );
  };

  onBuyBoxPageContentClick = (e: React.MouseEvent) => {
    const { trackEvent } = this.props;
    const eventTarget = e.target as HTMLElement;
    if (eventTarget.matches('[data-pagecontent-id="pdp-buybox"] a')) {
      e.nativeEvent.stopImmediatePropagation();
      trackEvent('TE_PDP_BUYBOX_CONTENT_CLICK', eventTarget.textContent);
    }
  };

  onSymphonyComponentClick = (e: React.MouseEvent) => {
    // Mostly taken from Landing.jsx container
    const { symphonyStory: { productId }, trackLegacyEvent } = this.props;
    const { currentTarget } = e;
    const { dataset: { eventlabel, eventvalue, slotindex } } = currentTarget as HTMLElement;
    const action = `Detail-${productId}`;
    const label = stripSpecialCharsDashReplace(eventlabel);
    const value = stripSpecialCharsDashReplace(eventvalue);
    const slotIndex = stripSpecialCharsDashReplace(slotindex);

    e.stopPropagation();
    trackLegacyEvent(action, label, value);
    trackEvent('TE_PDP_STORIES_CLICK', `${slotIndex}:${label}:${value}`);
  };

  render() {
    const {
      params,
      pdpConfig,
      product,
      reportAnError,
      reviewGallery,
      productNotify,
      secureImageBaseUrl,
      forKidsProductCallout,
      hydraBlueSkyPdp,
      pageLoaded,
      location,
      showMelodyShippingAndReturnsBanner,
      numberOfReviews,
      numberOfAskQuestions,
      similarProductRecos,
      isCustomer,
      heartProduct,
      hearts,
      products,
      toggleHeartingLoginModal,
      trackEvent,
      unHeartProduct,
      rewardsBrandPromos,
      metaDescription,
      isGiftCard,
      showReviews,
      symphonyStory: { stories, loadingSymphonyStoryComponents }
    } = this.props;

    const {
      brandPromo,
      carouselIndex,
      detail,
      styleThumbnails,
      selectedSizing,
      validation,
      sizingPredictionId,
      isOnDemandEligible,
      isDescriptionExpanded
    } = product;

    const { hash = '' } = location;

    const isLoaded = ProductUtils.isProductDataLoaded(product, params);

    if (!isLoaded) {
      return <PageLoader />;
    }

    if (!detail) {
      return null;
    }

    const {
      brandId,
      defaultProductType,
      description,
      productId,
      styles,
      videos,
      sizeFit,
      widthFit,
      archFit,
      reviewSummary,
      reviewCount,
      productRating,
      youtubeVideoId,
      youtubeData : {
        embedUrl,
        contentUrl,
        videoName,
        thumbnailUrl,
        uploadDate
      }
    } = detail;

    const { isSpotlightActive } = this.state;
    const productStyles = ProductUtils.getStyleMap(styles);
    const style = ProductUtils.getStyleByColor(styles, params.colorId);
    const styleId = style && style.styleId;
    const multiviewImages = ProductUtils.buildAngleThumbnailImages(style, 700, 525);
    const isYouTubeVideo = !!youtubeVideoId;
    const isProductDescriptionExpanded = !!isDescriptionExpanded;
    const heartProps = {
      hasHearting,
      isCustomer,
      heartProduct,
      hearts,
      products,
      toggleHeartingLoginModal,
      trackEvent,
      unHeartProduct
    };
    const heartsData = getHeartProps(heartProps, { heartEventName: 'TE_PDP_HEART', unHeartEventName: 'TE_PDP_UNHEART' });
    const janusPixelQueryParams = {
      widget : 'RecordViewedItem',
      item : productId
    };

    return (
      <ProductContextProvider value={product}>
        <SiteMetadata loading={!isLoaded}>
          {/* data-pdp-style-id is to allow marketing to easily access the style-id */}
          <div data-pdp-style-id={styleId} className={cn(css.wrap, { [css.blueSky]: hydraBlueSkyPdp })}>
            <GamSlot slot={PDP_WIDE_TOP} />
            <GamSlot slot={PDP_NARROW_TOP} />
            <ProductBreadcrumbs
              product={detail}
              onBack={this.onBack}
              showBreadcrumbsSku={pdpConfig.showBreadcrumbsSku} />
            <div
              ref={el => this.theater = el}
              className={css.theater}
              itemScope
              itemType="http://schema.org/Product"
              data-test-id={this.context.testId('productDetail')}>
              <div className={css.primaryWrapper}>
                <div className={css.productStage} id="productRecap">
                  <div className={css.stickyProductContainer}>
                    <div id="stage" className={css.productMain}>
                      {!hydraBlueSkyPdp && <ProductSummary
                        hydraBlueSkyPdp={hydraBlueSkyPdp}
                        product={detail}
                        style={style}
                        percentOffText={pdpConfig.percentOffText}
                        showPercentOffBanner={pdpConfig.showPercentOffBanner}
                        showReviewSummary={showReviews}/>
                      }
                      {multiviewImages && multiviewImages.length && (
                        hydraBlueSkyPdp ?
                          <ProductGallery
                            style={style}
                            product={detail}
                            productVideos={videos}
                            isYouTubeVideo={isYouTubeVideo}
                            youtubeSrc={embedUrl}
                            blueSkyCollectionNode={this.blueSkyCollectionNode}
                          /> :
                          <ProductImages
                            id="productImages"
                            images={multiviewImages}
                            onThumbnailClick={this.handleThumbnailClick}
                            onProductImageClick={this.handleProductImageClick}
                            carouselIndex={carouselIndex}
                            closeSpotlight={this.zoomOut}
                            productId={params.productId}
                            colorId={params.colorId}
                            styleId={styleId}
                            videos={videos}
                            style={style}
                            isYouTubeVideo={isYouTubeVideo}
                            youtubeSrc={embedUrl}
                            onStyleChange={this.onSwatchStyleChosen}
                            makeSpotlight={this.makeSpotlight}
                            reconfigureCarousel={true}
                            hydraBlueSkyPdp={hydraBlueSkyPdp}
                            isSpotlightActive={isSpotlightActive}
                          />
                      )}
                      {styleThumbnails && this.makeSwatchPicker(productStyles, style, styleThumbnails, isGiftCard)}
                      {pdpConfig.showProductCallout && !hydraBlueSkyPdp && <ProductCallout
                        brandId={brandId}
                        hydraBlueSkyPdp={hydraBlueSkyPdp}
                        rewardsBrandPromos={rewardsBrandPromos}
                        attributes={style.taxonomyAttributes}
                        forKidsProductCallout={forKidsProductCallout} />}
                    </div>
                    <div className={cn(css.productForm, { [css.productFormBlueSky]: hydraBlueSkyPdp })} data-test-id={this.context.testId('buyBoxContainer')}>
                      <div className={css.wing}>
                        {!hydraBlueSkyPdp && <h2 className="screenReadersOnly">Product Info</h2>}
                        <div className={css.wingInfo}>
                          {hydraBlueSkyPdp && <ProductName product={detail} hydraBlueSkyPdp={hydraBlueSkyPdp} colorId={style.colorId} />}
                          <Price
                            hydraBlueSkyPdp={hydraBlueSkyPdp}
                            productStyle={style}
                            percentOffText={pdpConfig.percentOffText}
                            showPercentOffBanner={pdpConfig.showPercentOffBanner}
                          />
                          {hydraBlueSkyPdp &&
                          <div className={css.reviewSummaryBlueSkyContainer}>
                            <div className={css.shipsFreeBlueSky}>
                              <img src={shippingBox} alt="Ships Free" />
                              SHIPS FREE
                            </div>
                            <ReviewSummary
                              hydraBlueSkyPdp={hydraBlueSkyPdp}
                              numReviews={reviewCount}
                              rating={productRating}
                              productId={productId}
                            />
                          </div>
                          }
                          {pdpConfig.showFreeShipping && !hydraBlueSkyPdp && <span className={cn(css.freeShipping, { [css.whiteBg]: hydraBlueSkyPdp })}>Ships Free!</span>}
                        </div>
                        {styleThumbnails && this.makeStylePicker({
                          product: detail,
                          style,
                          styleThumbnails,
                          selectedSizing,
                          dimensionValidation: validation,
                          sizingPredictionId,
                          isOnDemandEligible
                        })}
                        {hydraBlueSkyPdp && this.makeProductAccordion()}
                        {!hydraBlueSkyPdp && this.makeDontForget(heartsData)}
                        {!hydraBlueSkyPdp &&
                        <div data-test-id={this.context.testId('sideRecoContainer')}>
                          <RecosDetail1
                            styleId={styleId}
                            numberOfAskQuestions={numberOfAskQuestions}
                            numberOfReviews={numberOfReviews}
                            params={params}
                            onRecoClicked={this.onRecoClicked}
                            similarProductRecos={similarProductRecos}
                            heartsData={heartsData}
                          />
                        </div>
                        }
                        {!hydraBlueSkyPdp && this.makeReviewPhotoGalleryAisle()}
                      </div>
                    </div>
                  </div>
                  {pdpConfig.showFitSurvey && ProductUtils.isShoeType(defaultProductType) && <FitSurvey
                    hydraBlueSkyPdp={hydraBlueSkyPdp}
                    sizeFit={sizeFit}
                    widthFit={widthFit}
                    archFit={archFit}
                    reviewSummary={reviewSummary}/>
                  }
                  {hydraBlueSkyPdp && (
                    <div className={css.recForYouBlueSky} data-test-id={this.context.testId('sideRecoContainer')}>
                      <RecosDetail1
                        styleId={styleId}
                        numberOfAskQuestions={numberOfAskQuestions}
                        numberOfReviews={numberOfReviews}
                        params={params}
                        onRecoClicked={this.onRecoClicked}
                        similarProductRecos={similarProductRecos}
                        heartsData={heartsData}
                        hydraBlueSkyPdp={hydraBlueSkyPdp}
                      />
                    </div>
                  )}
                  <meta itemProp="category" content={defaultProductType}/>
                  <RecosCompleteTheLook similarProductRecos={similarProductRecos} onRecoClicked={this.onRecoClicked} className={cn(css.aboveProductInfo, { [css.fullWidth]: hydraBlueSkyPdp })}/>

                  {(!!stories?.length && !loadingSymphonyStoryComponents) &&
                    <div className={cn(css.symphonyStoryContainer, { [css.fullWidth]: hydraBlueSkyPdp })}>
                      {stories.map((slotData, slotIndex) => (
                        <LandingSlot
                          key={slotData.slotName}
                          slotName={slotData.slotName}
                          slotIndex={slotIndex}
                          data={slotData}
                          onComponentClick={this.onSymphonyComponentClick}
                          shouldLazyLoad={true}
                        />
                      )
                      )}
                    </div>
                  }
                  <div className={cn(css.descriptionWrapper, { [css.fullWidth]: hydraBlueSkyPdp })}>
                    {!hydraBlueSkyPdp &&
                      <ExpandableProductDescription
                        hydraBlueSkyPdp={hydraBlueSkyPdp}
                        productId={productId}
                        defaultProductType={defaultProductType}
                        descriptionItems={description}
                        allowCollapse={showReviews}
                        isExpanded={isProductDescriptionExpanded}
                        onToggle={this.onProductDescriptionToggle}
                        onReportError={this.onShowReportError}
                        brandLogo={this.makeBrandLogo(detail, secureImageBaseUrl)}
                        brandName={detail.brandName}
                        brandId={brandId}
                      />
                    }
                    {this.makeSizeGroups()}
                    <GamSlot slot={PDP_NARROW_MID} />
                    <RecosDetail2
                      styleId={styleId}
                      params={params}
                      onRecoClicked={this.onRecoClicked}
                      similarProductRecos={similarProductRecos}
                      heartsData={heartsData}
                    />
                  </div>
                  {this.makeAsk()}
                  {!hydraBlueSkyPdp && pageLoaded && this.makeVideoInDescription(videos, productId, isYouTubeVideo, embedUrl)}

                  <HappyFeatureFeedback
                    additionalFeedbackMessage="Please tell us more about your experience"
                    className={cn(css.feedback, { [css.fullWidth]: hydraBlueSkyPdp })}
                    completionMessage="Thank you for your feedback!"
                    feedbackQuestion="Was this page helpful?"
                    feedbackType="PRODUCT_PAGE_EXPERIENCE_FEEDBACK"
                    pageType={PRODUCT_PAGE}
                    source="pdp"
                  />
                  <StoreConnectedDataLoadingOutfitTreatment treatmentToShow={1} productId={productId} styleId={styleId}/>
                  {showReviews && detail.isReviewableWithMedia && (
                    <LazyHowItWasWorn
                      hydraBlueSkyPdp={hydraBlueSkyPdp}
                      pageType={PRODUCT_PAGE}
                      productId={productId}
                      colorId={params.colorId}
                      productName={detail.productName} />
                  )}

                  <ReviewPreview
                    params={params}
                    onReviewMediaClick={this.handleReviewMediaClick} />
                  {showReviews && shouldRenderReviewGallery(reviewGallery) ? (
                    <ReviewGalleryWrapper params={params} returnUrl={buildSeoProductUrl(detail)}/>
                  ) : null}
                  {this.makeReviewPhotoGalleryBottom()}
                  <div className={css.outOfStock}>
                    {this.makeOutOfStock()}
                  </div>
                </div>
              </div>
              {showCustomersWhoViewedThisItemAlsoViewed &&
                <RecosDetail3
                  styleId={styleId}
                  params={params}
                  onRecoClicked={this.onRecoClicked}
                  similarProductRecos={similarProductRecos}
                  heartsData={heartsData} />
              }
              { isYouTubeVideo &&
                <StructuredVideoObject
                  name={videoName}
                  embedUrl={embedUrl}
                  contentUrl={contentUrl}
                  description={metaDescription}
                  thumbnailUrl={thumbnailUrl}
                  uploadDate={uploadDate} />
              }
            </div>
            {showSimilarItemsYouMayLike &&
              <RecosDetail3
                styleId={styleId}
                params={params}
                onRecoClicked={this.onRecoClicked}
                similarProductRecos={similarProductRecos}
                heartsData={heartsData} />
            }
            {(brandPromo && brandPromo.hasOwnProperty('type')) ? <BrandPromo data={brandPromo} /> : null}
            {showMelodyShippingAndReturnsBanner && <ShippingAndReturnsBanner />}
          </div>
          {productNotify.modalShown &&
            <ProductNotifyModal
              isOpen={productNotify.modalShown}
              onClose={this.onCloseProductNotifyMe}
              product={detail}
              productId={productId}
              colorId={params.colorId}
              selectedSizing={selectedSizing}/>}

          {productNotify.brandModalShown &&
            <BrandStylesNotifyModal
              isOpen={productNotify.brandModalShown}
              onClose={this.onCloseBrandNotify}
              brandId={detail.brandId}
              brandName={detail.brandName}/>}
          {reportAnError.modalShown &&
            <ReportAnErrorModal
              productId={productId}
              colorId={style && style.colorId}
              isOpen={reportAnError.modalShown}
              hash={hash}
            />
          }
          <JanusPixel location={location} queryParams={janusPixelQueryParams} />
        </SiteMetadata>
      </ProductContextProvider>
    );
  }
}

export function mapStateToProps(state: AppState) {
  const isCustomer = !!(ExecutionEnvironment.canUseDOM && state.cookies['x-main']);

  const {
    cart: { isModalShowing: isCartModalShowing },
    cookies,
    reviews: { reviewGallery },
    sharing: { productNotify, reportAnError, linkShare },
    hearts: heartsStyleIdsList = {},
    ask, brandPage, dontForget, environmentConfig, holmes,
    killswitch: { isShowingThirdPartyAds, forKidsProductCallout, showCheckoutNonStandardShipOptionLabels },
    localStorage = {},
    meta,
    pageLoad: { loaded: pageLoaded },
    pageView,
    product: productState,
    products,
    recos: janusRecos,
    sizeGroups,
    sharedRewards: { transparencyPointsForItem },
    url,
    influencer
  } = state;
  const recos: RecosState = janusRecos;
  const product: ProductDetailState = productState;
  const { symphonyStory } = product;
  const metaDescription = meta.documentMeta?.meta?.name?.description || ''; // to use as the SEO description for video as Broadway used to
  const customerFirstName = holmes && holmes.firstName || '';
  const { imageServer } = environmentConfig;
  const {
    pdp,
    hasRewardsTransparency,
    features: { showMelodyShippingAndReturnsBanner }
  } = marketplace;
  const testAssignments = {} as Record<keyof typeof TEST_PROP_TO_NAME, boolean>;
  Object.keys(TEST_PROP_TO_NAME).map(prop => {
    const propName = prop as keyof typeof TEST_PROP_TO_NAME;
    testAssignments[propName] = isAssigned(TEST_PROP_TO_NAME[propName], 1, state);
  });
  const { brandPromos: rewardsBrandPromos } = transparencyPointsForItem || {};
  const { lastSelectedSizes } = localStorage;
  const obfuscatedCustomerId = cookies['x-main'];
  return {
    brandPage,
    isCustomer,
    obfuscatedCustomerId,
    customerFirstName,
    dontForget,
    isCartModalShowing,
    isShowingThirdPartyAds,
    forKidsProductCallout,
    isNonStandardShipOptionLabels: showCheckoutNonStandardShipOptionLabels,
    ...testAssignments,
    lastSelectedSizes,
    metaDescription,
    numberOfAskQuestions: getNumberOfAskQuestions(ask),
    numberOfReviews: ProductUtils.getNumberOfReviews(product),
    sessionId: cookies['session-id'] || '',
    similarProductRecos: recos,
    pageLoaded,
    pageView,
    pdpConfig: pdp,
    product,
    hasRewardsTransparency,
    products,
    productNotify,
    reportAnError,
    reviewGallery,
    rewardsBrandPromos,
    secureImageBaseUrl: imageServer.url,
    showAsk: showAskConstant,
    showDontForget: showDontForgetConstant,
    showOOSNotifyMe: showOOSNotifyMeFeature,
    showSizeGroups: showSizeGroupsConstant,
    showMelodyShippingAndReturnsBanner,
    showReviews,
    sizeGroups,
    symphonyStory,
    url,
    hearts: heartsStyleIdsList.heartsStyleIds,
    isGiftCard: ProductUtils.isGiftCard(product?.detail?.defaultProductType),
    influencer,
    linkShare
  };
}

export const mapDispatchToProps = {
  addAdToQueue,
  changeQuantity,
  fetchRelatedProducts,
  loadProductDetailPage,
  fetchProductSearchSimilarity,
  fetchProductPageRecos,
  fetchProductReviews,
  fetchProductReviewsWithMedia,
  fetchSizingPrediction,
  fetchBrandPromo,
  getPdpStoriesSymphonyComponents,
  heartProduct,
  hideReviewGalleryModal,
  unHeartProduct,
  pageTypeChange,
  productSizeChanged,
  pushMicrosoftUetEvent,
  toggleProductDescription,
  onProductDescriptionCollapsed,
  submitNotifyBrandEmail,
  showSelectSizeTooltip,
  hideSelectSizeTooltip,
  highlightSelectSizeTooltip,
  unhighlightSelectSizeTooltip,
  validateDimensions,
  sendIntentEvent,
  setCarouselIndex,
  setLastSelectedSize,
  setProductDocMeta,
  stockSelectionCompleted,
  toggleBrandNotifyModal,
  toggleHeartingLoginModal,
  toggleOosButton,
  toggleProductNotifyModal,
  toggleReportAnErrorModal,
  showReviewGalleryModal,
  showCartModal,
  triggerAssignment,
  addItemToCart,
  productSwatchChange,
  getHeartCounts,
  getHearts,
  onLookupRewardsTransparencyPointsForItem,
  onPrimeTwoDayShippingImpression,
  handleGetInfluencerToken,
  handleGetInfluencerStatus
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProductDetail);

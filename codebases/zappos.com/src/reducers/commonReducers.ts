import { routerReducer as routing } from 'react-router-redux';

import account from './account/account';
import ads from './ads';
import autoComplete from './autoComplete';
import payment from './account/payment';
import authentication from './authentication';
import drop from './drop';
import eGiftCards from './eGiftCards';
import facets, { isFacetsVisible } from './search/facets';
import filters from './search/filters';
import products from './search/products';
import searchLayout from './search/searchLayout';
import cookies from './cookies';
import responseCookies from './responseCookies';
import client from './client';
import meta from './meta';
import product from './detail/productDetail';
import sharing from './detail/sharing';
import headerFooter from './headerfooter';
import shipping from './account/shipping';
import order from './account/order';
import orders from './account/orders';
import returns from './account/returns';
import hearts from './hearts';
import ask from './ask/ask';
import hmdSurvey from './ask/hmdSurvey';
import brandPage from './brand/brandPage';
import cart from './cart/cart';
import dontForget from './dontForget';
import influencer from './influencer/influencer';
import instagram from './landing/instagram';
import landingPage from './landing/landingPage';
import microsoftUetTag from './microsoftUetTag';
import newsfeed from './landing/newsfeed';
import iframe from './landing/iframe';
import recos from './recos';
import pixelServer from './pixelServer';
import { error } from './errors';
import pageLoad from './pageLoad';
import pageView from './pageView';
import redirect from './redirect';
import rewards from './account/rewards';
import reviews from './reviews/reviews';
import shipmentTracking from './shipmentTracking';
import sizeGroups from './sizeGroups';
import subscriptionsInfo from './subscriptionsInfo';
import sizingChooser from './detail/sizingChooser';
import appAdvertisement from './appAdvertisement';
import notifications from './notifications';
import holmes from './holmes';
import raffle from './landing/raffle';
import wildCard from './wildCard';
import zfcSessionId from './zfcSessionId';
import localStorage from './localStorage';
import exchange from './account/exchange';
import outfits from './outfits';
import amethyst from './amethyst';

import feedback from 'store/ducks/feedback/reducer';
import shipOption from 'store/ducks/shipOption/reducer';
import history from 'store/ducks/history/reducer';
import checkoutData from 'store/ducks/checkout/reducer';
import sharedPayment from 'store/ducks/payment/reducer';
import sharedRewards from 'store/ducks/rewards/reducer';
import address from 'store/ducks/address/reducer';
import exchangesData from 'store/ducks/exchanges/reducer';
import giftOptions from 'store/ducks/giftoptions/reducer';
import search from 'store/ducks/search/reducer';
import killswitch from 'store/ducks/killswitch/reducer';

// please alphabetize
export default {
  exchangesData,
  account,
  address,
  ads,
  amethyst,
  appAdvertisement,
  ask,
  hmdSurvey,
  authentication,
  autoComplete,
  brandPage,
  cart,
  client,
  cookies,
  dontForget,
  drop,
  eGiftCards,
  environmentConfig: (state = {}) => state,
  error,
  exchange,
  facets,
  feedback,
  giftOptions,
  hearts,
  filters,
  headerFooter,
  history,
  holmes,
  iframe,
  influencer,
  instagram,
  isFacetsVisible,
  killswitch,
  landingPage,
  localStorage,
  checkoutData,
  meta,
  microsoftUetTag,
  newsfeed,
  notifications,
  order,
  orders,
  outfits,
  pageLoad,
  pageView,
  payment,
  pixelServer,
  product,
  products,
  raffle,
  recos,
  redirect,
  responseCookies,
  returns,
  reviews,
  rewards,
  routing,
  search,
  searchLayout,
  sharedPayment,
  sharedRewards,
  sharing,
  shipmentTracking,
  shipOption,
  shipping,
  sizeGroups,
  sizingChooser,
  subscriptionsInfo,
  url: (state = {}) => state,
  wildCard,
  zfcSessionId
};

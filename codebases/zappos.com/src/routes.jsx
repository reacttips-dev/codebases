import React from 'react';
import { IndexRoute, Redirect, Route } from 'react-router';

import App from 'containers/App';
import SiteAwareMetadata from 'components/SiteAwareMetadata';
import StandardSearch from 'containers/StandardSearch';
import { childPathFactory, shouldAccountIgnoreScrollToTop, shouldCheckoutIgnoreScrollToTop, shouldPdpIgnoreScrollToTop, shouldSearchIgnoreScrollToTop } from 'helpers/RouteUtils';
import { logError } from 'middleware/logger';

const MOUNT_PATHS = ['/marty', '/'];

const loadRoute = cb => module => cb(null, module.default);

// TODO: what can we do here? This really should never, ever happen....
const errorLoading = err => logError('Dynamic page loading failed', err);
const lazyHandler = (promise, cb) => promise.then(loadRoute(cb)).catch(errorLoading);

// See https://webpack.js.org/api/module-methods/#magic-comments
// These webpack chunk names must either match the component class name, or the class itself must define `static webpackChunkName`
// for CSS splitting to work without users seeing a FOUC.  These chunksNames are then referenced via the produced webpackStats object.
const LazyAccount = (location, cb) => lazyHandler(import(/* webpackChunkName: "Account" */ 'containers/account/Account'), cb);
const LazyInfluencerHub = (location, cb) => lazyHandler(import(/* webpackChunkName: "InfluencerHub" */ 'containers/influencer/InfluencerHub'), cb);
const LazyAddInfluencerSocialProfile = (location, cb) => lazyHandler(import(/* webpackChunkName: "AddProfileCallBackHandler" */ 'containers/influencer/AddInfluencerSocialProfile'), cb);
const LazyInfluencerLanding = (location, cb) => lazyHandler(import(/* webpackChunkName: "InfluencerLanding" */ 'containers/influencer/InfluencerLanding'), cb);
const LazyInfluencerEnroll = (location, cb) => lazyHandler(import(/* webpackChunkName: "InfluencerProgramEnroll" */ 'containers/influencer/InfluencerProgramEnroll'), cb);
const LazyAddPayment = (location, cb) => lazyHandler(import(/* webpackChunkName: "AddPayment" */ 'containers/account/AddPayment'), cb);
const LazyAddReview = (location, cb) => lazyHandler(import(/* webpackChunkName: "AddReview" */ 'containers/AddReview'), cb);
const LazyAddShipping = (location, cb) => lazyHandler(import(/* webpackChunkName: "AddShipping" */ 'containers/account/AddShipping'), cb);
const LazyAsinStockIdProductDetail = (location, cb) => lazyHandler(import(/* webpackChunkName: "AsinStockIdProductDetail" */ 'containers/AsinStockIdProductDetail'), cb);
const LazyAsinAddReview = (location, cb) => lazyHandler(import(/* webpackChunkName: "AsinAddReview" */ 'containers/AsinAddReview'), cb);
const LazyBrokenPage = (location, cb) => lazyHandler(import(/* webpackChunkName: "BrokenPage" */ 'components/error/BrokenPage'), cb);
const LazyCart = (location, cb) => lazyHandler(import(/* webpackChunkName: "Cart" */ 'containers/Cart'), cb);
const LazyCheckout = (location, cb) => lazyHandler(import(/* webpackChunkName: "Checkout" */ 'containers/checkout/Checkout'), cb);
const LazyCreateLabel = (location, cb) => lazyHandler(import(/* webpackChunkName: "CreateLabel" */ 'containers/CreateLabel'), cb);
const LazyEditPayment = (location, cb) => lazyHandler(import(/* webpackChunkName: "EditPayment" */ 'containers/account/EditPayment'), cb);
const LazyEditShipping = (location, cb) => lazyHandler(import(/* webpackChunkName: "EditShipping" */ 'containers/account/EditShipping'), cb);
const LazyFullOutfitPage = (location, cb) => lazyHandler(import(/* webpackChunkName: "FullOutfitPage" */ 'containers/FullOutfitPage'), cb);
const LazyFederatedLogin = (location, cb) => lazyHandler(import(/* webpackChunkName: "FederatedLoginPage" */ 'containers/account/FederatedLoginPage'), cb);
const LazyHmdSurvey = (location, cb) => lazyHandler(import(/* webpackChunkName: "HmdSurvey" */ 'containers/HmdSurvey'), cb);
const LazySubscriptions = (location, cb) => lazyHandler(import(/* webpackChunkName: "Subscriptions" */ 'containers/Subscriptions'), cb);
const LazyCollections = (location, cb) => lazyHandler(import(/* webpackChunkName: "Collections" */ 'containers/account/Collections'), cb);
const LazyCollection = (location, cb) => lazyHandler(import(/* webpackChunkName: "Collection" */ 'containers/account/Collection'), cb);
const LazyLanding = (location, cb) => lazyHandler(import(/* webpackChunkName: "Landing" */ 'containers/Landing'), cb);
const LazyOrder = (location, cb) => lazyHandler(import(/* webpackChunkName: "Order" */ 'containers/account/Order'), cb);
const LazyCancelOrder = (location, cb) => lazyHandler(import(/* webpackChunkName: "CancelOrder" */ 'containers/account/CancelOrder'), cb);
const LazyOrderHistory = (location, cb) => lazyHandler(import(/* webpackChunkName: "OrderHistory" */ 'containers/account/OrderHistory'), cb);
const LazyOrderConfirmation = (location, cb) => lazyHandler(import(/* webpackChunkName: "OrderConfirmation" */ 'containers/checkout/OrderConfirmation'), cb);
const LazyPayments = (location, cb) => lazyHandler(import(/* webpackChunkName: "Payments" */ 'containers/account/Payments'), cb);
const LazyProductDetail = (location, cb) => lazyHandler(import(/* webpackChunkName: "ProductDetail" */ 'containers/ProductDetail'), cb);
const LazyProductReviews = (location, cb) => lazyHandler(import(/* webpackChunkName: "ProductReviews" */ 'containers/ProductReviews'), cb);
const LazyReturns = (location, cb) => lazyHandler(import(/* webpackChunkName: "Returns" */ 'containers/account/Returns'), cb);
const LazyReturnAll = (location, cb) => lazyHandler(import(/* webpackChunkName: "ReturnAll" */ 'containers/account/ReturnAll'), cb);
const LazyReturnLabel = (location, cb) => lazyHandler(import(/* webpackChunkName: "ReturnLabel" */ 'containers/account/ReturnLabel'), cb);
const LazyVipOptin = (location, cb) => lazyHandler(import(/* webpackChunkName: "VipProgramOptin" */ 'containers/account/VipProgramOptin'), cb);
const LazyVipOptinAck = (location, cb) => lazyHandler(import(/* webpackChunkName: "VipJustEnrolledFromToken" */ 'containers/account/VipJustEnrolledFromToken'), cb);

// Exchange for the future use
const LazyExchange = (location, cb) => lazyHandler(import('containers/account/Exchanges'), cb);

const LazyRouteNotFound = (location, cb) => lazyHandler(import(/* webpackChunkName: "RouteNotFound" */ 'containers/RouteNotFound'), cb);
const LazySearch = (location, cb) => lazyHandler(import(/* webpackChunkName: "StandardSearch" */ 'containers/StandardSearch'), cb);
const LazyShipping = (location, cb) => lazyHandler(import(/* webpackChunkName: "Shipping" */ 'containers/account/Shipping'), cb);
const LazyShipmentTracking = (location, cb) => lazyHandler(import(/* webpackChunkName: "ShipmentTracking" */ 'containers/account/ShipmentTracking'), cb);
const LazySymphonyPreview = (location, cb) => lazyHandler(import(/* webpackChunkName: "SymphonyPreview" */ 'containers/SymphonyPreview'), cb);
const LazyTaxonomyBrand = (location, cb) => lazyHandler(import(/* webpackChunkName: "BrandPage" */ 'containers/TaxonomyBrandPage'), cb);
const LazyWildCard = (location, cb) => lazyHandler(import(/* webpackChunkName: "WildCard" */ 'containers/WildCard'), cb);

const makeAppRoutes = (marketplaceConfig, pathPrefix) => {
  const makePath = childPathFactory(pathPrefix);
  const {
    pdp: { egcUrl },
    account: { vipDashboardUrl },
    features: { hasOutfits },
    returns: { handlesReturnShipping }
  } = marketplaceConfig;
  return (
    <Route path={pathPrefix} component={App} key={`app-${pathPrefix}`}>
      <IndexRoute getComponent={LazyLanding}/>

      <Route
        path={makePath('/(filters/)search*')}
        getComponent={LazySearch}
        suppressScrollOnRouteChange={shouldSearchIgnoreScrollToTop}/>
      <Route
        path={makePath('/filters/**/**.zso')}
        getComponent={LazySearch}
        suppressScrollOnRouteChange={shouldSearchIgnoreScrollToTop}/>
      <Route path={makePath('/filters/**.zso')} getComponent={LazyRouteNotFound} status="404"></Route>
      <Route
        path={makePath('/**/**.zso')}
        getComponent={LazySearch}
        suppressScrollOnRouteChange={shouldSearchIgnoreScrollToTop}/>
      <Route path={makePath('/cart')} getComponent={LazyCart}></Route>

      {/* Checkout */}
      <Route path={makePath('/checkout')} getComponent={LazyCheckout} suppressScrollOnRouteChange={false}></Route>
      <Route path={makePath('/checkout/spc')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/initiate')} getComponent={LazyCheckout} suppressScrollOnRouteChange={false}></Route>
      <Route path={makePath('/checkout/address')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/address/new')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/address/edit')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/payment')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/payment/new')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/shipoption')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/billing')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/billing/new')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/billing/edit')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>
      <Route path={makePath('/checkout/giftoptions')} getComponent={LazyCheckout} suppressScrollOnRouteChange={shouldCheckoutIgnoreScrollToTop}></Route>

      {/* Order Confirmation */}
      <Route path={makePath('/confirmation/:purchaseId')} getComponent={LazyOrderConfirmation}></Route>

      {hasOutfits && <Route path={makePath('/outfit/:outfitId')} getComponent={LazyFullOutfitPage}/>}

      <Route path={makePath('/p/asin/:asin')} getComponent={LazyAsinStockIdProductDetail}/>
      <Route path={makePath('/product/stockId/:stockId')} getComponent={LazyAsinStockIdProductDetail}/>
      <Route path={makePath('/p/:seoName/product/:productId(/color/:colorId)')} getComponent={LazyProductDetail} suppressScrollOnRouteChange={shouldPdpIgnoreScrollToTop}/>
      <Route path={makePath('/p/product/:productId(/color/:colorId)')} getComponent={LazyProductDetail} suppressScrollOnRouteChange={shouldPdpIgnoreScrollToTop}/>
      <Route path={makePath('/product/:productId(/color/:colorId)')} getComponent={LazyProductDetail} suppressScrollOnRouteChange={shouldPdpIgnoreScrollToTop}/>
      <Route path={makePath('/product/review/:productId(/page/:reviewsPage)(/start/:reviewsStart)(/orderBy/:orderBy)(/review/:reviewId)')} getComponent={LazyProductReviews}/>
      <Route path={makePath('/product/review/add/media/:productId(/color/:colorId)')} getComponent={LazyAddReview} mediaOnly={true}/>
      <Route path={makePath('/product/review/(:p/)add/:productId(/color/:colorId)')} getComponent={LazyAddReview}/>
      <Route path={makePath('/createReview/asin/:asin')} getComponent={LazyAsinAddReview}/>
      {/* Influencer */}
      <Route path={makePath('/influencer/hub')} getComponent={LazyInfluencerHub} />
      <Route path={makePath('/influencer/callback')} getComponent={LazyAddInfluencerSocialProfile} />
      <Route path={makePath('/influencer-home')} getComponent={LazyInfluencerLanding} />
      <Route path={makePath('/influencer/enroll/success')} getComponent={LazyInfluencerLanding} />
      <Route path={makePath('/influencer/signup')} getComponent={LazyInfluencerLanding} />
      <Route path={makePath('/influencer/enroll')} getComponent={LazyInfluencerEnroll} />
      <Route path={makePath('/influencer/eligibility')} getComponent={LazyInfluencerLanding} />

      {/* My Account Start */}
      <Route path={makePath('/account')} getComponent={LazyAccount} suppressScrollOnRouteChange={shouldAccountIgnoreScrollToTop}/>
      <Route path={makePath('/account/favorites')} getComponent={LazyCollections}/>
      <Route path={makePath('/account/favorites/:id')} getComponent={LazyCollection}/>
      <Route path={makePath('/orders')} getComponent={LazyOrderHistory} suppressScrollOnRouteChange={shouldAccountIgnoreScrollToTop}/>
      <Redirect from={makePath('/vip/dashboard')} to={makePath(vipDashboardUrl)}/>
      <Redirect from={makePath('/rewards/dashboard')} to={makePath(vipDashboardUrl)}/>
      <Route path={makePath('/login')} getComponent={LazyFederatedLogin}/>
      <Route path={makePath('/federated-login')} getComponent={LazyFederatedLogin}/>
      <Route path={makePath('/rewards/optin/emailId/:emailId')} getComponent={LazyVipOptin}/>
      <Route path={makePath('/rewards/confirmed')} getComponent={LazyVipOptinAck}/>
      <Route path={makePath('/vip/optin/emailId/:emailId')} getComponent={LazyVipOptin}/>
      <Route path={makePath('/vip/confirmed')} getComponent={LazyVipOptinAck}/>
      <Route path={makePath('/vip/alreadyEnrolled')} getComponent={LazyVipOptinAck}/>

      <Route path={makePath('/orders/:orderId')} getComponent={LazyOrder}/>
      <Route path={makePath('/orders/:orderId/cancel')} getComponent={LazyCancelOrder}/>
      <Route path={makePath('/shipments/:orderId/:shipmentId')} getComponent={LazyShipmentTracking}/>
      <Route path={makePath('/payments')} getComponent={LazyPayments}/>
      <Route path={makePath('/payments/new')} getComponent={LazyAddPayment}/>
      <Route path={makePath('/payments/:paymentId/edit')} getComponent={LazyEditPayment}/>
      <Route path={makePath('/addresses')} getComponent={LazyShipping}/>
      <Route path={makePath('/addresses/new')} getComponent={LazyAddShipping}/>
      <Route path={makePath('/addresses/:addressId/edit')} getComponent={LazyEditShipping}/>
      <Route path={makePath('/returns')} getComponent={LazyReturnAll}/>
      <Route path={makePath('/return')} getComponent={LazyReturns}/>
      <Route path={makePath('/returnInitiate')} getComponent={LazyReturns}/>
      <Route path={makePath('/returnLabel')} getComponent={LazyReturnLabel}/>
      {!handlesReturnShipping && <Route path={makePath('/uspsLabelDisplay')} getComponent={LazyReturnLabel}/>}
      <Route path={makePath('/subscriptions(/:tokenTypeOrAction)(/:token)')} getComponent={LazySubscriptions}/>
      <Route path={makePath('/create-label')} getComponent={LazyCreateLabel} />
      <Route path={makePath('/exchange')} getComponent={LazyExchange} />

      <Route path={makePath('/c/survey')} getComponent={LazyHmdSurvey}/>
      <Route path={makePath('/survey')} getComponent={LazyHmdSurvey}/>
      <Route path={makePath('/c/:pageName')} getComponent={LazyLanding}/>
      <Route path={makePath('/brand/:brandId')} getComponent={LazyTaxonomyBrand}/>
      <Route path={makePath('/b/:brandName/brand/:brandId')} getComponent={LazyTaxonomyBrand}/>
      <Redirect from={makePath('/egiftcard')} to={makePath(egcUrl)}/>
      <Redirect from={makePath('/gift-certificate')} to={makePath(egcUrl)}/>
      <Route path={makePath('/product/')} getComponent={LazyRouteNotFound}/>
      <Route path={makePath('/p/')} getComponent={LazyRouteNotFound}/>
      <Route path={makePath('/error/:statusToSend')} getComponent={LazyRouteNotFound} />
      <Route path={makePath('/s/e/c/r/e/t/r/o/u/t/e')} getComponent={LazyBrokenPage} />

      {/* Prevent these requests from hitting the wildcard container. These should be 404ing since they are not valid seo term urls */}
      <Route path={makePath('/*_*')} getComponent={LazyRouteNotFound}/>
      <Route path={makePath('/*.*')} getComponent={LazyRouteNotFound}/>

      <Route
        path={makePath('/:seoName')}
        getComponent={LazyWildCard}
        SearchComponent={StandardSearch}
        suppressScrollOnRouteChange={shouldSearchIgnoreScrollToTop}/>
      {/* If none of our known routes match, show a nice 404 page.
          This must be the last route under the App component or else it'll match valid routes.
      */}
      <Route path="*" getComponent={LazyRouteNotFound} />
    </Route>
  );
};

const makeNoAppRoutes = pathPrefix => {
  const makePath = childPathFactory(pathPrefix);
  return (
    <Route key={`app-${pathPrefix}`}>
      <Redirect path={makePath('/i/:productId(/color/:colorId)/style/:styleId/:index')} to={makePath('/p/product/:productId(/color/:colorId)')} />
      <Route path={makePath('/c/symphonypreview')} getComponent={LazySymphonyPreview}/>
      <Route path={makePath('/contentPreview')} getComponent={LazySymphonyPreview}/>
    </Route>
  );
};

export default function makeRoutes(marketplaceConfig) {
  return (
    <Route>
      <SiteAwareMetadata>
        {MOUNT_PATHS.map(makeNoAppRoutes)}
        {MOUNT_PATHS.map(path => makeAppRoutes(marketplaceConfig, path))}
      </SiteAwareMetadata>
    </Route>
  );
}

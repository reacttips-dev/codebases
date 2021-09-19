import { Component } from 'react';
import { connect } from 'react-redux';
import sanitizer from 'sanitizer';
import ExecutionEnvironment from 'exenv';

import LandingSlot from 'containers/LandingSlot.jsx';
import { evFitSurveyResponseFromUrl, pvHome, pvLanding } from 'events/landing';
import { sendIntentEvent } from 'apis/intent';
import { pageTypeChange } from 'actions/common';
import { createViewHomePageMicrosoftUetEvent, pushMicrosoftUetEvent } from 'actions/microsoftUetTag';
import { firePixelServer } from 'actions/pixelServer';
import { fetchAllRecommenderDataIfNecessary, getIpRestrictedStatus, loadLandingPage, toggleEasyFlowModal } from 'actions/landing/landingPageInfo';
import { EASYFLOW_ENROLLMENT_URL } from 'constants/rewardsInfo';
import { Loader } from 'components/Loader';
import SiteAwareMetadata from 'components/SiteAwareMetadata';
import VipPrimeLink from 'components/landing/VipPrimeLink';
import { stripSpecialCharsDashReplace } from 'helpers';
import marketplace from 'cfg/marketplace.json';
import { titaniteView, track } from 'apis/amethyst';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { setupLandingEventWatcher, shouldLazyLoad } from 'helpers/LandingPageUtils';
import { getHeartingStyleIdsForComponent, getHeartProps } from 'helpers/HeartUtils';
import { MartyContext } from 'utils/context';
import { getHeartCounts, getHearts, heartProduct, toggleHeartingLoginModal, unHeartProduct } from 'actions/hearts';
import { checkIsHomepage } from 'history/historyFactory.js';
import { onEvent } from 'helpers/EventHelpers';

import css from 'styles/containers/landing.scss';
const {
  shortName,
  homepage,
  hasHearting,
  features: { showAccountRewards }
} = marketplace;

const HEARTING_AWARE_COMPONENTS = [
  'genericBrandTrending',
  'productSearch',
  'recommender'
];

export class Landing extends Component {

  static fetchDataOnServer(store, location, { pageName }) {
    return store.dispatch(loadLandingPage(checkIsHomepage(location.pathname) ? homepage : pageName, location));
  }

  constructor(props) {
    super(props);
    this.onComponentClick = this.onComponentClick.bind(this);
    this.trackPageView = this.trackPageView.bind(this);
    this.makePageHeading = this.makePageHeading.bind(this);
    this.getAllHeartCounts = this.getAllHeartCounts.bind(this);
  }

  componentDidMount() {
    const {
      track,
      location = {},
      landingPage: { pageName: currentPage, pageInfo = {} },
      pageTypeChange,
      pushMicrosoftUetEvent,
      fetchAllRecommenderDataIfNecessary,
      params: { pageName: newPage },
      sendIntentEvent,
      setupLandingEventWatcher,
      isHomepage,
      getHearts,
      onEvent
    } = this.props;

    onEvent(window, 'click', this.handleMonetateClick, null, this);

    const { slotData } = pageInfo;

    const { query = {} } = location;
    // Note: When we're on homepage, newPage is undefined
    const isDifferentPage = (!currentPage || (newPage && currentPage !== newPage) || (isHomepage && currentPage !== homepage));

    // Set the correct page type
    const pageType = isHomepage ? 'homepage' : 'landing';
    pageTypeChange(pageType);

    if (isDifferentPage) {
      this.fetchData(isHomepage ? homepage : newPage);
    } else {
      // Track page view right away if we already have the data.
      // Otherwise wait for data first in willReceiveProps
      this.trackPageView(newPage);
    }

    if (isHomepage) {
      pushMicrosoftUetEvent(createViewHomePageMicrosoftUetEvent());
      sendIntentEvent('view', { page_id: 'frontdoor' });
    }

    fetchAllRecommenderDataIfNecessary(slotData);

    // Get hearting list
    getHearts();

    this.getAllHeartCounts();

    if (query.utm_content && query.utm_content.includes('postPurchaseSizing')) {
      track(() => ([
        evFitSurveyResponseFromUrl, { query }
      ]));
    }

    setupLandingEventWatcher(this);

    this.getIpRestrictedInfo();
  }

  componentDidUpdate(prevProps) {
    const { params: nextPropParams, landingPage: nextLandingPage, isHomepage, recommenderEntries: nextRecommenderEntries } = this.props;
    // if going from one landing page to another, update state
    const { params: { pageName: currentPage }, landingPage: { pageInfo }, recommenderEntries } = prevProps;
    const { pageName: newPage } = nextPropParams;

    if (currentPage !== newPage) {
      if (isHomepage) {
        this.fetchData(homepage);
      } else if (nextLandingPage.pageName !== newPage) {
        // only load this LP if it's not already loaded
        this.fetchData(newPage);
      }
    }

    if (recommenderEntries !== nextRecommenderEntries) {
      this.getAllHeartCounts();
    }

    if (nextLandingPage.pageInfo && pageInfo?.canonicalUrl !== nextLandingPage?.pageInfo?.canonicalUrl) {
      this.trackPageView(newPage, this.props);
      this.getIpRestrictedInfo();
    }
  }

  getIpRestrictedInfo = () => {
    const { landingPage: { ipStatus: { callCompleted } = {}, pageInfo: { ipRestrictedContentPresent = false } = {} }, getIpRestrictedStatus } = this.props;
    if (ipRestrictedContentPresent && !callCompleted && ExecutionEnvironment.canUseDOM) {
      getIpRestrictedStatus();
    }
  };

  getAllHeartCounts() {
    const { getHeartCounts, recommenderEntries, landingPage: { pageInfo: { slotData } = {} } } = this.props;
    const allHeartingStyleIds = getHeartingStyleIdsForComponent(slotData, recommenderEntries);
    if (allHeartingStyleIds.length) {
      getHeartCounts(allHeartingStyleIds);
    }
  }

  fetchData(newPage) {
    const { loadLandingPage } = this.props;
    loadLandingPage(newPage, window.location);
  }

  trackPageView(pageName, props = this.props) {
    const {
      firePixelServer,
      trackEvent,
      track,
      isHomepage,
      landingPage: { pageInfo }
    } = props;

    if (isHomepage) {
      trackEvent('TE_PV_HOMEPAGE');
      firePixelServer('home');
    } else {
      trackEvent('TE_PV_LANDINGPAGE');
      firePixelServer('landing', {}, pageName);
    }

    titaniteView();

    const slotData = pageInfo ? pageInfo.slotData : null;
    if (isHomepage && slotData) {
      track(() => ([
        pvHome, { slotData }
      ]));
    } else if (slotData) {
      track(() => ([
        pvLanding, { pageName, slotData }
      ]));
    }
  }

  makePageHeading() {
    const { landingPage: { pageInfo: { pageHeading } }, isHomepage } = this.props;
    if (isHomepage) {
      return (
        <h1
          className={css.screenReadersOnly}
          data-test-id={this.context.testId('heading')}>
          {`${shortName} Homepage`}
        </h1>
      );
    } else if (pageHeading) {
      return (
        <h1
          className={css.heading}
          data-test-id={this.context.testId('heading')}
          dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(pageHeading) }} />
      );
    }
  }

  makeAction = () => {
    const { landingPage, isHomepage } = this.props;
    let action = `Landing-${landingPage.pageInfo.subPageType}-${landingPage.pageName}`;
    // special labels for homepage per analytics instructions
    if (isHomepage) {
      action = `Gateway-${landingPage.pageName}`;
    }
    return action;
  };

  handleMonetateClick = evt => {
    const { trackLegacyEvent } = this.props;
    const { target } = evt;
    const isMonetateComponent = target.closest('[id^="monetate"]');
    if (isMonetateComponent) {
      const link = target.closest('[data-eventlabel]');
      const { eventlabel: label, eventvalue: value } = link.dataset;
      const action = this.makeAction();
      trackLegacyEvent(action, label, value);
    }
  };

  onComponentClick(e) {
    // Send Analytics component click data via trackLegacyEvent(). The format of this data will change in the future
    // but for now we're sending the landing page parameters the way analytics/siteops wants them, mostly
    // the same as how they're currently formatted in legacy
    const { trackLegacyEvent, toggleEasyFlowModal } = this.props;
    const { currentTarget } = e;
    const action = this.makeAction();
    const label = stripSpecialCharsDashReplace(currentTarget.getAttribute('data-eventlabel'));
    const value = stripSpecialCharsDashReplace(currentTarget.getAttribute('data-eventvalue'));

    // if link contains EasyFlow path, display the modal instead
    if (currentTarget.pathname === EASYFLOW_ENROLLMENT_URL) {
      e.preventDefault();
      toggleEasyFlowModal(true);
    }

    e.stopPropagation();

    trackLegacyEvent(action, label, value);
  }

  render() {
    const {
      landingPage: { isLoaded, pageInfo, pageName, slotOrder },
      isCustomer,
      heartProduct,
      hearts,
      products,
      toggleHeartingLoginModal,
      trackEvent,
      unHeartProduct,
      ipStatus,
      slotContentTypesList
    } = this.props;
    if (!isLoaded) {
      return <Loader />;
    }

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
    const heartsData = getHeartProps(heartProps, { heartEventName: 'TE_LANDING_PRODUCT_HEART', unHeartEventName: 'TE_LANDING_PRODUCT_UNHEART' });

    const { slotData, pageLayout } = pageInfo;
    const thisContainer = this;

    return (
      <SiteAwareMetadata loading={!isLoaded}>
        <MartyContext.Consumer>
          { context => {
            this.context = context;

            return (
              <div
                className={css.pageWrap}
                data-test-id={context.testId('landingPage')}
                data-layout={pageLayout} // used for SiteMerch bookmarklets
                data-page-id={pageName}>
                {thisContainer.makePageHeading()}
                {showAccountRewards && <VipPrimeLink isPageModal={true} />}
                {slotOrder.map((slotName, slotIndex) => (
                  <LandingSlot
                    key={slotName}
                    slotName={slotName}
                    slotIndex={slotIndex}
                    data={slotData[slotName]}
                    pageName={pageName}
                    onComponentClick={thisContainer.onComponentClick}
                    slotHeartsData={HEARTING_AWARE_COMPONENTS.includes(slotData[slotName]?.componentName) && heartsData}
                    shouldLazyLoad={shouldLazyLoad(slotIndex)}
                    ipStatus={ipStatus}
                    slotContentTypesList={slotContentTypesList} />
                ))}
              </div>
            );
          }}
        </MartyContext.Consumer>
      </SiteAwareMetadata>
    );
  }
}

Landing.defaultProps = {
  trackEvent,
  trackLegacyEvent,
  track,
  setupLandingEventWatcher,
  onEvent
};

function mapStateToProps(state, ownProps) {
  const isCustomer = !!(ExecutionEnvironment.canUseDOM && state.cookies['x-main']);
  return {
    landingPage: state.landingPage,
    ipStatus: state.landingPage.ipStatus,
    isHomepage: checkIsHomepage(ownProps.location.pathname),
    hearts: state.hearts?.heartsStyleIds,
    recommenderEntries: state.recos,
    isCustomer,
    products: state.products
  };
}

export default connect(mapStateToProps,
  {
    loadLandingPage,
    getIpRestrictedStatus,
    fetchAllRecommenderDataIfNecessary,
    firePixelServer,
    pageTypeChange,
    pushMicrosoftUetEvent,
    sendIntentEvent,
    getHeartCounts,
    getHearts,
    heartProduct,
    unHeartProduct,
    toggleEasyFlowModal,
    toggleHeartingLoginModal
  })(Landing);

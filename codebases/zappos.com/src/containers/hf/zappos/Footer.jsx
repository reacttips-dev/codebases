import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import ExecutionEnvironment from 'exenv';

import { NEWLY_REGISTERED_COOKIE, OPAL_PROFILE_COOKIE } from 'constants/cookies';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { CHECKOUT_URL_RE } from 'common/regex';
import marketplace from 'cfg/marketplace.json';
import {
  getFooterHistoryRecos,
  getProfile,
  handleSignUpModalSubmit,
  handleSubscribeSubmit,
  initSignUpModal,
  setSignUpModal
} from 'actions/headerfooter';
import { getHeartCounts, getHearts, heartProduct, toggleHeartingLoginModal, unHeartProduct } from 'actions/hearts';
import { getHeartProps } from 'helpers/HeartUtils';
import LatencyTracking from 'helpers/LatencyTracking';
import SignUpModal from 'components/hf/SignUpModal';
import FooterNav from 'components/hf/zappos/FooterNav';
import FooterSocial from 'components/hf/zappos/FooterSocial';
import FooterSignUp from 'components/hf/zappos/FooterSignUp';
import FooterRecos from 'components/hf/zappos/FooterRecos';
import FooterSurvey from 'components/hf/zappos/FooterSurvey';
import FooterBottom from 'components/hf/zappos/FooterBottom';
import HeartLoginPrompt from 'components/common/HeartLoginPrompt';
import { trackEvent } from 'helpers/analytics';
import { HYDRA_SUBSCRIPTION_TEST } from 'constants/hydraTests';
import { triggerAssignment } from 'actions/ab';

import css from 'styles/containers/hf/zappos/footer.scss';

const { hasHearting } = marketplace;

export class Footer extends Component {
  static displayName = 'Footer';
  componentDidMount() {
    const { getFooterHistoryRecos, isRemote, latencyTracking, triggerAssignment } = this.props;
    triggerAssignment(HYDRA_SUBSCRIPTION_TEST);
    getFooterHistoryRecos();

    // Setup latencyTracking for init page load
    // Use latencyTracking prop for testing
    this.latencyTracking = latencyTracking || new LatencyTracking();

    this.getOpalProfile();

    this.signUpModalCheck();

    if (isRemote && !this.rootSelector) {
      /*
        "Hydrating" React Portals isn't yet supported so we get a console
        warning when serving the remote HF in dev envs.
        But worry not, nothing is actually wrong.
        https://github.com/facebook/react/issues/13097
        https://github.com/facebook/react/issues/12615
      */
      this.rootSelector = document.getElementById('martyRemoteFooter');
      this.rootSelector.innerHTML = '';
      /*
        sometimes render runs before didMount. this ensures portal connects
        & footer doesn't disappear
      */
      this.forceUpdate();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      routing: { pathname },
      getFooterHistoryRecos,
      getHearts,
      getHeartCounts
    } = this.props;
    const hasLocationChanged = pathname !== prevProps.routing.pathname;

    // Call for new footer recos when switching pages
    if (hasLocationChanged && this.shouldShowFooterRecos()) {
      getFooterHistoryRecos();
    }

    if (hasLocationChanged) {
      this.latencyTracking.triggerSoftNavigation();// Fire latency tracking for client routing
      this.getOpalProfile();
    }

    this.signUpModalCheck();

    // Get hearting list
    const nextRecs = this.props.footerRecos?.recs;
    const prevRecs = prevProps.footerRecos?.recs;
    if (prevRecs !== nextRecs) {
      getHearts();
      getHeartCounts(nextRecs);
    }
  }

  signUpModalCheck = () => {
    const { routing: { pathname }, isNewlyRegistered, initSignUpModal } = this.props;
    if (isNewlyRegistered && !pathname.match(CHECKOUT_URL_RE)) {
      initSignUpModal();
    }
  };

  getOpalProfile = () => {
    const { hasProfileCookie, hasXMain, getProfile } = this.props;
    if (!hasProfileCookie && hasXMain) {
      getProfile();
    }
  };

  shouldShowFooterRecos = () => {
    const { content, routing: { pathname } } = this.props;
    // Don't show on some urls including checkout
    const footerRecoRegEx = /^(?:\/marty)?\/(returnLabel|m?checkout|(create-label)|about\/support)($|\/)(?!(thankyou))/;

    // Symphony killswitch
    const isOn = content?.Footer?.slotData?.['ad']?.componentName === 'recommenderHistoryFooter';
    return ExecutionEnvironment.canUseDOM && !footerRecoRegEx.test(pathname) && isOn;
  };

  makeFooterNav = () => {
    const { content, isMobile, socialLinks, survey } = this.props;
    const {
      'footermenu-1': data1,
      'footermenu-2': data2,
      'footermenu-3': data3,
      'footermenu-4': data4,
      'footermenu-5': data5,
      'footermenu-6': data6
    } = content?.Footer?.slotData || {};

    return (
      <div className={css.nav}>
        {(data1 || data2) &&
          <div>
            {data1 && <FooterNav data={data1}/>}
            {data2 && <FooterNav data={data2}/>}
          </div>
        }
        {(data3 || data4) &&
          <div>
            {data3 && <FooterNav data={data3}/>}
            {data4 && <FooterNav data={data4}/>}
          </div>
        }
        <div>
          {data5 && <FooterNav data={data5}/>}
          {data6 && <FooterNav data={data6}/>}
        </div>
        <div>
          <FooterSurvey isMobile={isMobile} survey={survey}/>
          <FooterSocial socialLinks={socialLinks}/>
        </div>
      </div>
    );
  };

  render() {
    const { makeFooterNav } = this;
    const { testId } = this.context;
    const {
      handleSubscribeSubmit,
      footerRecos,
      content,
      isVip,
      setSignUpModal,
      heartLoginPrompt = { isOpen: false },
      isSignUpModalOpen,
      handleSignUpModalSubmit,
      isFooterSubscribeSubmitted,
      isRemote,
      forceRender,
      isCustomer,
      heartProduct,
      hearts,
      products,
      toggleHeartingLoginModal = () => {},
      trackEvent,
      unHeartProduct,
      routing,
      copyright,
      bottomLinks,
      signUp
    } = this.props;
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

    const heartsData = ExecutionEnvironment.canUseDOM && getHeartProps(heartProps, { heartEventName: 'TE_FOOTER_HEART', unHeartEventName: 'TE_FOOTER_UNHEART' });
    const footer = (
      <>
        <SignUpModal
          isVip={isVip}
          data={content?.Footer?.slotData?.['sign-up-modal']}
          isSignUpModalOpen={isSignUpModalOpen}
          setSignUpModal={setSignUpModal}
          handleSignUpModalSubmit={handleSignUpModalSubmit} />
        {this.shouldShowFooterRecos() && footerRecos && <FooterRecos recos={footerRecos} heartsData={heartsData} />}
        {hasHearting && <HeartLoginPrompt
          isOpen={heartLoginPrompt.isOpen}
          id={heartLoginPrompt.id}
          toggleModal={toggleHeartingLoginModal}
          routing={routing}/>}
        <FooterSignUp
          handleSubscribeSubmit={handleSubscribeSubmit}
          isFooterSubscribeSubmitted={isFooterSubscribeSubmitted}
          signUp={signUp}/>
        <div className={css.bgContainer}>
          <footer className={css.footer} role="contentinfo" data-test-id={testId('footerElement')}>
            <h2 className={css.screenReadersOnly} data-test-id={testId('footerHeading')}>Zappos Footer</h2>
            {makeFooterNav()}
            <hr/>
            <FooterBottom isVip={isVip} copyright={copyright} bottomLinks={bottomLinks}/>
          </footer>
        </div>
      </>
    );

    if (isRemote && ExecutionEnvironment.canUseDOM && this.rootSelector) {
      return createPortal(footer, this.rootSelector);
    } else if (!isRemote || forceRender) {
      return footer;
    }
    return null;
  }
}

function mapStateToProps(state) {
  const isCustomer = !!(ExecutionEnvironment.canUseDOM && state.cookies['x-main']);
  const { hearts: heartsStyleIdsList = {}, rewards = {} } = state;
  return {
    isCustomer,
    content: state.headerFooter.content,
    isMobile: state.headerFooter.isMobile,
    footerRecos: state.headerFooter.footerRecos,
    isFooterSubscribeSubmitted: state.headerFooter.isFooterSubscribeSubmitted,
    isSignUpModalOpen: state.headerFooter.isSignUpModalOpen,
    routing: state.routing.locationBeforeTransitions,
    isNewlyRegistered: !!state.cookies[NEWLY_REGISTERED_COOKIE],
    hasProfileCookie: !!state.cookies[OPAL_PROFILE_COOKIE],
    hasXMain: !!state.cookies['x-main'],
    isRemote: state.headerFooter.isRemote,
    products: state.products,
    heartLoginPrompt: state.hearts.heartLoginPrompt,
    hearts: heartsStyleIdsList.heartsStyleIds,
    isVip: rewards?.rewardsInfo?.isVipOrConsented,
    survey: state.headerFooter.content.Footer.slotData['customer-feedback-survey'],
    socialLinks: state.headerFooter.content.Footer.slotData['social-links'],
    copyright: state.headerFooter.content.Footer.slotData['copyright'],
    bottomLinks: state.headerFooter.content.Footer.slotData['legal-links'],
    signUp: state.headerFooter.content.Footer.slotData['sign-up-form']
  };
}

Footer.defaultProps = {
  trackEvent
};

Footer.contextTypes = {
  testId: PropTypes.func
};

const FooterConnected = connect(mapStateToProps, {
  handleSubscribeSubmit,
  getFooterHistoryRecos,
  initSignUpModal,
  setSignUpModal,
  handleSignUpModalSubmit,
  getProfile,
  getHearts,
  getHeartCounts,
  heartProduct,
  unHeartProduct,
  toggleHeartingLoginModal,
  triggerAssignment
})(Footer);

const FooterConnectedWithErrorBoundary = withErrorBoundary('Footer', FooterConnected);
export default FooterConnectedWithErrorBoundary;

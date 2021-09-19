import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import { setFederatedLoginModalVisibility, setHeaderFooterVisibility } from 'actions/headerfooter';
import { SEARCH_BEST_FOR_YOU_COOKIE } from 'constants/cookies';
import { HYDRA_NAMAGOO } from 'constants/hydraTests';
import { CHECKOUT_URL_RE, CONFIRMATION_URL_RE } from 'common/regex';
import { isAssigned, triggerAssignment } from 'actions/ab';
import { setError } from 'actions/errors';
import Header from 'hf/Header';
import Footer from 'hf/Footer';
import CartModal from 'components/cart/CartModal';
import { componentDidCatchFullPageError } from 'common/componentHooks';
import ErrorPage from 'components/error/ErrorPage';
import MicrosoftUetTag from 'containers/MicrosoftUetTag';
import NotificationsOverlay from 'components/NotificationsOverlay';
import PixelServer from 'containers/pixelserver/PixelServer';
import { ensureClass, ensureNoClass } from 'helpers';
import { closeBranchAppAdBanner } from 'helpers/AppAdvertisement';
import { toggleNotificationsOverlay } from 'actions/notifications';
import { updateBestForYou } from 'actions/search';
import { redirectTo } from 'actions/redirect';
import { setLastPageWasOrderconfirmation } from 'store/ducks/history/actions';
import LoginAssistant from 'components/LoginAssistant';
import Profile from 'components/common/Profile';
import { injectScriptToHead } from 'helpers/HtmlHelpers';

const FederatedLoginModal = loadable(() => import('components/account/FederatedLoginModal'));
FederatedLoginModal.displayName = 'FederatedLoginModal';

// order matters
import 'styles/global.scss';
import styles from 'styles/App.scss';

export class App extends Component {

  static beforeFetchDataOnServer({ dispatch }) {
    dispatch(triggerAssignment(HYDRA_NAMAGOO));
  }

  static fetchDataOnServer(store) {
    // WARNING: We have seen strange behavior with a/b tests that have triggerAssignments in App.jsx server methods.
    // Consider using the corresponding container file for the page's hydraTest and test thoroughly.
    const { cookies, routing: { locationBeforeTransitions: location } } = store.getState();
    store.dispatch(updateBestForYou(!cookies[SEARCH_BEST_FOR_YOU_COOKIE] || cookies[SEARCH_BEST_FOR_YOU_COOKIE] !== 'active'));
    if (location.query?.disableHf === 'true') {
      store.dispatch(setHeaderFooterVisibility(false));
    }
  }

  static defaultProps = {
    closeBranchAppAdBanner
  };

  componentDidMount() {
    if (this.props.hydraNamagoo) {
      injectScriptToHead({
        src: '//dfapvmql-q.global.ssl.fastly.net/ZA6R02Q8T.js'
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname: prevPathname, query: prevQuery }, wasLastPageOrderConfirmation, setLastPageWasOrderconfirmation, error: prevError } = prevProps;
    const { isFacetsVisible, error, location: { query }, setHeaderFooterVisibility, closeBranchAppAdBanner } = this.props;
    const resetLastPageOrderConfirmation = wasLastPageOrderConfirmation && !(CONFIRMATION_URL_RE.test(prevPathname) || CHECKOUT_URL_RE.test(prevPathname));

    if (resetLastPageOrderConfirmation) {
      setLastPageWasOrderconfirmation(false);
    }

    if (prevQuery?.disableHf !== query?.disableHf && query?.disableHf === 'true') {
      setHeaderFooterVisibility(false);
      closeBranchAppAdBanner();
    }

    // When client routing related to search facets, maintain facet state (ie. keep facets open if needed).
    // Also ensures facet state is maintained while swapping between Wildcard/Search containers.
    if (isFacetsVisible) {
      ensureClass(document.body, styles.activeSidebar);
      ensureNoClass(document.body, 'activeMain');
    } else {
      ensureClass(document.body, 'activeMain');
      ensureNoClass(document.body, styles.activeSidebar);
    }

    // Scroll to top on client-side error
    if (!prevError && error) {
      window.scrollTo(0, 0);
    }
  }

  componentDidCatch(error, info) {
    componentDidCatchFullPageError(this.props.setError, error, info);
  }

  makeChildren() {
    const { error, children } = this.props;
    if (error) {
      return <ErrorPage error={error} />;
    }
    return children;
  }

  dismissOverlay = () => {
    this.props.toggleNotificationsOverlay();
  };

  handleCloseFederatedLogin = () => {
    const { federatedLoginModal: { redirectOnClose }, setFederatedLoginModalVisibility, redirectTo } = this.props;
    setFederatedLoginModalVisibility(false);
    !!redirectOnClose && redirectTo(redirectOnClose);
  };

  render() {
    const {
      content,
      federatedLoginModal,
      isModalShowing,
      isHfVisible,
      notifications: { showOverlay },
      location,
      showCheckoutNonStandardShipOptionLabels
    } = this.props;

    const { isFederatedLoginModalShowing, returnTo } = federatedLoginModal;
    const { Global: { slotData: { federatedLoginModalCopy } = {} } = {} } = content;
    return (
      <div>
        { isModalShowing && <CartModal location={location}/> }
        {isHfVisible && (
          <Profile id="Header">
            <Header />
          </Profile>
        )}
        <div key="main" className={styles.pageLayout}>
          <Profile id="Main">
            <main id="main" className={styles.mainContent}>
              <div>
                {this.makeChildren()}
              </div>
            </main>
          </Profile>
        </div>
        <MicrosoftUetTag />
        <PixelServer />
        {<NotificationsOverlay showOverlay={showOverlay} dismissOverlay={this.dismissOverlay} />}
        {isHfVisible &&
          <>
            <LoginAssistant />
            <Profile id="Footer">
              <Footer />
            </Profile>
          </>
        }
        {isFederatedLoginModalShowing &&
          <FederatedLoginModal
            copy={federatedLoginModalCopy}
            handleClose={this.handleCloseFederatedLogin}
            showCheckoutNonStandardShipOptionLabels={showCheckoutNonStandardShipOptionLabels}
            isOpen={isFederatedLoginModalShowing}
            returnTo={returnTo}
          />
        }
      </div>
    );
  }
}

App.contextTypes = {
  router: PropTypes.object.isRequired
};

App.propTypes = {
  // Injected by React Redux
  error: PropTypes.object,
  // Injected by React Router
  children: PropTypes.node
};

function mapStateToProps(state) {
  const {
    error,
    isFacetsVisible,
    killswitch: { showCheckoutNonStandardShipOptionLabels },
    headerFooter: { content, federatedLoginModal, isHfVisible },
    products,
    notifications,
    cart: { isModalShowing },
    routing: { locationBeforeTransitions: location },
    history: { wasLastPageOrderConfirmation },
    rewards
  } = state;

  return {
    content,
    error,
    federatedLoginModal,
    isFacetsVisible,
    isHfVisible,
    hydraNamagoo: isAssigned(HYDRA_NAMAGOO, 1, state),
    products,
    notifications,
    isModalShowing,
    location,
    rewards,
    showCheckoutNonStandardShipOptionLabels,
    wasLastPageOrderConfirmation
  };
}

export default connect(mapStateToProps, {
  redirectTo,
  setError,
  setHeaderFooterVisibility,
  setFederatedLoginModalVisibility,
  setLastPageWasOrderconfirmation,
  toggleNotificationsOverlay,
  triggerAssignment
})(App);

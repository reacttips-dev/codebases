import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { applyRouterMiddleware, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';

import { AlertRoot, LogRoot, StatusRoot } from 'components/common/AriaLive';
import { setupHolmes } from 'actions/holmes';
import { routeUpdateComplete } from 'actions/pageView';
import marketplace from 'cfg/marketplace.json';
import shouldScrollToTopFactory from 'helpers/shouldScrollToTop';
import { MartyContext } from 'utils/context';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { trackError } from 'helpers/ErrorUtils';
import { onEvent } from 'helpers/EventHelpers';
import { track as amethystTrack, titaniteView } from 'apis/amethyst';

const identityTestGenerator = id => id;
const nullTestGenerator = () => null;
const scrollToTopDecider = shouldScrollToTopFactory(marketplace.features.pageTransitionScrollTarget);

export class Root extends Component {
  getChildContext() { // Legacy context has been deprecated and will be removed in a future marty release
    return {
      testId: this.getTestId(),
      marketplace
    };
  }

  componentDidMount() {
    this.props.setupHolmes();
    // detect if user touched device ( needs to be a named function so it can be unbound within itself )
    const detectTouch = () => {
      this.contextValue.touchDetected = true;
      window.removeEventListener('touchstart', detectTouch);
    };

    onEvent(window, 'touchstart', detectTouch);

    if (window.location.hash) {
      this.contextValue.loadedWithHash = true;
    }
  }

  onUpdate = () => {
    this.props.store.dispatch(routeUpdateComplete());
  };

  getTestId = () => {
    const { renderTestLocators } = this.props;
    return renderTestLocators ? identityTestGenerator : nullTestGenerator;
  };

  contextValue = {
    testId: this.getTestId(),
    loadedWithHash: false,
    touchDetected : false,
    preventOnTouchDevice : i => (!this.contextValue.touchDetected ? i : undefined),
    marketplace,
    router: this.props.history,
    environmentConfig: this.props.environmentConfig,
    trackError,
    trackEvent,
    trackLegacyEvent,
    amethystTrack,
    titaniteView
  };

  render() {
    const { store, history, routes, canUseScroll, renderProps, onEnter } = this.props;
    const routerProps = { history };
    if (canUseScroll) {
      routerProps.render = applyRouterMiddleware(useScroll(scrollToTopDecider));
    }

    return (
      <MartyContext.Provider value={this.contextValue}>
        <Provider key={Math.random()} store={store}>
          <Router
            {...renderProps}
            {...routerProps}
            onUpdate={this.onUpdate}
            onEnter={onEnter}>
            {routes}
          </Router>
        </Provider>
        <AlertRoot />
        <StatusRoot />
        <LogRoot />
      </MartyContext.Provider>
    );
  }
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  store: PropTypes.object.isRequired
};

Root.defaultProps = {
  onEnter: () => null
};

Root.childContextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object
};

function mapStateToProps(state) {
  const renderTestLocators = 'renderTestLocators' in state.cookies;
  return {
    renderTestLocators
  };
}

export default connect(mapStateToProps, {
  setupHolmes
})(Root);

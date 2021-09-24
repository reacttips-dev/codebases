import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Router, Route, browserHistory, Redirect} from 'react-router';
import GlobalState from './stores/global';
import NavStore from './stores/navStore';
import * as C from './constants';
import {observer} from 'mobx-react';

import Onboarding from './onboarding.jsx';
import OnboardingStackScan from './onboarding_stack_scan.jsx';
import OnboardingStackType from './onboarding_stack_type.jsx';
import OnboardingStackInfo from './onboarding_stack_info.jsx';
import OnboardingNewCompany from './onboarding_new_company.jsx';
import OnboardingToolSelection from './onboarding_tool_selection.jsx';
import OnboardingToolDetails from './onboarding_tool_details.jsx';

let globalStore,
  navStore = new NavStore();

export default
@observer
class OnboardingRouter extends Component {
  constructor(props) {
    super(props);

    if (!this.props.userId && this.props.path !== `${C.ONBOARDING_BASE_PATH}/scan`)
      browserHistory.push(`${C.ONBOARDING_BASE_PATH}/scan`);

    globalStore = new GlobalState({routerProps: this.props});

    this.bindEvents();
  }

  bindEvents() {
    try {
      browserHistory.listen(route => {
        trackPage('onboarding', {url: route.pathname});
      });
    } catch (err) {
      // bury
    }
  }

  getChildContext() {
    return {
      routerProps: this.props,
      globalStore: globalStore,
      navStore: navStore
    };
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Redirect from="/create-stack" to="/create-stack/scan" />
        <Route path="/create-stack" component={Onboarding}>
          <Route path="scan" component={OnboardingStackScan} />
          <Route path="stack-type" component={OnboardingStackType} />
          <Route path="stack-info" component={OnboardingStackInfo} />
          <Route path="new-company" component={OnboardingNewCompany} />
          <Route path="tool-selection" component={OnboardingToolSelection} />
          <Route path="tool-details" component={OnboardingToolDetails} />
        </Route>
      </Router>
    );
  }
}

OnboardingRouter.childContextTypes = {
  routerProps: PropTypes.object,
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};

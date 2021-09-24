import React, {Component} from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {observer} from 'mobx-react';

import store from './store/onboarding-wizard_store.js';
import OnboardingWizard from './onboarding-wizard.jsx';
import Welcome from './steps/welcome.jsx';
import ToolsVoting from './steps/tools-voting.jsx';
import BasicInformation from './steps/basic-information.jsx';
import BuildYourStack from './steps/build-your-stack.jsx';
import AreasOfInterest from './steps/areas-of-interest.jsx';
import NextSteps from './steps/next-steps.jsx';

@observer
class OnboardingWizardContainer extends Component {
  constructor(props) {
    super(props);
    store.instance = props;
  }

  // todo's for long onboarding flow:
  // remove classname "onboarding-wizard-container--flow-short"
  render() {
    return (
      <div
        id="onboarding-wizard-container"
        className={`onboarding-wizard-container onboarding-wizard-container--flow-short ${store
          .instance.hasNotification && 'onboarding-wizard-container--has-notification'}`}
      >
        <Router history={browserHistory}>
          <Route path="/onboarding/welcome" component={Welcome} />
          <Route path="/onboarding" component={OnboardingWizard}>
            <Route path="tools-voting" component={ToolsVoting} />
            <Route path="basic-information" component={BasicInformation} />
            <Route path="build-your-stack" component={BuildYourStack} />
            <Route path="areas-of-interest" component={AreasOfInterest} />
            <Route path="next-steps" component={NextSteps} />
          </Route>
        </Router>
      </div>
    );
  }
}

export default OnboardingWizardContainer;

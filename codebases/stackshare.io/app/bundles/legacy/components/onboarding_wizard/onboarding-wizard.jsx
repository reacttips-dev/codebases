import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';

import store from './store/onboarding-wizard_store.js';
import NotifyBanner from '../shared/bars/notify_banner.jsx';
import StepPicker from './components/step-picker.jsx';
import Sidebar from './components/sidebar.jsx';

@observer
class OnboardingWizard extends Component {
  static propTypes = {
    children: PropTypes.element
  };

  constructor(props) {
    super(props);
  }

  _renderMobileStepPicker = () => {
    return (
      <div className="visible-xs">
        <StepPicker />
      </div>
    );
  };

  _renderDesktopStepPicker = () => {
    return (
      <div className="hidden-xs">
        <StepPicker />
      </div>
    );
  };

  _renderMobileSidebar = () => {
    return <p>Sidebar here!</p>;
  };

  render() {
    const notifications = store.instance.notifications;

    return (
      <div>
        {store.instance.hasNotification && (
          <NotifyBanner
            type={notifications.get('type')}
            message={notifications.get('message')}
            icon={notifications.get('icon')}
            dismiss={store.instance.clearNotifications.bind(store.instance)}
          />
        )}
        <div className="onboarding-wizard-layout-container">
          <div className="onboarding-wizard-layout-container__content">
            {this._renderMobileStepPicker()}
            {this.props.children}
          </div>
          <div className="onboarding-wizard-layout-container__sidebar visible-lg">
            {this._renderDesktopStepPicker()}
            <div className="onboarding-wizard__step-separator hidden-xs" />
            <Sidebar
              iconPath={store.instance.currentStep.iconPath}
              sidebarTitle={store.instance.currentStep.sidebarTitle}
              sidebarText={store.instance.currentStep.sidebarText}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default OnboardingWizard;

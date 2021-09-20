import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SettingsSync from '../../components/settings/SettingsSync';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { getStore } from '../../stores/get-store';
import AnalyticsService from '../../modules/services/AnalyticsService';
import AuthHandlerService from '../../modules/services/AuthHandlerService';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import { ENABLE_SYNC_DOCS_URL } from '../../constants/AppUrlConstants';

@observer
export default class SettingsSyncContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isDisableSuccessful: false,
      isDisablingSync: false
    };

    this.handleDisableSync = this.handleDisableSync.bind(this);
    this.handleEnableSync = this.handleEnableSync.bind(this);
    this.handleForceSync = this.handleForceSync.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  handleForceSync () {
    let isInSync = getStore('SyncStatusStore').isInSync;
    if (!isInSync) {
      return;
    }

    pm.syncManager.forceSync();
    AnalyticsService.addEvent('sync', 'force');
  }

  handleSignIn () {
    pm.mediator.trigger('closeSettingsModal');
    AuthHandlerService.initiateLogin();
  }

  handleEnableSync () {
    openExternalLink(ENABLE_SYNC_DOCS_URL);
  }

  handleDisableSync () {
    dispatchUserAction({ name: 'disableSync', namespace: 'user' })
      .then(() => {
        AnalyticsService.addEvent('sync', 'disable');
        this.setState({
          isDisablingSync: false,
          isSyncEnabled: false,
          isDisableSuccessful: true
        });
      })
      .catch((e) => {
        this.setState({ isDisablingSync: false });
        pm.toasts.error('Disabling the Sync action failed');
      });
  }

  render () {
    let currentUser = getStore('CurrentUserStore'),
        gateKeeperStore = getStore('GateKeeperStore'),
        isInSync = getStore('SyncStatusStore').isInSync;

    return (
      <SettingsSync
        isSyncEnabled={gateKeeperStore.isSyncEnabled}
        isLoggedIn={currentUser.isLoggedIn}
        isInSync={isInSync}
        {...this.state}
        onDisableSync={this.handleDisableSync}
        onEnableSync={this.handleEnableSync}
        onForceSync={this.handleForceSync}
        onSignin={this.handleSignIn}
      />
    );
  }
}

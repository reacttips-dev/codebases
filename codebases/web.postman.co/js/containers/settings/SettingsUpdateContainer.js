import React, { Component } from 'react';
import SettingsUpdate from '../../components/settings/SettingsUpdate';
import SettingsUpdateSnap from '../../components/settings/SettingsUpdateSnap';
import AppSettingsDefaults from '../../constants/AppSettingsDefaults';
import AnalyticsService from '../../modules/services/AnalyticsService';

export default class SettingsUpdateContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      updateStatus: null,
      currentVersion: pm.app.get('version'),
      updateData: null,
      autoDownloadUpdateStatus: AppSettingsDefaults.autoDownload.MINOR,
      releaseNotes: null
    };

    this.handleCheckForUpdate = this.handleCheckForUpdate.bind(this);
    this.handleDownloadUpdate = this.handleDownloadUpdate.bind(this);
    this.handleAutoDownloadChange = this.handleAutoDownloadChange.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.model = pm.updateNotifier;
    this.setAutoDownloadSettings();
    this.attachModelListeners();
    this.handleModelChange();
  }

  componentWillUnmount () {
    this.detachModelListeners();
    this.model = null;
  }

  attachModelListeners () {
    this.model.on('change', this.handleModelChange);
  }

  detachModelListeners () {
    this.model.off('change', this.handleModelChange);
  }

  setAutoDownloadSettings () {
    this.setState({ autoDownloadUpdateStatus: pm.settings.getSetting('autoDownloadUpdateStatus') });
  }

  handleAutoDownloadChange (value) {
    if (_.includes(_.values(AppSettingsDefaults.autoDownload), value)) {
      this.setState({ autoDownloadUpdateStatus: value }, () => {
        pm.settings.setSetting('autoDownloadUpdateStatus', value);
      });
      AnalyticsService.addEvent('app', 'select_update_preference', value === AppSettingsDefaults.autoDownload.MINOR ? 'minor' : 'all');
    }
  }

  handleModelChange () {
    this.setState({
      updateStatus: this.model.get('status'),
      updateData: this.model.get('data'),
      releaseNotes: this.model.get('releaseNotes')
    });
  }

  handleCheckForUpdate (event, retry) {
    this.model.checkForUpdates(true);
    !retry && AnalyticsService.addEvent('app', 'check_update', 'settings_modal');
    retry && AnalyticsService.addEvent('app', 'retry_update_download', 'settings_modal');
  }

  handleDownloadUpdate () {
    this.model.downloadUpdate();
    AnalyticsService.addEvent('app', 'initiate_update_download', 'settings_modal');
  }

  handleRestart () {
    this.model.applyUpdate();
    AnalyticsService.addEvent('app', 'app_restart', 'settings_modal');
  }

  render () {
    return pm.env.SNAP ?
      <SettingsUpdateSnap currentVersion={this.state.currentVersion} /> :
      <SettingsUpdate
        autoDownloadUpdateStatus={this.state.autoDownloadUpdateStatus}
        updateStatus={this.state.updateStatus}
        currentVersion={this.state.currentVersion}
        updateVersion={this.state.updateData ? this.state.updateData.version : null}
        updateNotes={this.state.updateData ? this.state.updateData.notes : null}
        releaseNotes={this.state.releaseNotes}
        onAutoDownloadEnabledChanged={this.handleAutoDownloadChange}
        onCheckForUpdate={this.handleCheckForUpdate}
        onDownloadUpdate={this.handleDownloadUpdate}
        onApplyUpdate={this.handleRestart}
      />;
  }
}

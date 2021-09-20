import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import UpdateCheckingModal from '../../components/update/UpdateCheckingModal';
import UpdateAvailableModal from '../../components/update/UpdateAvailableModal';
import UpdateNotAvailableModal from '../../components/update/UpdateNotAvailableModal';
import UpdateDownloadingModal from '../../components/update/UpdateDownloadingModal';
import UpdateApplyModal from '../../components/update/UpdateApplyModal';
import UpdateErrorModal from '../../components/update/UpdateErrorModal';
import util from '../../utils/util';
import { NATIVE_APPS_URL } from '../../constants/AppUrlConstants';
import AnalyticsService from '../../modules/services/AnalyticsService';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
const ALLOWED_ORIGINS = ['settings_indicator', 'auto', 'manual', 'broadcast'];

@pureRender
export default class UpdateModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      updateStatus: null,
      currentVersion: pm.app.get('version'),
      updateData: null,
      releaseNotes: null,
      origin: null
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDownloadClose = this.handleDownloadClose.bind(this);
    this.handleCheckForUpdate = this.handleCheckForUpdate.bind(this);
    this.handleDownloadUpdate = this.handleDownloadUpdate.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleReleaseNotesChange = this.handleReleaseNotesChange.bind(this);
    this.handleManualDownload = this.handleManualDownload.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.model = pm.updateNotifier;
    this.attachModelListeners();
    this.handleStatusChange();
    this.handleReleaseNotesChange();
  }

  componentWillUnmount () {
    this.detachModelListeners();
    this.model = null;
  }

  attachModelListeners () {
    pm.mediator.on('showUpdateModal', this.handleOpen);
    pm.mediator.on('hideUpdateModal', this.handleClose);
    this.model.on('change:status', this.handleStatusChange);
    this.model.on('change:releaseNotes', this.handleReleaseNotesChange);
  }

  detachModelListeners () {
    pm.mediator.off('showUpdateModal', this.handleOpen);
    pm.mediator.off('hideUpdateModal', this.handleClose);
    this.model.off('change:status', this.handleStatusChange);
    this.model.off('change:releaseNotes', this.handleReleaseNotesChange);
  }

  handleStatusChange () {
    this.setState({
      updateStatus: this.model.get('status'),
      updateData: this.model.get('data')
    });

    if (this.model.get('status') === 'error' && this.state.isOpen) {
      let label = this.model.get('isAutoDownloaded') ? 'auto_update' : 'manual_update';
      AnalyticsService.addEvent('app', 'open_error_modal', label);
    }
  }

  handleReleaseNotesChange () {
    this.setState({ releaseNotes: this.model.get('releaseNotes') });
  }

  handleOpen (options = {}) {
    let origin = _.includes(ALLOWED_ORIGINS, options.origin) ? options.origin : null;

    this.setState({
      origin,
      isOpen: true
    });

    let status = this.model.get('status');

    if (status === 'error') {
      let label = this.model.get('isAutoDownloaded') ? 'auto_update' : 'manual_update';
      AnalyticsService.addEvent('app', 'open_error_modal', label);
    }
  }

  handleClose () {
    let origin = this.state.origin;

    if (origin && _.includes(ALLOWED_ORIGINS, origin)) {
      AnalyticsService.addEvent('app', 'dismiss_update_available_modal', origin);
      origin = null;
    }
    this.setState({
      origin,
      isOpen: false
    });
  }

  handleCheckForUpdate () {
    this.model.checkForUpdates(true);
    AnalyticsService.addEvent('app', 'retry_update_download', 'update_modal');
  }

  handleManualDownload () {
    openExternalLink(NATIVE_APPS_URL);
    AnalyticsService.addEvent('app', 'manual_update_download');
    this.handleClose();
  }

  handleDownloadUpdate () {
    this.model.downloadUpdate();
    AnalyticsService.addEvent('app', 'initiate_update_download', 'update_modal');
  }

  handleRestart () {
    this.model.applyUpdate();
    AnalyticsService.addEvent('app', 'app_restart', 'update_modal');
  }

  handleDownloadClose () {
    pm.toasts.info('Download will continue in the background');
    this.handleClose();
  }

  render () {


    switch (this.state.updateStatus) {
      case 'checking': {
        return (
          <UpdateCheckingModal
            isOpen={this.state.isOpen}
            onRequestClose={this.handleClose}
          />
        );
      }
      case 'updateAvailable': {
        return (
          <UpdateAvailableModal
            releaseNotes={this.state.releaseNotes ? this.state.releaseNotes : null}
            isOpen={this.state.isOpen}
            updateNotes={this.state.updateData ? this.state.updateData.notes : null}
            updateVersion={this.state.updateData ? this.state.updateData.version : null}
            onDownloadUpdate={this.handleDownloadUpdate}
            onRequestClose={this.handleClose}
          />
        );
      }
      case 'updateNotAvailable': {
        return (
          <UpdateNotAvailableModal
            currentVersion={this.state.currentVersion}
            isOpen={this.state.isOpen}
            onRequestClose={this.handleClose}
          />
        );
      }
      case 'downloading': {
        return (
          <UpdateDownloadingModal
            isOpen={this.state.isOpen}
            onCancel={this.handleClose}
            onRequestClose={this.handleDownloadClose}
          />
        );
      }
      case 'downloaded': {
        return (
          <UpdateApplyModal
            isOpen={this.state.isOpen}
            onApplyUpdate={this.handleRestart}
            onRequestClose={this.handleClose}
          />
        );
      }
      case 'error': {
        return (
          <UpdateErrorModal
            isOpen={this.state.isOpen}
            onRequestClose={this.handleClose}
            onRetryUpdate={this.handleCheckForUpdate}
            onManualDownload={this.handleManualDownload}
          />
        );
      }
      default: {
        return false;
      }
    }
  }
}

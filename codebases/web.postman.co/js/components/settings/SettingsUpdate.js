import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import ProgressBar from '../base/ProgressBar';
import TextArea from '../base/TextArea';
import Text from '../base/Text';
import Markdown from '../base/Markdown';
import AppSettingsDefaults from '../../constants/AppSettingsDefaults';
import GetUniqueIdHelper from '../../utils/GetUniqueIdHelper';
import ToggleSwitch from '../base/ToggleSwitch';

const autoDownload = AppSettingsDefaults.autoDownload;

export default class SettingsUpdate extends Component {
  constructor (props) {
    super(props);

    this.setAppOnline = this.setAppOnline.bind(this);
    this.setAppOffline = this.setAppOffline.bind(this);
    this.handleAutoDownloadChange = this.handleAutoDownloadChange.bind(this);

    this.state = {
      uniqueName: GetUniqueIdHelper.generateUniqueId(),
      isAppOnline: navigator.onLine
    };
  }

  UNSAFE_componentWillMount () {
    window.addEventListener('online', this.setAppOnline);
    window.addEventListener('offline', this.setAppOffline);
  }

  componentWillUnmount () {
    window.removeEventListener('online', this.setAppOnline);
    window.removeEventListener('offline', this.setAppOffline);
  }

  handleAutoDownloadChange () {
    let oldValue = this.props.autoDownloadUpdateStatus;

    this.props.onAutoDownloadEnabledChanged(oldValue === autoDownload.ALL ? autoDownload.MINOR : autoDownload.ALL);
  }

  setAppOnline () {
    this.setState({ isAppOnline: true });
  }

  setAppOffline () {
    this.setState({ isAppOnline: false });
  }

  renderUpdateStatus (status) {
    var currentVersion = this.props.currentVersion;

    switch (status) {
      case 'idle':
        return (
          <div className='update-idle'>
            <div className='update-idle__version'>
              <Text value={`You're on Postman v${currentVersion}`} type='body-medium' />
            </div>
            <Button
              type='primary'
              onClick={this.props.onCheckForUpdate}
              className='update-idle__button'
              disabled={!this.state.isAppOnline}
              tooltip={!this.state.isAppOnline ? 'You need to be online to check for updates.' : null}
            >
              <Text value='Check for updates' type='button-medium' />
            </Button>
          </div>
        );
      case 'updateAvailable':
        return (
          <div className='settings__update'>
            <div className='settings__update__container'>
              <div className='settings__update__info-container'>
                <div className='settings__update__header'>
                  <Text value='Update Available' type='heading-h5' />
                </div>
                <div className='settings__update__version'>
                  <Text value={`Current Version: v${currentVersion}`} type='body-medium' />
                </div>
              </div>
              <Button
                type='primary'
                onClick={this.props.onDownloadUpdate}
                className='update-idle__button'
                disabled={!this.state.isAppOnline}
                tooltip={!this.state.isAppOnline ? 'You need to be online to download the update.' : null}
              >
                <Text value='Download update' type='button-medium' />
              </Button>
            </div>
          </div>
        );
      case 'checking':
        return (
          <div className='update-checking'>
            <div className='update-checking__message'>
              <Text value='Checking for updates...' type='body-medium' />
            </div>
            <div className='update-checking__progress'>
              <ProgressBar />
            </div>
          </div>
        );
      case 'updateNotAvailable':
        return (
          <div className='settings__update'>
            <div className='settings__update__container'>
              <div className='settings__update__info-container'>
                <div className='settings__update__header'>
                  <Text value='You are up to date!' type='heading-h5' />
                </div>
                <div className='settings__update__version'>
                  <Text value={`Postman v${currentVersion} is the latest version.`} type='body-medium' />
                </div>
              </div>
              <Button
                type='primary'
                onClick={this.props.onCheckForUpdate}
                className='update-not-available__button'
                disabled={!this.state.isAppOnline}
                tooltip={!this.state.isAppOnline ? 'You need to be online to check for updates.' : null}
              >
                <Text value='Check for updates' type='button-medium' />
              </Button>
            </div>
          </div>
        );
      case 'downloading':
        return (
          <div className='update-downloading'>
            <div className='update-downloading__message'>
              <Text value='Downloading update...' type='body-medium' />
            </div>
            <div className='update-downloading__progress'>
              <ProgressBar />
            </div>
          </div>
        );
      case 'downloaded':
        return (
          <div className='settings__update'>
            <div className='settings__update__container'>
              <div className='settings__update__info-container'>
                <div className='settings__update__header'>
                  <Text value='Update Downloaded.' type='heading-h5' />
                </div>
                <div className='settings__update__version'>
                  <Text value={`Current Version: v${currentVersion}`} type='body-medium' />
                </div>
              </div>
              <Button
                type='primary'
                onClick={this.props.onApplyUpdate}
              >
                <Text value='Restart to Install Update' type='button-medium' />
              </Button>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className='update-error'>
            <div className='update-error__message'>
              <Text value='Something went wrong. Please check your connection and try restarting the app.' type='body-medium' />
            </div>
            <Button
              type='primary'
              onClick={(event) => this.props.onCheckForUpdate(event, true)}
              disabled={!this.state.isAppOnline}
              tooltip={!this.state.isAppOnline ? 'You need to be online to check for updates.' : null}
            >
              <Text value='Retry' type='button-medium' />
            </Button>
          </div>
        );
      default: {
        return false;
      }
    }
  }

  renderUpdateOptions () {
    let autoDownloadUpdateStatus = this.props.autoDownloadUpdateStatus;
    return (
      <div className='settings-autoupdate'>
        <div className='settings-autoupdate-info-container'>
          <div className='settings-autoupdate-header'>
            <Text value='Automatically download major updates' type='heading-h5' />
          </div>
          <div className='settings-autoupdate-body'>
            <ToggleSwitch
              isActive={autoDownloadUpdateStatus === autoDownload.ALL}
              activeLabel='Enabled'
              inactiveLabel='Disabled'
              onClick={this.handleAutoDownloadChange}
            />
          </div>
          <div className='settings-autoupdate-footer'>
            <Text value='Postman automatically downloads minor updates and bug fixes.' type='body-medium' />
          </div>
        </div>
      </div>
    );
  }

  renderReleaseNotes (updateStatus, releaseNotes) {
    if (!_.includes(['updateAvailable', 'downloaded'], updateStatus) || _.isEmpty(releaseNotes)) {
      return false;
    }
    return (
      <Markdown
        className={('settings-update-changelog-container', 'changelog-content')}
        source={releaseNotes}
      />
    );
  }

  render () {

    let updateStatus = this.props.updateStatus;
    return (
      <div>
        {this.renderUpdateOptions()}
        {this.renderUpdateStatus(updateStatus)}
        {this.renderReleaseNotes(updateStatus, this.props.releaseNotes)}
      </div>

    );
  }
}


SettingsUpdate.defaultProps = { autoDownloadUpdateStatus: 0 };

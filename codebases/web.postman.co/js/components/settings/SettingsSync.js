import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import { SYNC_FEEDBACK, SYNC_DOCS } from '../../constants/AppUrlConstants';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
export default class SettingsSync extends Component {
  constructor (props) {
    super(props);

    this.handleContactFormClick = this.handleContactFormClick.bind(this);
  }

  handleContactFormClick (e) {
    e.stopPropagation();
    e.preventDefault();
    openExternalLink(e.target.href);
  }

  handleSyncDocumentation () {
    openExternalLink(SYNC_DOCS);
  }

  render () {

    if (!this.props.isLoggedIn) {
      return (
        <div className='settings-sync-signed-out-container'>
          <div>
            <div className='modal-text'>
              Syncing is a process that makes all your Postman data available wherever you're signed in to your Postman account. Any changes (edits, additions, deletions) you make will be synced across all devices linked to your account.
            </div>
            <br />
            <Button
              type='text'
              onClick={this.handleSyncDocumentation}
            >
              Learn more about syncing
            </Button>
          </div>
          <Button
            className='signout-out-signin-btn'
            size='huge'
            type='primary'
            onClick={this.props.onSignin}
          >
            Sign in to Postman
          </Button>
        </div>
      );
    }


    return (
      <div className='settings-sync-wrapper'>
        {
          this.props.isSyncEnabled ? (
            <div>
              <div className='settings-sync-header-description'>
                If your data has not synced properly, click to manually re-sync.
              </div>
              <div>
                <Button
                  disabled={!this.props.isInSync}
                  type='secondary'
                  onClick={this.props.onForceSync}
                >
                  Re-sync
                </Button>
              </div>
              {
                _.includes(['dev', 'stage'], window.RELEASE_CHANNEL) && (
                  <div>
                    <div className='settings-sync-section-separator' />
                    <div className='settings-sync-header-description'>
                      Deactivate Postman Sync for your account
                    </div>
                    <div>
                      <Button
                        type='secondary'
                        onClick={this.props.onDisableSync}
                      >
                        Disable sync
                      </Button>
                    </div>
                  </div>
                )
              }
            </div>
          ) : (
            <div>
              <div className='settings-sync-header-description'>
                Deactivate Postman Sync for your account:
              </div>
              {
                this.props.isDisableSuccessful &&
                  <div className='settings-sync-header-description'>
                    <span>Sync has been disabled for your account. Please restart the app WITHOUT signing out to deactivate Sync. We would be grateful if you could share your feedback </span>
                    <a
                      className='settings-sync-feedback-link'
                      href={SYNC_FEEDBACK}
                      onClick={this.handleContactFormClick}
                    >
                      through this form
                    </a>
                  </div>
              }
              <div>
                <Button
                  type='secondary'
                  onClick={this.props.onEnableSync}
                >
                  Enable Sync
                </Button>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

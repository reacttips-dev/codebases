import React, { Component } from 'react';
import { Text } from '@postman/aether';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import {
  HOME_PAGE_URL,
  DOCS_URL,
  LICENSE_URL,
  CHANGELOG_URL,
  TWITTER_URL,
  ISSUES_URL
} from '../../constants/AppUrlConstants';

const isBrowser = window.SDK_PLATFORM === 'browser';

export default class SettingsAbout extends Component {
  constructor (props) {
    super(props);

    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick (link, e) {
    e.preventDefault();
    openExternalLink(link);
  }

  // Platform info is necessary only in native app not in browser

  getPlatformInfo () {
    switch (this.props.platform) {
      case 'darwin':
        return 'Mac';
      case 'win32':
        return 'Windows';
      case 'linux':
        return 'Linux';
      default:
        return '';
    }
  }

  render () {
    let changeLogBasedOnPlatform = CHANGELOG_URL;

    changeLogBasedOnPlatform = changeLogBasedOnPlatform + '#changelog-mac-app';

    let platform = this.getPlatformInfo();

    return (
      <div className='settings-about-wrapper'>
        <div className='settings-about-logo'>
          <div className='postman-logo' />
        </div>
        <div className='settings-about-version'>
          <Text type='para' color='content-color-primary'>
            {
              isBrowser ?

                // browser
                'Postman for Web' :

                // native app
                !_.isEmpty(platform) && 'Postman for ' + platform
            }
          </Text>
        </div>
        <div className='settings-about-version'>
          <Text type='para' color='content-color-primary'>
            {'Version ' + this.props.version}
          </Text>
        </div>
        <div className='settings-about-version'>
          <Text type='para' color='content-color-primary'>
            {
              isBrowser ?

                // browser
                this.props.platform + ' / ' + this.props.os :

                // native app
                this.props.os + ' / ' + this.props.architecture
            }
          </Text>
        </div>
        <div className='settings-about-links-list'>
          <div className='settings-about-links-list-item'>
            <a className='settings-about-links' href={HOME_PAGE_URL} onClick={this.handleLinkClick.bind(this, HOME_PAGE_URL)}>
              <Text type='link-primary' isExternal>Website</Text>
            </a>
          </div>
          <div className='settings-about-links-list-item'>
            <a className='settings-about-links' href={TWITTER_URL} onClick={this.handleLinkClick.bind(this, TWITTER_URL)}>
              <Text type='link-primary' isExternal>Twitter</Text>
            </a>
          </div>
          <div className='settings-about-links-list-item'>
            <a className='settings-about-links' href={LICENSE_URL} onClick={this.handleLinkClick.bind(this, LICENSE_URL)}>
              <Text type='link-primary' isExternal>Licenses</Text>
            </a>
          </div>
          <div className='settings-about-links-list-item'>
            <a className='settings-about-links' href={changeLogBasedOnPlatform} onClick={this.handleLinkClick.bind(this, changeLogBasedOnPlatform)}>
              <Text type='link-primary' isExternal>Changelog</Text>
            </a>
          </div>
          <div className='settings-about-links-list-item'>
            <a className='settings-about-links' href={DOCS_URL} onClick={this.handleLinkClick.bind(this, DOCS_URL)}>
              <Text type='link-primary' isExternal>Documentation</Text>
            </a>
          </div>
          <div className='settings-about-links-list-item'>
            <a className='settings-about-links' href={ISSUES_URL} onClick={this.handleLinkClick.bind(this, ISSUES_URL)}>
              <Text type='link-primary' isExternal>Report an issue</Text>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

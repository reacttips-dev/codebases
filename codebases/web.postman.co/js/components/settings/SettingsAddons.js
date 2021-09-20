import React, { Component } from 'react';
import { Text } from '@postman/aether';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';

const DOWNLOAD_NEWMAN_URL = 'https://www.npmjs.com/package/newman';
export default class SettingsAddons extends Component {
  constructor (props) {
    super(props);
  }

  // TODO:  If we have more addons must be pass through model or an const array
  render () {

    return (
      <div className='settings-addons-wrapper'>
        <div className='settings-addons-link-wrapper'>
          <a
            className='settings-addons-link'
            href={DOWNLOAD_NEWMAN_URL}
            onClick={(e) => { e.preventDefault(); openExternalLink(DOWNLOAD_NEWMAN_URL); }}
          >
            <Text type='link-primary' isExternal>Download Newman from npm</Text>
          </a>
        </div>
        <div className='settings-addons-description'>
          <Text type='para'>
          {'Postman\'s command-line companion lets you do amazing things! With Newman, you can integrate Postman collections with your build system. Or you can run automated tests for your API through a cron job.'}
          </Text>
        </div>
      </div>
    );
  }
}

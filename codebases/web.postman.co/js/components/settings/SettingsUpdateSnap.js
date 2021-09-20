import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import Text from '../base/Text';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';

const updateTroubleshootDoc = 'https://go.pstmn.io/troubleshoot-updates';

export default class SettingsUpdateSnap extends Component {
  openDocLink () {
    openExternalLink(updateTroubleshootDoc);
  }

  render () {
    return (
      <div>
        <Text value={'You\'re up to date!'} type='heading-h5' />
        <p>
          You’re on <b>v{this.props.currentVersion}</b>.
          Snap will automatically update Postman whenever a new version is released.
        </p>
        <div className='divider' />
        <p>
          <Text value='Having trouble with updates?' type='body-medium' />
        </p>
        <Button
          className='learn-more-button'
          type='text'
          onClick={this.openDocLink}
        >
          <Text value='Read our troubleshooting doc' type='button-medium' />
        </Button>
      </div>
    );
  }
}

SettingsUpdateSnap.defaultProps = { autoDownloadUpdateStatus: 0 };

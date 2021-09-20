import React, { Component } from 'react';
import { Tabs, Tab } from '../base/Tabs';
import Text from '../base/Text';

import {
  SETTINGS_GENERAL,
  SETTINGS_THEMES,
  SETTINGS_SHORTCUTS,
  SETTINGS_DATA,
  SETTINGS_ADDONS,
  SETTINGS_SYNC,
  SETTINGS_CERT,
  SETTINGS_PROXY,
  SETTINGS_UPDATE,
  SETTINGS_ABOUT,
  SETTINGS_DEV_OPTIONS
} from '../../constants/SettingsTypeConstants';
import { TRACK_SUPPORTED_CHANNELS } from '../../constants/TrackSupportConstants';
import { isEmbeddedScratchpad } from '../../utils/ScratchpadUtils';

export default class SettingsTabs extends Component {
  constructor (props) {
    super(props);
  }

  render () {

    return (
      <div className='settings-tabs'>
        <Tabs
          type='primary'
          defaultActive={SETTINGS_GENERAL}
          activeRef={this.props.activeTab}
          onChange={this.props.onSelect}
        >
          <Tab refKey={SETTINGS_GENERAL}>
            <Text value='General' type='body-medium' />
          </Tab>
          <Tab refKey={SETTINGS_THEMES}>
            <Text value='Themes' type='body-medium' />
          </Tab>
          <Tab refKey={SETTINGS_SHORTCUTS}>
            <Text value='Shortcuts' type='body-medium' />
          </Tab>
          <Tab refKey={SETTINGS_DATA}>
            <Text value='Data' type='body-medium' />
          </Tab>
          <Tab refKey={SETTINGS_ADDONS}>
            <Text value='Add-ons' type='body-medium' />
          </Tab>
          {/* <Tab refKey={SETTINGS_SYNC}>Sync</Tab> */}
          <Tab refKey={SETTINGS_CERT}>
            <Text value='Certificates' type='body-medium' />
          </Tab>
          <Tab refKey={SETTINGS_PROXY}>
            <Text value='Proxy' type='body-medium' />
          </Tab>
          {window.SDK_PLATFORM !== 'browser' && !isEmbeddedScratchpad() &&
            <Tab refKey={SETTINGS_UPDATE}>
              <Text value='Update' type='body-medium' />
            </Tab>
          }
          {
            window.SDK_PLATFORM === 'browser' && TRACK_SUPPORTED_CHANNELS.has(window.RELEASE_CHANNEL) &&
              <Tab refKey={SETTINGS_DEV_OPTIONS}>
                <Text value='Dev Options' type='body-medium' />
              </Tab>
          }
          <Tab refKey={SETTINGS_ABOUT}>
            <Text value='About' type='body-medium' />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

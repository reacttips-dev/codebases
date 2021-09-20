
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { Modal, ModalHeader, ModalContent } from '../../components/base/Modals';
import Text from '../../components/base/Text';
import SettingsTabs from '../../components/settings/SettingsTabs';
import SettingsTabContents from '../../components/settings/SettingsTabContents';
import SettingsTabContent from '../../components/settings/SettingsTabContent';
import SettingsGeneralContainer from './SettingsGeneralContainer';
import SettingsThemesContainer from './SettingsThemesContainer';
import SettingsSyncContainer from './SettingsSyncContainer';
import SettingsProxyContainer from '@@runtime-repl/proxy/SettingsProxyContainer';
import SettingsUpdateContainer from './SettingsUpdateContainer';
import SettingsCertificatesContainer from '@@runtime-repl/certificates/SettingsCertificatesContainer';
import SettingsDataContainer from './SettingsDataContainer';
import SettingsShortcutsContainer from './SettingsShortcutsContainer';
import SettingsAddonsContainer from './SettingsAddonsContainer';
import SettingsAboutContainer from './SettingsAboutContainer';
import SettingsDevOptions from '../../components/settings/SettingsDevOptions';
import { getStore } from '../../stores/get-store';
import { TRACK_SUPPORTED_CHANNELS } from '../../constants/TrackSupportConstants';
import NavigationService from '../../services/NavigationService';
import { OPEN_GLOBAL_SETTINGS } from '../../../../renderer/appsdk/navigation/constants';

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
import { isEmbeddedScratchpad } from '../../utils/ScratchpadUtils';

@observer
export default class SettingsModalContainer extends Component {
  constructor (props) {
    super(props);

    this.store = getStore('SettingsModalUIStore');

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);

    this.attachModelListeners();
  }

  handleClose () {
    this.store.setActiveTab(SETTINGS_GENERAL);
    this.store.toggleSettingsModal(false);
    pm.mediator.trigger('modalClosed', { name: 'settings' });
  }


  handleOpen (tab) {
    this.store.toggleSettingsModal(true);
    if (tab && this.isValidTab(tab)) {
      this.store.setActiveTab(tab);
    }
    else {
      this.store.setActiveTab(this.store.activeTab);
    }
    pm.mediator.trigger('modalOpened', {
      name: 'settings',
      activeTab: tab || this.store.activeTab
    });
  }

  handleTabSelect (id) {
    if (id === this.store.activeTab) {
      return;
    }

    this.store.setActiveTab(id);

    pm.mediator.trigger('modalOpened', {
      name: 'settings',
      activeTab: id
    });

    // @todo Add a new option to the transition to replace the url and not add it
    // to the history when internal tabs are switched
  }

  isValidTab (tab) {
    switch (tab) {
      case SETTINGS_GENERAL:
      case SETTINGS_THEMES:
      case SETTINGS_SHORTCUTS:
      case SETTINGS_DATA:
      case SETTINGS_ADDONS:
      case SETTINGS_SYNC:
      case SETTINGS_CERT:
      case SETTINGS_PROXY:
      case SETTINGS_UPDATE:
      case SETTINGS_ABOUT:
      case SETTINGS_DEV_OPTIONS:
        return true;
    }
    return false;
  }

  attachModelListeners () {

    pm.mediator.on('openSettingsModal', this.handleOpen, this);

    pm.mediator.on('closeSettingsModal', this.handleClose, this);

  }

  componentWillUnmount () {

    pm.mediator.off('openSettingsModal', this.handleOpen);

    pm.mediator.off('closeSettingsModal', this.handleClose);

  }

  getCustomStyles () {
    return {
      marginTop: '20vh',
      width: '720px',
      height: '65vh'
    };
  }

  render () {

    return (
      <Modal
        isOpen={this.store.isSettingsModalOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getCustomStyles()}
        className='settings-modal'
      >
        <ModalHeader>
          <Text value='SETTINGS' type='heading-h5' />
        </ModalHeader>
        <ModalContent>
          <div className='settings-container'>
            <SettingsTabs
              onSelect={this.handleTabSelect}
              activeTab={this.store.activeTab}
            />
            <SettingsTabContents
              activeKey={this.store.activeTab}
            >
              <SettingsTabContent key={SETTINGS_GENERAL}>
                <SettingsGeneralContainer />
              </SettingsTabContent>
              <SettingsTabContent key={SETTINGS_THEMES}>
                <SettingsThemesContainer />
              </SettingsTabContent>
              <SettingsTabContent key={SETTINGS_SHORTCUTS}>
                <SettingsShortcutsContainer />
              </SettingsTabContent>
              <SettingsTabContent key={SETTINGS_DATA}>
                <SettingsDataContainer />
              </SettingsTabContent>
              <SettingsTabContent key={SETTINGS_ADDONS}>
                <SettingsAddonsContainer />
              </SettingsTabContent>
              {/* <SettingsTabContent key={SETTINGS_SYNC}>
                <SettingsSyncContainer />
              </SettingsTabContent> */}
              <SettingsTabContent key={SETTINGS_CERT}>
                <SettingsCertificatesContainer />
              </SettingsTabContent>
              <SettingsTabContent key={SETTINGS_PROXY}>
                <SettingsProxyContainer />
              </SettingsTabContent>
              {window.SDK_PLATFORM !== 'browser' && !isEmbeddedScratchpad() &&
                <SettingsTabContent key={SETTINGS_UPDATE}>
                  <SettingsUpdateContainer />
                </SettingsTabContent>
              }
              <SettingsTabContent key={SETTINGS_ABOUT}>
                <SettingsAboutContainer />
              </SettingsTabContent>
              {
                window.SDK_PLATFORM === 'browser' &&
                  (TRACK_SUPPORTED_CHANNELS.has(window.RELEASE_CHANNEL)) &&
                  <SettingsTabContent key={SETTINGS_DEV_OPTIONS}>
                    <SettingsDevOptions />
                  </SettingsTabContent>
              }
            </SettingsTabContents>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

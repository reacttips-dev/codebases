import React, { Component } from 'react';
import semver from 'semver';
import { observer } from 'mobx-react';
import RequestPreviewHelper from '@@runtime-repl/_common/LivePreviewHelper';
import ArtemisEmptyState from '@@runtime-repl/_common/components/ArtemisEmptyState/ArtemisEmptyState';
import GenericEmptyState from '@@runtime-repl/_common/components/GenericEmptyState/GenericEmptyState';
import { handleSwitchToCloudAgent } from '@@runtime-repl/agent/AgentHelpers';
import { TYPES } from '@@runtime-repl/agent/AgentConstants';
import { DB_BASED_COOKIE_AGENT_VERSION } from '@@runtime-repl/cookies/CookieConstants';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import {
  Modal, ModalHeader, ModalContent
} from '@postman-app-monolith/renderer/js/components/base/Modals';
import CookiesManagementContainer from './CookiesManagementContainer';

@observer
export default class CookiesManagementModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      cookieCounter: 1
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCookieAdd = this.handleCookieAdd.bind(this);
    this.CapturePanelUIStore = getStore('CapturePanelUIStore');
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showCookieManagementModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showCookieManagementModal', this.handleOpen);
  }

  handleOpen () {
    pm.mediator.once('loadedCookies', () => {
      this.CapturePanelUIStore.toggleCookiesTab(true);
    });
    pm.cookieManager.loadCookies();
  }

  handleClose () {
    this.CapturePanelUIStore.toggleCookiesTab(false);

    // @LivePreview: Triggering request preview to update cookie header in a tab after cookie modal is closed
    // This will only trigger preview for the active editor
    const { activeEditor } = getStore('ActiveWorkspaceSessionStore');

    RequestPreviewHelper.previewRequest(activeEditor);
  }

  handleCookieAdd () {
    this.setState({ cookieCounter: this.state.cookieCounter + 1 });
  }

  getCustomStyles () {
    return {
      marginTop: '10vh',
      width: '720px'
    };
  }

  getContent () {
    if (_.get(pm.runtime, 'agent.stat.type') === TYPES.XHR) {
      return (
        <ArtemisEmptyState
          className='cookies-unavailable'
          messageClass='cookies-unavailable__message'
          titleVariant='heading-h3'
          title='No cookies available'
          message={'Postman can\'t access cookies when sending requests through a browser. To capture and manage cookies, try the Postman Desktop Agent.'}
          emptyStateAsset='cookies-unavailable__icon'
          cleanUp={this.handleClose}
          enableSecondaryAction
        />
      );
    }

    const agentVersion = semver.valid(semver.coerce(pm.runtime.version));

    if (_.get(pm.runtime.agent, 'stat.type') === TYPES.WS && agentVersion && semver.lt(agentVersion, DB_BASED_COOKIE_AGENT_VERSION)) {
      return (
        <GenericEmptyState
          className='cookies-unavailable'
          icon='cookies-unavailable__icon'
          message={{
            text: `You’re using an older version of Postman Desktop Agent, which can not be used to add or edit cookies. \n\nUpdate the Desktop Agent by clicking on the Postman Agent icon in your toolbar${getStore('FeatureFlagsStore').isEnabled('runtime:isCloudAgentEnabled') ? ' or switch to use the Postman Cloud Agent' : ''}.`,
            className: 'cookies-unavailable__message'
          }}
          secondaryAction={getStore('FeatureFlagsStore').isEnabled('runtime:isCloudAgentEnabled') && {
            label: 'Switch to Cloud Agent',
            onClick: () => handleSwitchToCloudAgent()
          }}
        />
      );
    }

    return (
      <CookiesManagementContainer
        onCookieAdd={this.handleCookieAdd}
        cookieCounter={this.state.cookieCounter}
      />
    );
  }

  render () {
    return (
      <Modal
        isOpen={this.CapturePanelUIStore.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getCustomStyles()}
        className='cookies-management-modal'
      >
        <ModalHeader>MANAGE COOKIES</ModalHeader>
        <ModalContent>
          <div className='cookies-management-modal-container'>
            {this.getContent()}
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

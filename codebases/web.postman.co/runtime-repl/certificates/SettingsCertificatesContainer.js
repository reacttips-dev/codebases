import React, { Component } from 'react';
import { observer } from 'mobx-react';

import CertificateList from '@@runtime-repl/certificates/CertificateList';
import CACertificate from '@@runtime-repl/certificates/CACertificate';
import ArtemisEmptyState from '@@runtime-repl/_common/components/ArtemisEmptyState/ArtemisEmptyState';
import { TYPES } from '@@runtime-repl/agent/AgentConstants';

import AddCertificateContainer from './AddCertificateContainer';

@observer
export default class SettingsCertificatesContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      certificates: [],
      showAdd: false
    };

    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleDeleteCertificate = this.handleDeleteCertificate.bind(this);
    this.handleAddToggle = this.handleAddToggle.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.model = pm.certificateManager;
    this.attachModelListeners();
    this.handleModelChange();
  }

  componentWillUnmount () {
    this.detachModelListeners();
  }

  attachModelListeners () {
    if (!this.model) {
      return;
    }

    this.model.on('update reset change', this.handleModelChange);
  }

  detachModelListeners () {
    if (!this.model) {
      return;
    }

    this.model.off('update reset change', this.handleModelChange);
  }

  handleModelChange () {
    this.setState({ certificates: this.model.toJSON() });
  }

  handleDeleteCertificate (host) {
    this.model.removeCertificate(host);
  }

  handleAddToggle () {
    this.setState({ showAdd: !this.state.showAdd });
  }

  render () {
    if (_.get(pm.runtime, 'agent.stat.type') === TYPES.XHR) {
      return (
        <ArtemisEmptyState
          title='Using browser certificates'
          message={'By default, Postman uses your browser\'s SSL certificates when sending API requests. To view and set SSL certificates on a per-domain basis, use the Postman Desktop Agent.'}
          cleanUp={() => pm.mediator.trigger('closeSettingsModal')}
        />
      );
    }

    if (_.get(pm.runtime, 'agent.stat.type') === TYPES.CLOUD) {
      return (
        <ArtemisEmptyState
          title='Not supported'
          message='Configuring SSL certificates is not supported when using the cloud agent. To view and set SSL certificates on a per-domain basis, use the Postman Desktop Agent.'
          cleanUp={() => pm.mediator.trigger('closeSettingsModal')}
        />
      );
    }

    return (
      <div>
        {
          this.state.showAdd ? (
            <AddCertificateContainer
              onCancel={this.handleAddToggle}
            />
          ) : (
            <div>
              <CACertificate />
              <CertificateList
                certificates={this.state.certificates}
                onDelete={this.handleDeleteCertificate}
                onAddToggle={this.handleAddToggle}
              />
            </div>
          )
        }
      </div>
    );
  }
}

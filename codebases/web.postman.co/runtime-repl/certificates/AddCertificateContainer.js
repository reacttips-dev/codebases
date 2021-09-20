import React, { Component } from 'react';
import AddCertificate from '@@runtime-repl/certificates/AddCertificate';

export default class AddCertificateContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      hostname: '',
      port: '',
      pemPath: '',
      keyPath: '',
      pfxPath: '',
      passphrase: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit () {
    const {
      hostname,
      port,
      pemPath,
      pfxPath,
      keyPath,
      passphrase
    } = this.state;

    if (_.isEmpty(hostname)) {
      pm.toasts.error('Hostname is required');

      return;
    }

    const host = this.sanitizeHost(hostname, port);

    pm.certificateManager.addCertificate(host, pemPath, keyPath, pfxPath, passphrase);
    this.props.onCancel();
  }

  sanitizeHost (host, port) {
    // If port is given, strip any port in the host

    const sanitizedHost = host
      .replace(/.*?:\/\//g, '') // Strip protocol
      .replace(/\?.*/, '') // Strip query
      .replace(/\/.*/, '') // Strip patch
      .replace(/^\./, ''); // Strip leading period

    if (!_.isEmpty(port)) {
      const hostNamePort = sanitizedHost.split(':');

      return (`${hostNamePort[0]}:${port}`);
    }

    return sanitizedHost;
  }

  handleChange (key, value) {
    const nextState = _.assign({}, this.state);

    nextState[key] = value;
    this.setState(nextState);
  }

  render () {
    return (
      <AddCertificate
        {...this.state}
        onCancel={this.props.onCancel}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
      />
    );
  }
}

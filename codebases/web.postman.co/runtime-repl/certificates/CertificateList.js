import async from 'async';
import React, { Component } from 'react';
import { Text, Heading } from '@postman/aether';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import PasswordInput from '@postman-app-monolith/renderer/js/components/base/PasswordInput';
import WarningButton from '@postman-app-monolith/renderer/js/components/base/WarningButton';
import { CERTIFICATES_DOC } from '@postman-app-monolith/renderer/js/constants/AppUrlConstants';
import Link from '../../appsdk/components/link/Link';

export default class CertificateList extends Component {
  constructor (props) {
    super(props);

    this.state = { warningList: [] };
  }

  componentDidMount () {
    this.computeWarningList(this.props);
  }

  computeWarningList (props) {
    async.map(props.certificates, (cert, cb) => {
      async.parallel({
        crt: (next) => {
          pm.runtime.pathAccessible(cert.pemPath, false, (err) => {
            next(null, !!err);
          });
        },
        key: (next) => {
          pm.runtime.pathAccessible(cert.keyPath, false, (err) => {
            next(null, !!err);
          });
        },
        pfx: (next) => {
          pm.runtime.pathAccessible(cert.pfxPath, false, (err) => {
            next(null, !!err);
          });
        }
      }, cb);
    }, (err, result) => {
      this.setState({ warningList: err ? [] : result });
    });
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.computeWarningList(nextProps);
  }

  handleDelete (host) {
    this.props.onDelete && this.props.onDelete(host);
  }

  openCertificatesDocumentation () {
    pm.app.openExternalLink(CERTIFICATES_DOC);
  }

  render () {
    return (
      <div className='certificate-list-wrapper'>
        <div className='certificate-list-wrapper__heading'>
          <Heading text='Client Certificates' type='h3' styleAs='h5' color='content-color-primary' />
          <Button
            type='text'
            onClick={this.props.onAddToggle}
            className='certificate-list-wrapper__heading__add'
          >
            Add Certificate
          </Button>
        </div>
        <div className='certificate-list-wrapper-desc'>
          <Text type='para'>
            Add and manage SSL certificates on a per domain basis.
            {' '}
            <Link
              className='learn-more-button'
              onClick={this.openCertificatesDocumentation}
            >
              <Text type='link-primary' isExternal>
                Learn more about working with certificates at our Learning Center
              </Text>
            </Link>
          </Text>
        </div>

        <div className='certificate-list'>
          {
            _.map(this.props.certificates, (certificate, index) => (
              <div key={certificate.host} className='certificate-list-item'>
                <div className='certificate-list-item__row'>
                  <div className='certificate-list-item__key'>
                    <Text color='content-color-primary'>
                        Host
                    </Text>
                  </div>
                  <div className='certificate-list-item__value'>{certificate.host}</div>
                  <Button
                    type='text'
                    className='certificate-list-item__controls'
                    onClick={this.handleDelete.bind(this, certificate.host)}
                  >
                      Remove
                  </Button>
                </div>
                {
                    !_.isEmpty(certificate.pemPath) && (
                      <div className='certificate-list-item__row'>
                        <div className='certificate-list-item__key'>
                          <Text color='content-color-primary'>CRT file</Text>
                          { _.get(this.state.warningList, [index, 'crt'], false) && <WarningButton tooltip='The selected CRT file is not readable, check file permissions.' /> }
                        </div>
                        <div className='certificate-list-item__value'>
                          <Text color='content-color-primary'>
                            {certificate.pemPath}
                          </Text>
                        </div>
                      </div>
                    )
}
                {
                    !_.isEmpty(certificate.keyPath) && (
                      <div className='certificate-list-item__row'>
                        <div className='certificate-list-item__key'>
                          <Text color='content-color-primary'>KEY file</Text>
                          { _.get(this.state.warningList, [index, 'key'], false) && <WarningButton tooltip='The selected KEY file is not readable, check file permissions.' /> }
                        </div>
                        <div className='certificate-list-item__value'>
                          <Text color='content-color-primary'>
                            {certificate.keyPath}
                          </Text>
                        </div>
                      </div>
                    )
}
                {
                    !_.isEmpty(certificate.pfxPath) && (
                      <div className='certificate-list-item__row'>
                        <div className='certificate-list-item__key'>
                          <Text color='content-color-primary'>
                          PFX file
                          </Text>
                          { _.get(this.state.warningList, [index, 'pfx'], false) && <WarningButton tooltip='The selected PFX file is not readable, check file permissions.' /> }
                        </div>
                        <div className='certificate-list-item__value'>
                          <Text color='content-color-primary'>
                            {certificate.pfxPath}
                          </Text>
                        </div>
                      </div>
                    )
}
                {
                    !_.isEmpty(certificate.passphrase) && (
                      <div className='certificate-list-item__row'>
                        <div className='certificate-list-item__key'>
                          <Text color='content-color-primary'>Passphrase</Text>
                        </div>
                        <div className='certificate-list-item__value'>
                          <PasswordInput
                            className='certificate-list-item__value-password'
                            value={certificate.passphrase}
                            readOnly
                          />
                        </div>
                      </div>
                    )
}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

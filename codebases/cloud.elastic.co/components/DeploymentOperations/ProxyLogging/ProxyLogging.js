/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import jif from 'jif'

import { EuiFormHelpText, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../cui'
import Permission from '../../../lib/api/v1/permissions'

import SpinButton from '../../SpinButton'
import FormGroup from '../../FormGroup'

import './proxyLogging.scss'

class ProxyLogging extends Component {
  render() {
    const {
      setProxyLoggingRequest,
      cluster: { proxyLogging },
    } = this.props
    const { inProgress, error } = setProxyLoggingRequest

    return (
      <Fragment>
        <FormGroup
          label={
            <FormattedMessage
              id='cluster-manage-proxy-logging.proxy-logging-title'
              defaultMessage='Proxy Logging'
            />
          }
        >
          <EuiSpacer size='s' />

          <CuiPermissibleControl permissions={Permission.setEsClusterMetadataRaw}>
            <SpinButton
              color='primary'
              onClick={this.setLogging}
              spin={inProgress}
              requiresSudo={true}
            >
              {jif(
                proxyLogging,
                () => (
                  <FormattedMessage
                    id='cluster-manage-proxy-logging.turn-off'
                    defaultMessage='Turn off'
                  />
                ),
                () => (
                  <FormattedMessage
                    id='cluster-manage-proxy-logging.turn-on'
                    defaultMessage='Turn on'
                  />
                ),
              )}
            </SpinButton>
          </CuiPermissibleControl>

          <EuiFormHelpText>
            <FormattedMessage
              id='cluster-manage-proxy-logging.description'
              defaultMessage='Log requests routed to this cluster by the proxy. Turning off logging can help when the volume of requests routed by the proxies is high and logs grow in size quickly.'
            />
          </EuiFormHelpText>

          {jif(error, () => (
            <CuiAlert className='proxyLogging-error' type='error'>
              {error}
            </CuiAlert>
          ))}
        </FormGroup>

        <EuiSpacer />
      </Fragment>
    )
  }

  setLogging = () => {
    const {
      cluster,
      setProxyLogging,
      cluster: { proxyLogging },
    } = this.props
    setProxyLogging(cluster, !proxyLogging)
  }
}

export default ProxyLogging

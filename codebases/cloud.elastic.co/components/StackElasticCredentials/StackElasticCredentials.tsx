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

import moment from 'moment'
import React, { Component } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import {
  EuiButton,
  EuiCode,
  EuiDescriptionList,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiSpacer,
  EuiText,
  EuiTitle,
  EuiFlexGroup,
} from '@elastic/eui'

import PrivacySensitiveContainer from '../PrivacySensitiveContainer'
import CopyButton from '../CopyButton'

import { getSliderPrettyName } from '../../lib/sliders'
import { getDedicatedTemplateType } from '../../lib/deploymentTemplates/metadata'

import { StackDeployment } from '../../types'
import { DeploymentTemplateInfoV2, ClusterCredentials } from '../../lib/api/v1/types'

import './stackElasticCredentials.scss'

export type Props = {
  deployment: StackDeployment
  deploymentTemplate?: DeploymentTemplateInfoV2
  onlyShowCredentials?: boolean
  credentials: ClusterCredentials | null
  onDownloadCredentials?: () => void
}

const messages = defineMessages({
  title: {
    id: `elastic-credentials-header.label`,
    defaultMessage: `Save your Elasticsearch and Kibana password`,
  },
  description: {
    id: `elastic-credentials-header.description`,
    defaultMessage: `These credentials provide superuser access to Elasticsearch and Kibana in this deployment. The password won’t be shown again.`,
  },
  titleDedicated: {
    id: `elastic-credentials-header.label-dedicated`,
    defaultMessage: `Save your {sliderName} user password`,
  },
  descriptionDedicated: {
    id: `elastic-credentials-header.description-dedicated`,
    defaultMessage: `These credentials provide owner access to your {sliderName} deployment. The password won’t be shown again.`,
  },
  download: {
    id: `elastic-credentials-blob-download-button.label`,
    defaultMessage: `Download`,
  },
  copy: {
    id: `elastic-credentials-copy.label`,
    defaultMessage: `Copy`,
  },
  username: {
    id: `cluster-new-credentials.username`,
    defaultMessage: `Username`,
  },
  password: {
    id: `cluster-new-credentials-password`,
    defaultMessage: `Password`,
  },
})

class StackElasticCredentials extends Component<Props> {
  render() {
    const { deployment, credentials, onlyShowCredentials } = this.props
    const { id } = deployment

    if (!credentials) {
      return null
    }

    const { username, password } = credentials

    if (username === undefined || password === undefined) {
      return null
    }

    const blob = new window.Blob(
      [`${Object.keys(credentials).join(',')} \n ${Object.values(credentials).join(',')}`],
      {
        type: `text/csv;charset=utf-8`,
      },
    )

    const blobUrl = window.URL.createObjectURL(blob)
    const fileName = `credentials-${id.slice(0, 6)}-${moment().format(`YYYY-MMM-DD--HH_mm_ss`)}.csv`
    const listItems = [
      {
        title: (
          <EuiText className='elastic-credentials-label' size='s'>
            <FormattedMessage {...messages.username} />
          </EuiText>
        ),
        description: (
          <EuiCode
            data-test-id='elastic-credentials-username'
            className='elastic-credentials-username'
          >
            {username}
          </EuiCode>
        ),
      },
      {
        title: (
          <EuiText className='elastic-credentials-label' size='s'>
            <FormattedMessage {...messages.password} />
          </EuiText>
        ),
        description: (
          <EuiFlexGroup style={{ alignItems: 'center' }} justifyContent='center' gutterSize='none'>
            <EuiFlexItem grow={false}>
              <EuiCode
                data-test-id='elastic-credentials-password'
                className='elastic-credentials-password'
              >
                {password}
              </EuiCode>
            </EuiFlexItem>
            <EuiFlexItem className='copy-password-button' grow={false}>
              <CopyButton value={password} />
            </EuiFlexItem>
          </EuiFlexGroup>
        ),
      },
    ]

    return onlyShowCredentials
      ? this.renderStackCredentials({ listItems, fileName, blobUrl })
      : this.renderStackCredentialsPanel({ listItems, fileName, blobUrl })
  }

  renderStackCredentials({ listItems, fileName, blobUrl }) {
    const downloadButton = (
      // eslint-disable-next-line @elastic/eui/href-or-on-click
      <EuiButton
        data-test-id='elastic-credentials-download-button'
        download={fileName}
        href={blobUrl}
        fill={true}
        onClick={this.onDownloadCredentials}
      >
        <FormattedMessage {...messages.download} />
      </EuiButton>
    )

    return (
      <div className='elastic-credentials'>
        <PrivacySensitiveContainer>
          <EuiDescriptionList
            data-test-id='elasticCredentials'
            listItems={listItems}
            align='left'
          />
        </PrivacySensitiveContainer>
        {downloadButton}
      </div>
    )
  }

  renderStackCredentialsPanel({ listItems, fileName, blobUrl }) {
    const { deploymentTemplate } = this.props
    const dedicatedTemplateType = getDedicatedTemplateType(deploymentTemplate)

    let title = <FormattedMessage {...messages.title} />
    let description = <FormattedMessage {...messages.description} />

    // Checking explicitly against appsearch, until it's known if this is safe for other template types
    if (dedicatedTemplateType === `appsearch`) {
      const sliderName = (
        <FormattedMessage {...getSliderPrettyName({ sliderInstanceType: dedicatedTemplateType })} />
      )

      title = <FormattedMessage {...messages.titleDedicated} values={{ sliderName }} />
      description = <FormattedMessage {...messages.descriptionDedicated} values={{ sliderName }} />
    }

    return (
      <PrivacySensitiveContainer>
        <EuiFlexItem data-test-id='elasticCredentials' className='elastic-credentials'>
          <EuiTitle size='xs'>
            <h3 data-test-id='elastic-credentials-info-title'>{title}</h3>
          </EuiTitle>
          <EuiSpacer size='s' />
          <EuiText color='subdued'>
            <p data-test-id='elastic-credentials-info-description'>{description}</p>
          </EuiText>
          <EuiHorizontalRule margin='s' />
          {this.renderStackCredentials({ listItems, fileName, blobUrl })}
        </EuiFlexItem>
        <EuiSpacer size='m' />
      </PrivacySensitiveContainer>
    )
  }

  onDownloadCredentials = (): void => {
    const { onDownloadCredentials } = this.props

    if (onDownloadCredentials) {
      onDownloadCredentials()
    }
  }
}

export default StackElasticCredentials

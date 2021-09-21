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
import cx from 'classnames'

import React, { PureComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiDescriptionList,
  EuiDescriptionListDescription,
  EuiDescriptionListTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiLoadingContent,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import ExternalLink from '../../../ExternalLink'
import { CuiBeveledIcon } from '../../../../cui'
import PortalTile from '../PortalTile'

import { AsyncRequestState } from '../../../../types'
import { Summary } from '../../../../lib/api/v1/types'

import './cloudStatusTile.scss'

export interface Props {
  fetchCloudStatus: () => Promise<any>
  fetchCloudStatusRequest: AsyncRequestState
  cloudStatus: Summary
}

class CloudStatusTile extends PureComponent<Props> {
  componentDidMount() {
    const { fetchCloudStatus } = this.props
    fetchCloudStatus()
  }

  render() {
    const { cloudStatus, fetchCloudStatusRequest } = this.props
    const { status, incidents } = cloudStatus

    return (
      <PortalTile className='cloud-portal-platform-status-tile'>
        <EuiFlexGroup responsive={false} alignItems='center' gutterSize='s'>
          <EuiFlexItem grow={false}>{this.getCloudStatusIcon(status)}</EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiTitle size='xs'>
              <h2>
                <ExternalLink
                  showExternalLinkIcon={false}
                  color='text'
                  data-test-id='portal-cloud-status-tile-title-link'
                  href='https://cloud-status.elastic.co/'
                  className='cloud-portal-tile-title'
                >
                  <FormattedMessage
                    id='cloud-portal.platform-status-title'
                    defaultMessage='Cloud status'
                  />
                </ExternalLink>
              </h2>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='m' />

        {!status.indicator && fetchCloudStatusRequest.inProgress ? (
          <Fragment>
            <EuiSpacer size='s' />
            <EuiLoadingContent lines={1} />
          </Fragment>
        ) : (
          <EuiDescriptionList>
            <EuiDescriptionListTitle
              className={cx({
                'cloud-platform-status-without-incident-list': incidents.length === 0,
              })}
            >
              <EuiHealth color={this.getHealthIndicator(status.indicator)}>
                {this.toSentenceCase(status.description)}
              </EuiHealth>
            </EuiDescriptionListTitle>
            <div className='cloud-platform-status-incident-list'>
              {this.renderStatusIncidents(incidents)}
            </div>
          </EuiDescriptionList>
        )}
      </PortalTile>
    )
  }

  renderStatusIncidents(incidents) {
    return incidents.map((incident, index) => {
      const parsedDate = this.parseDate(incident.created_at)
      return (
        <Fragment key={incident.id}>
          {index > 0 && <EuiSpacer size='m' />}
          <EuiDescriptionListDescription>
            <ExternalLink
              href={incident.url}
              className='cloud-platform-status-incident-link'
              data-test-id={`portal-cloud-status-incident-item-link-${index}`}
            >
              {incident.name}
            </ExternalLink>
            <EuiSpacer size='xs' />
            <EuiText color='subdued' size='xs'>
              <FormattedMessage
                id='cloud-platform-status-timestamp'
                defaultMessage='Began at {time} on {date}'
                values={{
                  time: parsedDate.time,
                  date: parsedDate.date,
                }}
              />
            </EuiText>
            <EuiSpacer size='xs' />
            <EuiText color='subdued' size='xs'>
              <span className='cloud-platform-status-incident-status'>
                <FormattedMessage
                  id='cloud-platform-incident-current-status'
                  defaultMessage='Current status: {status}'
                  values={{ status: incident.status }}
                />
              </span>
            </EuiText>
          </EuiDescriptionListDescription>
        </Fragment>
      )
    })
  }

  getCloudStatusIcon(status) {
    const { indicator } = status
    let type = 'cloudSunny'

    if (indicator === 'minor') {
      type = 'cloudDrizzle'
    }

    if (indicator === 'major' || indicator === 'critical') {
      type = 'cloudStormy'
    }

    return (
      <CuiBeveledIcon
        type={type}
        baseColor={this.getHealthIndicator(indicator)}
        className={`cloud-platform-status-icon cloud-platform-status-icon-${indicator}`}
      />
    )
  }

  getHealthIndicator = (indicator) => {
    if (indicator === 'major' || indicator === 'critical') {
      return 'danger'
    }

    if (indicator === 'none') {
      return 'success'
    }

    if (indicator === 'minor') {
      return 'warning'
    }

    return 'subdued'
  }

  toSentenceCase(str) {
    const words = str.split(' ')
    const normalisedWords = [words[0].charAt(0).toUpperCase() + words[0].slice(1)]

    for (let i = 1; i < words.length; i++) {
      normalisedWords.push(words[i].charAt(0).toLowerCase() + words[i].slice(1))
    }

    return normalisedWords.join(' ')
  }

  parseDate(strDate) {
    const dateTime = moment(strDate)
    return {
      time: moment.utc(dateTime).format('LT'),
      date: moment.utc(dateTime).format('LL'),
    }
  }
}

export default CloudStatusTile

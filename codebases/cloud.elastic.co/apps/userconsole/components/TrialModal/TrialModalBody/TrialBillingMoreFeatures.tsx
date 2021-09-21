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

import React, { PureComponent, Fragment, ReactElement } from 'react'
import { WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiSpacer, EuiText } from '@elastic/eui'

import { moreFeatures } from './messages'

class TrialBillingMoreFeatures extends PureComponent<WrappedComponentProps> {
  render() {
    const moreFeaturesList = Object.keys(moreFeatures).map((i) => moreFeatures[i])

    return (
      <Fragment>
        <ul className='trial-feature-items'>
          {moreFeaturesList.map((feature, index) => (
            <li key={feature.id}>
              {this.renderFeature({ feature })}
              {index < moreFeaturesList.length - 1 && <EuiSpacer size='s' />}
            </li>
          ))}
        </ul>
      </Fragment>
    )
  }

  renderFeature({ feature }): ReactElement {
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <EuiFlexGroup gutterSize='m' className='feature' alignItems='center' responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiIcon color='secondary' type='check' />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiText>{formatMessage(feature)}</EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }
}

export default injectIntl(TrialBillingMoreFeatures)

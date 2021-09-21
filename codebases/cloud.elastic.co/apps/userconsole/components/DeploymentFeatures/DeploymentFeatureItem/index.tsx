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

import React, { PureComponent, ReactElement } from 'react'
import {
  EuiBadge,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'
import { FormattedMessage } from 'react-intl'
import { CuiRouterLinkButton } from '../../../../../cui'

import './deploymentFeatureItem.scss'

interface LinkButton {
  href: string
  text: ReactElement
}

interface Props {
  title: ReactElement
  description: ReactElement
  linkButton: LinkButton
  isNew?: boolean
}

class DeploymentFeatureItem extends PureComponent<Props> {
  render(): ReactElement {
    const {
      description,
      linkButton: { href, text },
    } = this.props

    return (
      <EuiPanel color='subdued' className='deployment-feature-section' paddingSize='l'>
        <EuiTitle size='s'>
          <h3>{this.renderTitle()}</h3>
        </EuiTitle>
        <EuiSpacer size='s' />
        <EuiText color='subdued'>
          <p>{description}</p>
        </EuiText>
        <EuiSpacer size='m' />
        <CuiRouterLinkButton fill={true} to={href}>
          {text}
        </CuiRouterLinkButton>
      </EuiPanel>
    )
  }

  renderTitle(): ReactElement {
    const { isNew, title } = this.props

    if (isNew) {
      return (
        <EuiFlexGroup alignItems='center' gutterSize='s' justifyContent='center' responsive={false}>
          <EuiFlexItem grow={false}>{title}</EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiBadge color='accent'>
              <FormattedMessage id='deployment-features.badge.new' defaultMessage='New' />
            </EuiBadge>
          </EuiFlexItem>
        </EuiFlexGroup>
      )
    }

    return title
  }
}

export default DeploymentFeatureItem

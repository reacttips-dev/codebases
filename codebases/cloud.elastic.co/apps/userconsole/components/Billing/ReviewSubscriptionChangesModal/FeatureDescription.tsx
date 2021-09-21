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
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'

import { capitalize } from 'lodash'

import { EuiFlexItem, EuiFlexGroup, EuiText, EuiBadge, EuiSpacer } from '@elastic/eui'

import DocLink from '../../../../../components/DocLink'

import { supportUrl } from '../../../../../lib/urlBuilder'

import { features as featureDescriptions } from './messages'

type Props = {
  intl: IntlShape
  feature: string
  level: string
}

// Standard is included to avoid breaking anything, but it really should never be shown in the modal
const badgeColors = {
  standard: `hollow`,
  gold: `warning`,
  platinum: `default`,
  enterprise: `secondary`,
}

class FeatureDescription extends Component<Props> {
  render() {
    const { feature, level } = this.props
    const featureDisplayValues = this.getFeatureDisplayValues({ feature, level })
    const {
      subscriptionColor,
      featurePrettyName,
      featureCallToAction,
      featureLink,
      featureLinkText,
    } = featureDisplayValues

    return (
      <Fragment>
        <EuiFlexGroup gutterSize='xs' direction='column'>
          <EuiFlexItem>
            <EuiFlexGroup responsive={false}>
              <EuiFlexItem grow={false}>
                <EuiText size='s'>{featurePrettyName}</EuiText>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiBadge color={subscriptionColor}>{capitalize(level)}</EuiBadge>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText size='s' color='subdued'>
              <FormattedMessage
                {...featureCallToAction}
                values={{
                  link: featureDescriptions[feature] ? (
                    <DocLink link={featureLink} showExternalLinkIcon={false}>
                      <FormattedMessage {...featureLinkText} />
                    </DocLink>
                  ) : (
                    <Link to={supportUrl()}>
                      <FormattedMessage {...featureLinkText} />
                    </Link>
                  ),
                }}
              />
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer />
      </Fragment>
    )
  }

  getFeatureDisplayValues({ feature, level }) {
    const {
      intl: { formatMessage },
    } = this.props
    const featureDescription = featureDescriptions[feature]

    return {
      subscriptionColor: badgeColors[level],
      featurePrettyName:
        featureDescription && featureDescriptions[feature].prettyName
          ? formatMessage(featureDescriptions[feature].prettyName)
          : capitalize(feature),
      featureCallToAction:
        featureDescription && featureDescriptions[feature].description
          ? featureDescriptions[feature].description
          : featureDescriptions.default.description,
      featureLink:
        featureDescription && featureDescriptions[feature].link
          ? featureDescriptions[feature].link
          : null,
      featureLinkText:
        featureDescription && featureDescriptions[feature].linkText
          ? featureDescriptions[feature].linkText
          : featureDescriptions.default.linkText,
    }
  }
}

export default injectIntl(FeatureDescription)

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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage, injectIntl, defineMessages, IntlShape } from 'react-intl'

import { EuiIcon, EuiToolTip, EuiFlexGroup, EuiFlexItem, EuiText, EuiSpacer } from '@elastic/eui'

import { withErrorBoundary } from '../../../../../cui'

import { getSliderInstanceColor, getSliderPrettyName } from '../../../../../lib/sliders'

import { VersionNumber, ZoneSummaryKey as ZoneSummaryKeyType } from '../../../../../types'

type Props = {
  intl: IntlShape
  keys: ZoneSummaryKeyType
  version: VersionNumber | null | undefined
}

const messages = defineMessages({
  keyHelp: {
    id: `zone-summary-key.key-help`,
    defaultMessage: `Each circle color represents a different node type.`,
  },
  ingest: {
    id: `zone-summary-key.ingest-type`,
    defaultMessage: `Ingest`,
  },
})

const ZoneSummaryKey: FunctionComponent<Props> = ({ intl, keys, version }) => (
  <div className='create-deployment-summary-zone-key'>
    <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
      <EuiFlexItem grow={false}>
        <strong>
          <FormattedMessage id='zone-summary-key.title' defaultMessage='Architecture key' />
        </strong>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiToolTip content={intl.formatMessage(messages.keyHelp)}>
          <EuiIcon type='iInCircle' />
        </EuiToolTip>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiSpacer size='m' />

    {keys.map(([instance], keyIndex) => {
      const { sliderInstanceType, sliderNodeType = [] } = instance

      const sliderTypeNames = (sliderNodeType as string[]).map((sliderNodeType) => {
        const messageDescriptor = getSliderPrettyName({
          sliderInstanceType,
          sliderNodeType,
          version,
        })
        return intl.formatMessage(messageDescriptor)
      })

      const ingestIndex = sliderNodeType.indexOf(`ingest`)

      if (ingestIndex !== -1) {
        sliderTypeNames.splice(ingestIndex, 0, intl.formatMessage(messages.ingest))
      }

      return (
        <Fragment key={keyIndex}>
          {keyIndex === 0 || <EuiSpacer size='m' />}

          <EuiFlexGroup gutterSize='s' alignItems='flexStart' responsive={false}>
            <EuiFlexItem grow={false}>
              <div>
                <span
                  className='zone-key__legend'
                  style={{ backgroundColor: getSliderInstanceColor(instance.type, instance.index) }}
                />
              </div>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <div>
                <EuiText size='s'>
                  <strong
                    className='zone-key__instance-name'
                    data-test-id={`zone-key-${instance.id}`}
                  >
                    {instance.name}
                  </strong>
                </EuiText>

                <EuiSpacer size='s' />

                <EuiFlexGroup gutterSize='xs' alignItems='center' responsive={false} wrap={true}>
                  {sliderTypeNames.map((sliderTypeName, sliderTypeIndex) => (
                    <Fragment key={sliderTypeName}>
                      {sliderTypeIndex === 0 || (
                        <EuiFlexItem grow={false}>
                          <EuiText size='xs' color='subdued'>{`\u00b7`}</EuiText>
                        </EuiFlexItem>
                      )}

                      <EuiFlexItem grow={false}>
                        <EuiText size='xs' color='subdued'>
                          {sliderTypeName}
                        </EuiText>
                      </EuiFlexItem>
                    </Fragment>
                  ))}
                </EuiFlexGroup>

                <EuiSpacer size='xs' />

                <div>
                  <EuiText size='xs' color='subdued'>
                    {instance.storagePerInstance ? instance.storagePerInstance : instance.size}
                  </EuiText>
                </div>
              </div>
            </EuiFlexItem>
          </EuiFlexGroup>
        </Fragment>
      )
    })}
  </div>
)

export default withErrorBoundary(injectIntl(ZoneSummaryKey))

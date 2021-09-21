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

import React, { Component } from 'react'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { EuiButtonIcon, EuiFormHelpText, EuiPopover, EuiSpacer } from '@elastic/eui'

import { getNumber } from '../helpers'

import prettySize from '../../../../../../../lib/prettySize'

import DocLink from '../../../../../../DocLink'

interface Props extends WrappedComponentProps {
  primaryKey: string
  instanceResource: 'storage' | 'memory'
  storageMultiplier?: number
  size: number
}

type State = {
  isFrozenPopoverOpen: boolean
}

const messages = defineMessages({
  frozenHelp: {
    id: `size-picker.frozen-tier.help`,
    defaultMessage: `Learn more about frozen tier sizing …`,
  },
})

class FrozenSizingPopover extends Component<Props, State> {
  state = {
    isFrozenPopoverOpen: false,
  }

  render() {
    const {
      intl: { formatMessage },
      primaryKey,
      instanceResource,
      storageMultiplier,
      size,
    } = this.props
    const { isFrozenPopoverOpen } = this.state

    const searchableSize = getNumber({
      instanceResource,
      storageMultiplier,
      totalSize: size,
      resourceType: primaryKey,
      isBlobStorage: true,
    })

    const cachedSize = getNumber({
      instanceResource,
      storageMultiplier,
      totalSize: size,
      resourceType: primaryKey,
      isBlobStorage: false,
    })

    return (
      <EuiPopover
        button={
          <EuiButtonIcon
            onClick={() => {
              this.setState({ isFrozenPopoverOpen: !isFrozenPopoverOpen })
            }}
            aria-label={formatMessage(messages.frozenHelp)}
            iconType='questionInCircle'
            data-test-id='size-picker-blob-storage-help'
          />
        }
        ownFocus={true}
        isOpen={isFrozenPopoverOpen}
        closePopover={() => this.setState({ isFrozenPopoverOpen: false })}
        anchorPosition='rightCenter'
        panelPaddingSize='m'
      >
        <EuiFormHelpText style={{ width: 300 }}>
          <FormattedMessage
            id='size-picker.frozen-tier.sizing'
            defaultMessage='Provides {searchableSize} for {cachedSize}.'
            values={{
              searchableSize: (
                <strong>
                  <FormattedMessage
                    id='size-picker.frozen-tier.searchable'
                    defaultMessage='{size} of searchable storage'
                    values={{ size: prettySize(searchableSize) }}
                  />
                </strong>
              ),
              cachedSize: (
                <strong>
                  <FormattedMessage
                    id='size-picker.frozen-tier.cached'
                    defaultMessage='{size} of cached storage'
                    values={{ size: prettySize(cachedSize) }}
                  />
                </strong>
              ),
            }}
          />
          <EuiSpacer />
          <FormattedMessage
            id='size-picker.frozen-tier.description'
            defaultMessage='The cache storage is much smaller than the searchable storage. It contains only recently searched data, allowing you to query very large data sets with minimal compute resources. {learnMore}'
            values={{
              learnMore: (
                <DocLink link='frozenTier'>
                  <FormattedMessage
                    id='size-picker.frozen-tier.learnMore'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </EuiFormHelpText>
      </EuiPopover>
    )
  }
}

export default injectIntl(FrozenSizingPopover)

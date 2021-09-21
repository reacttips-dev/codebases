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

import React, { Component, Fragment, ReactNode } from 'react'
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import { identity } from 'lodash'

import {
  EuiBadge,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
  EuiSpacer,
  EuiTextColor,
  EuiTitle,
  htmlIdGenerator,
} from '@elastic/eui'

import { MetadataItem } from '../../lib/api/v1/types'

export type Tag = string | MetadataItem

interface Props {
  intl: IntlShape
  title?: ReactNode
  tags: Tag[]
  inlineTags?: Tag[]
  getTagKey?: (tag: Tag) => string
  renderTag?: (props: { tag: Tag }) => ReactNode
  maxInlineTags?: number
}

interface PropsWithDefaults {
  renderTag: (props: { tag: Tag }) => ReactNode
  getTagKey: (tag: Tag) => string
  maxInlineTags: number
}

type FinalProps = Props & PropsWithDefaults

interface State {
  isOpen: boolean
  popoverId: string
}

const messages = defineMessages({
  showAllTags: {
    id: `allocator-tags.show-all-tags`,
    defaultMessage: `Show all tags`,
  },
})

const makeId = htmlIdGenerator()

class ExpansibleTagList extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    maxInlineTags: 2,
    getTagKey: identity,
    renderTag: renderBareTag,
  }

  state: State = {
    isOpen: false,
    popoverId: makeId(),
  }

  render() {
    const { isOpen, popoverId } = this.state

    const {
      intl: { formatMessage },
      title,
      tags,
      inlineTags: userInlineTags,
      getTagKey,
      renderTag,
      maxInlineTags,
    } = this.props as FinalProps

    const inlineTags = userInlineTags || tags.slice(0, maxInlineTags)

    const isExpansible = tags.length > inlineTags.length

    if (inlineTags.length === 0) {
      return (
        <EuiTextColor color='subdued'>
          <FormattedMessage id='expansible-tag-list.empty' defaultMessage='None' />
        </EuiTextColor>
      )
    }

    return (
      <EuiFlexGroup gutterSize='s' wrap={true} responsive={false} alignItems='center'>
        {inlineTags.map((tag) => (
          <EuiFlexItem key={getTagKey(tag)} grow={false}>
            {renderTag({ tag })}
          </EuiFlexItem>
        ))}

        {isExpansible && (
          <EuiFlexItem grow={false}>
            <EuiPopover
              id={popoverId}
              button={
                <EuiButtonIcon
                  aria-label={formatMessage(messages.showAllTags)}
                  iconType='boxesHorizontal'
                  color='subdued'
                  onClick={() => this.setState({ isOpen: true })}
                />
              }
              closePopover={() => this.setState({ isOpen: false })}
              isOpen={isOpen}
            >
              <div style={{ maxWidth: `400px` }}>
                {title && (
                  <Fragment>
                    <EuiTitle size='xs'>
                      <h5>{title}</h5>
                    </EuiTitle>

                    <EuiSpacer size='s' />
                  </Fragment>
                )}

                <EuiFlexGroup gutterSize='s' wrap={true} responsive={false}>
                  {tags.map((tag) => (
                    <EuiFlexItem key={getTagKey(tag)} grow={false}>
                      {renderTag({ tag })}
                    </EuiFlexItem>
                  ))}
                </EuiFlexGroup>
              </div>
            </EuiPopover>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    )
  }
}

function renderBareTag({ tag }) {
  return <EuiBadge color='hollow'>{tag}</EuiBadge>
}

export const CuiExpansibleTagList = injectIntl(ExpansibleTagList)

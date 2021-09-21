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

import React, { FunctionComponent } from 'react'
import { injectIntl, defineMessages, IntlShape } from 'react-intl'

import { EuiLoadingContent } from '@elastic/eui'

import Thumbnail from './Thumbnail'

import { transparentPixelHref } from '../../../../lib/images'

type Props = {
  intl: IntlShape
}

const messages = defineMessages({
  loading: {
    id: 'portal-loading-thumbnail.loading',
    defaultMessage: 'Loading …',
  },
})

const LoadingThumbnail: FunctionComponent<Props> = ({ intl: { formatMessage } }) => (
  <Thumbnail
    title={<EuiLoadingContent lines={1} />}
    description={<EuiLoadingContent lines={2} />}
    src={transparentPixelHref}
    alt={formatMessage(messages.loading)}
    isExternalLink={false}
    data-test-id='portal-loading-thumbnail'
  />
)

export default injectIntl(LoadingThumbnail)

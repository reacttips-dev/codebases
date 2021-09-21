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
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import prettySize from '../../../../lib/prettySize'

const messages = defineMessages({
  storage: {
    id: `deployment-templates.label-storage-amount`,
    defaultMessage: `{ storage } Storage`,
  },
  memory: {
    id: `deployment-templates.label-memory-amount`,
    defaultMessage: `{ memory } RAM`,
  },
})

type Props = WrappedComponentProps & {
  resource: 'storage' | 'memory'
  size: number
}

const RatioLabel: FunctionComponent<Props> = ({
  resource,
  size,
  intl: { formatMessage },
}: Props) => {
  if (resource === `storage`) {
    // @ts-ignore: TypeScript needs to be fine with returning strings for FunctionComponent
    // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18912
    return formatMessage(messages.storage, { storage: prettySize(size) }) as any
  }

  if (resource === `memory`) {
    // @ts-ignore: TypeScript needs to be fine with returning strings for FunctionComponent
    // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18912
    return formatMessage(messages.memory, { memory: prettySize(size) }) as any
  }
}

export default injectIntl(RatioLabel)

export function getResourceLabel(resource: 'storage' | 'memory') {
  if (resource === `storage`) {
    return <FormattedMessage id='deployment-templates.label-storage' defaultMessage='Storage' />
  }

  if (resource === `memory`) {
    return <FormattedMessage id='deployment-templates.label-memory' defaultMessage='RAM' />
  }
}

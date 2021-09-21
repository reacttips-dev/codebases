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

import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { getSliderPrettyName, isSliderInstanceType } from '../../../lib/sliders'
import { VersionNumber } from '../../../types'

import { ExplainedChangeType } from './types'

export function getProductName({
  type,
  version,
}: {
  type: ExplainedChangeType
  version: VersionNumber | null | undefined
}): ReactElement {
  if (isSliderInstanceType(type)) {
    return <FormattedMessage {...getSliderPrettyName({ sliderInstanceType: type, version })} />
  }

  if (type === `deployment`) {
    return (
      <FormattedMessage id='explain-changes.deployment-product-name' defaultMessage='Deployment' />
    )
  }

  throw new Error(`Unexpected product type "${type}"`)
}

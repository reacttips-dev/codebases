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

import cx from 'classnames'
import React, { Fragment } from 'react'

import { EuiSpacer, EuiFormLabel } from '@elastic/eui'

function Label({ component: Component = `div`, srOnly, className, ...props }) {
  const extraProps = {}

  const classes = srOnly == null ? className : cx({ 'sr-only': true }, className)

  // avoid `undefined` prop noise
  if (classes != null) {
    extraProps.className = classes
  }

  return (
    <Fragment>
      <EuiFormLabel>
        <Component {...props} {...extraProps} />
      </EuiFormLabel>
      <EuiSpacer size='s' />
    </Fragment>
  )
}

Label.formRole = `label`

export default Label

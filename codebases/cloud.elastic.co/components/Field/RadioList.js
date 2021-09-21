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
import React from 'react'

function RadioList({ children, className, labelId, ...props }) {
  const newChildren = React.Children.map(children, (child, i) => <li key={i}>{child}</li>)

  return (
    <ul
      role='radiogroup'
      className={cx(`checkable-list`, className)}
      aria-labelledby={labelId}
      children={newChildren}
      {...props}
    />
  )
}

RadioList.formRole = `control`

export default RadioList

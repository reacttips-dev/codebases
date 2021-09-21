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

import React, { Fragment, FunctionComponent, ReactNode } from 'react'

import { ReduxState } from '../../types'

type GateProps = {
  allow?: (storeState: ReduxState) => boolean
  deny?: (storeState: ReduxState) => boolean
  // A gate can be reversed to get the opposite effect: "when condition is _not_ met render …"
  reverse?: boolean
  storeState: ReduxState
}

type Props = GateProps & {
  children: ReactNode
}

export function isAllowed({ allow, deny, reverse, storeState }: GateProps): boolean {
  if (!allow && !deny) {
    // if both allow and deny are missing, there's no point in using
    // this component, so assume a mistake and err on the side of caution
    return false
  }

  const denySide = deny ? deny(storeState) : false
  const allowSide = allow ? allow(storeState) : true
  const allowedPartial = allowSide && !denySide
  const allowed = reverse ? !allowedPartial : allowedPartial

  return allowed
}

const Gate: FunctionComponent<Props> = ({ children, ...props }) => {
  const allowed = isAllowed(props)

  if (!allowed) {
    return null
  }

  return <Fragment>{children}</Fragment>
}

export default Gate

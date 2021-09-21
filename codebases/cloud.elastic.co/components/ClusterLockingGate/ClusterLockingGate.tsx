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

type Props = {
  isLocked: boolean
  onLocked?: () => ReactNode
}

const ClusterLockingGate: FunctionComponent<Props> = ({
  isLocked,
  onLocked = () => null,
  children,
}) => <Fragment>{isLocked ? onLocked() : children}</Fragment>

export default ClusterLockingGate

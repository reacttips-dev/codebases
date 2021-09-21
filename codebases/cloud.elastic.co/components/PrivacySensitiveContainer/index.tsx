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

import React, { FunctionComponent, HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement & HTMLSpanElement> {
  nativeElementType?: 'div' | 'span'
  'data-test-id'?: string
}

// WARNING: These data-test-id are being used to exclude tracked items from FullStory.
// This is a matter of PRIVACY, any changes here need approval of @amoldovan or @osman
const PrivacySensitiveContainer: FunctionComponent<Props> = ({
  nativeElementType: NativeElement = 'div',
  'data-test-id': dataTestId,
  children,
  ...rest
}) => {
  const fsTestId = `privacy-fs`
  const testId = [fsTestId, dataTestId].filter(Boolean).join(` `)

  return (
    <NativeElement data-test-id={testId} {...rest}>
      {children}
    </NativeElement>
  )
}

export default PrivacySensitiveContainer
